import { Redirect } from 'expo-router';

/** Ancienne route Explorer → Table de rencontre */
export default function ExplorerRedirect() {
  return <Redirect href="/(tabs)/rencontrer" />;
}
