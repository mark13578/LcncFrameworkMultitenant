// src/contexts/AppContext.tsx
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';

type LayoutMode = 'side' | 'top';

interface AppContextType {
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;
}

// 建立 Context
const AppContext = createContext<AppContextType | undefined>(undefined);

// 建立 Provider 元件
export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [layoutMode, setLayoutModeState] = useState<LayoutMode>(() => {
    // 從 localStorage 讀取初始值，若沒有則預設為 'side'
    return (localStorage.getItem('layoutMode') as LayoutMode) || 'side';
  });

  const setLayoutMode = (mode: LayoutMode) => {
    // 將選擇儲存到 localStorage
    localStorage.setItem('layoutMode', mode);
    setLayoutModeState(mode);
  };

  return (
    <AppContext.Provider value={{ layoutMode, setLayoutMode }}>
      {children}
    </AppContext.Provider>
  );
};

// 建立一個自訂 Hook，方便子元件使用
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within a AppContextProvider');
  }
  return context;
};