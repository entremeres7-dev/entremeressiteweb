import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ChatScreen } from '@/components/chat/ChatScreen';
import { supabase } from '@/supabaseClient';
import { useTheme } from '@/context/ThemeContext';

export default function ChatRoute() {
  const { colors } = useTheme();
  const loaderStyle = useMemo(
    () => ({ flex: 1 as const, backgroundColor: colors.bg, alignItems: 'center' as const, justifyContent: 'center' as const }),
    [colors.bg],
  );
  const { peerId, name, photo } = useLocalSearchParams<{
    peerId: string;
    name?: string;
    photo?: string;
  }>();
  const [peerName, setPeerName] = useState(name ?? 'Maman');
  const [peerPhoto, setPeerPhoto] = useState<string | null>(photo ?? null);
  const [loading, setLoading] = useState(!name);

  useEffect(() => {
    if (!peerId || name) {
      setLoading(false);
      return;
    }

    (async () => {
      const { data } = await supabase
        .from('profiles')
        .select('username, photo')
        .eq('id', peerId)
        .maybeSingle();

      if (data?.username) setPeerName(data.username);
      if (data?.photo) setPeerPhoto(data.photo);
      setLoading(false);
    })();
  }, [peerId, name]);

  if (!peerId || loading) {
    return (
      <View style={loaderStyle}>
        <ActivityIndicator color={colors.pink} />
      </View>
    );
  }

  return <ChatScreen peerId={peerId} peerName={peerName} peerPhoto={peerPhoto} />;
}
