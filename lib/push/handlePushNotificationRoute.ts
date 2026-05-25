import { router } from 'expo-router';
import type { NotificationResponse } from 'expo-notifications';

type PushData = Record<string, unknown>;

function asString(value: unknown): string {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return '';
}

export function navigateFromPushData(data: PushData | undefined): void {
  if (!data) return;

  const type = asString(data.type);

  if (type === 'message') {
    const peerId = asString(data.peerId) || asString(data.senderId);
    if (peerId) {
      router.push({ pathname: '/chat/[peerId]', params: { peerId } });
    } else {
      router.push('/(tabs)/messages');
    }
    return;
  }

  if (type === 'friend_request' || type === 'friend_accepted') {
    router.push('/mes-mamans');
    return;
  }

  if (type === 'rencontre_friend_request') {
    router.push('/(tabs)/rencontrer');
    return;
  }

  if (type === 'sos_maman_reply') {
    const postId = asString(data.postId);
    if (postId) {
      router.push({ pathname: '/sos-maman/[postId]', params: { postId } });
    } else {
      router.push('/(tabs)/sos-maman');
    }
    return;
  }

  const screen = asString(data.screen);
  if (screen === 'chat') {
    const peerId = asString(data.peerId) || asString(data.senderId);
    if (peerId) {
      router.push({ pathname: '/chat/[peerId]', params: { peerId } });
      return;
    }
  }
  if (screen === 'mes-mamans') {
    router.push('/mes-mamans');
    return;
  }
  if (screen === 'rencontrer') {
    router.push('/(tabs)/rencontrer');
    return;
  }
  if (screen === 'sos-maman') {
    const postId = asString(data.postId);
    if (postId) {
      router.push({ pathname: '/sos-maman/[postId]', params: { postId } });
    } else {
      router.push('/(tabs)/sos-maman');
    }
  }
}

export function handlePushNotificationResponse(response: NotificationResponse): void {
  const data = response.notification.request.content.data as PushData | undefined;
  navigateFromPushData(data);
}
