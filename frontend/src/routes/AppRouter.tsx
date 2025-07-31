// src/routes/AppRouter.tsx
import { createBrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import ProtectedRoute from './ProtectedRoute'; 
// <-- 引用 ProtectedRoute，這是用於保護路由的組件
import FormViewerPage from '../pages/FormViewerPage'; 
// <-- 引用 FormViewerPage，這是用於顯示表單的頁面
import FormBuilderPage from '../pages/FormBuilderPage'; 
// 引用 FormBuilderPage，這是用於表單編輯的頁面
import DepartmentManagementPage from '../pages/DepartmentManagementPage';
// 引用 RoleManagementPage，這是用於角色管理的頁面
import RoleManagementPage from '../pages/RoleManagementPage';
// 引用 UserManagementPage，這是用於使用者管理的頁面
import UserManagementPage from '../pages/UserManagementPage';
import MenuManagementPage from '../pages/MenuManagementPage';
import MainLayout from '../components/layout/MainLayout';


const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    // ↓↓ 修改這裡，將 DashboardPage 包起來 ↓↓
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true, // index: true 代表這是 '/' 的預設子路由
        element: <DashboardPage />,
      },
      {
        path: 'builder',
        element: <FormBuilderPage />,
      },
      {
        path: 'forms/:formName',
        element: <FormViewerPage />,
      },
      {
        path: 'management/departments',
        element: <DepartmentManagementPage />,
      },
      {
        path: 'management/roles',
        element: <RoleManagementPage />,
      },
      {
        path: 'management/users',
        element: <UserManagementPage />,
      },
      {
        path: 'management/menus',
        element: <MenuManagementPage />,
      },
    ],
  },
  

]);

export default router;