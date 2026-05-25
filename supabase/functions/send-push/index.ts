import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type PushBody = {
  toUserId?: string;
  title?: string;
  body?: string;
  data?: Record<string, string>;
};

type ProfilePrefs = {
  push_enabled?: boolean | null;
  push_sos_enabled?: boolean | null;
  push_messages_enabled?: boolean | null;
  push_friends_enabled?: boolean | null;
  push_rencontres_enabled?: boolean | null;
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function isAllowedByPreferences(type: string, profile: ProfilePrefs | null): string | null {
  const pushEnabled = profile?.push_enabled !== false;
  if (!pushEnabled) return 'push_disabled';

  if (type === 'sos_maman_reply' && profile?.push_sos_enabled === false) {
    return 'sos_disabled';
  }
  if (type === 'message' && profile?.push_messages_enabled === false) {
    return 'messages_disabled';
  }
  if (type === 'rencontre_friend_request' && profile?.push_rencontres_enabled === false) {
    return 'rencontres_disabled';
  }
  if (type === 'friend_accepted' && profile?.push_friends_enabled === false) {
    return 'friends_disabled';
  }
  if (type === 'friend_request' && profile?.push_friends_enabled === false) {
    return 'friends_disabled';
  }

  return null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !serviceKey) {
      return json({ ok: false, reason: 'missing_env' }, 500);
    }

    const payload = (await req.json()) as PushBody;
    const { toUserId, title, body, data } = payload;

    if (!toUserId || !title || !body) {
      return json({ ok: false, reason: 'invalid_payload' }, 400);
    }

    const supabase = createClient(supabaseUrl, serviceKey);
    const notificationType = data?.type ?? '';

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('push_enabled, push_sos_enabled, push_messages_enabled, push_friends_enabled, push_rencontres_enabled')
      .eq('id', toUserId)
      .maybeSingle();

    if (profileError) {
      return json({ ok: false, reason: 'profile_error', message: profileError.message }, 500);
    }

    const blockedReason = isAllowedByPreferences(notificationType, profile as ProfilePrefs | null);
    if (blockedReason) {
      return json({ ok: false, reason: blockedReason });
    }

    const { data: devices, error: devicesError } = await supabase
      .from('push_devices')
      .select('token')
      .eq('user_id', toUserId)
      .eq('is_active', true);

    if (devicesError) {
      return json({ ok: false, reason: 'devices_error', message: devicesError.message }, 500);
    }

    const tokens = (devices ?? [])
      .map((d) => d.token)
      .filter((token): token is string => typeof token === 'string' && token.length > 0);

    if (!tokens.length) {
      return json({ ok: false, reason: 'no_token' });
    }

    const messages = tokens.map((token) => ({
      to: token,
      sound: 'default',
      title,
      body,
      data: data ?? {},
    }));

    const expoResponse = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messages),
    });

    const expoResult = await expoResponse.json();

    return json({
      ok: true,
      sent: messages.length,
      expo: expoResult,
    });
  } catch (error) {
    return json(
      {
        ok: false,
        reason: 'server_error',
        message: error instanceof Error ? error.message : String(error),
      },
      500,
    );
  }
});
