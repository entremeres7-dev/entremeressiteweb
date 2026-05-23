import { Alert, Platform } from 'react-native';

export type ActionSheetButton = {
  text: string;
  style?: 'default' | 'destructive' | 'cancel';
  onPress?: () => void | Promise<void>;
};

type SheetPayload = {
  title: string;
  message?: string;
  buttons: ActionSheetButton[];
};

type Listener = (payload: SheetPayload | null) => void;
const listeners = new Set<Listener>();

export function subscribeActionSheet(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function dismissActionSheet() {
  listeners.forEach((l) => l(null));
}

export function showActionSheet(title: string, buttons: ActionSheetButton[], message?: string) {
  if (Platform.OS === 'web') {
    listeners.forEach((l) => l({ title, message, buttons }));
    return;
  }
  Alert.alert(title, message, buttons);
}

export function showConfirmAlert(
  title: string,
  message: string,
  confirmLabel: string,
  onConfirm: () => void | Promise<void>,
  options?: { destructive?: boolean },
) {
  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n\n${message}`)) {
      void Promise.resolve(onConfirm());
    }
    return;
  }
  Alert.alert(title, message, [
    { text: 'Annuler', style: 'cancel' },
    {
      text: confirmLabel,
      style: options?.destructive ? 'destructive' : 'default',
      onPress: onConfirm,
    },
  ]);
}

/** Alerte simple visible sur le web (Alert.alert est souvent silencieux). */
export function showAppAlert(title: string, message?: string, onOk?: () => void) {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      window.alert(message ? `${title}\n\n${message}` : title);
    }
    onOk?.();
    return;
  }
  Alert.alert(title, message, [{ text: 'OK', onPress: onOk }]);
}

export function showLoginRequiredAlert(message: string, onLogin: () => void) {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.confirm(`Connexion requise\n\n${message}\n\nSe connecter maintenant ?`)) {
      onLogin();
    }
    return;
  }
  Alert.alert('Connexion requise', message, [
    { text: 'Annuler', style: 'cancel' },
    { text: 'Se connecter', onPress: onLogin },
  ]);
}
