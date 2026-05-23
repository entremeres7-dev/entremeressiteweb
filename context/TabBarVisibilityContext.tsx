import React, { createContext, useContext, useMemo, useState } from 'react';

type TabBarVisibilityContextValue = {
  tabBarHidden: boolean;
  setTabBarHidden: (hidden: boolean) => void;
};

const TabBarVisibilityContext = createContext<TabBarVisibilityContextValue | null>(null);

export function TabBarVisibilityProvider({ children }: { children: React.ReactNode }) {
  const [tabBarHidden, setTabBarHidden] = useState(false);
  const value = useMemo(
    () => ({ tabBarHidden, setTabBarHidden }),
    [tabBarHidden],
  );

  return (
    <TabBarVisibilityContext.Provider value={value}>
      {children}
    </TabBarVisibilityContext.Provider>
  );
}

export function useTabBarVisibility() {
  const ctx = useContext(TabBarVisibilityContext);
  if (!ctx) {
    throw new Error('useTabBarVisibility doit être utilisé dans TabBarVisibilityProvider');
  }
  return ctx;
}
