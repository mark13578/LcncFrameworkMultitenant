// src/routes/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import authService from '../services/authService';

// React.PropsWithChildren 是一個內建型別，代表元件可以接收子元件
const ProtectedRoute = ({ children }: React.PropsWithChildren) => {
  const token = authService.getToken();

  if (!token) {
    // 如果沒有 token，就導向到登入頁面
    return <Navigate to="/login" replace />;
  }

  // 如果有 token，就正常顯示該頁面的內容 (children)
  return children;
};

export default ProtectedRoute;