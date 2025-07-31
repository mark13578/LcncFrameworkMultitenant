// src/components/layout/MainLayout.tsx
import { useAppContext } from '../../contexts/AppContext';
import SideNavLayout from './SideNavLayout';
import TopNavLayout from './TopNavLayout';

const MainLayout = () => {
  const { layoutMode } = useAppContext();

  // 根據 context 的值，回傳對應的佈局元件
  if (layoutMode === 'top') {
    return <TopNavLayout />;
  }

  // 預設回傳側邊欄佈局
  return <SideNavLayout />;
};

export default MainLayout;