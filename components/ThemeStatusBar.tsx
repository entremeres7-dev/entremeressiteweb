import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/context/ThemeContext';

export function ThemeStatusBar() {
  const { isLight } = useTheme();
  return <StatusBar style={isLight ? 'dark' : 'light'} />;
}
