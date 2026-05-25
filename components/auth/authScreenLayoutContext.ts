import { createContext, useContext } from 'react';

type AuthScreenLayoutContextValue = {
  formExpanded: boolean;
  setFormExpanded: (expanded: boolean) => void;
};

export const AuthScreenLayoutContext = createContext<AuthScreenLayoutContextValue>({
  formExpanded: false,
  setFormExpanded: () => {},
});

export function useAuthScreenLayout() {
  return useContext(AuthScreenLayoutContext);
}
