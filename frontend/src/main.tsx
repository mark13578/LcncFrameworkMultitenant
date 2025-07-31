// src/main.tsx
import React, {Suspense} from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import router from './routes/AppRouter';
import theme from './theme/theme';
import './index.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AppContextProvider } from './contexts/AppContext'; // <-- 引用 Provider
import './i18n'; // 引入 i18n 配置
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Suspense fallback="...loading"> 
    {/* 使用 LocalizationProvider 提供日期適配器 */}
    <AppContextProvider>
      {/* AppContextProvider 是你自定義的上下文提供者，確保在這裡正確導入 */}
      {/* 如果沒有這個組件，可以移除這一行 */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RouterProvider router={router} />
        </ThemeProvider>
      </LocalizationProvider>
    </AppContextProvider>
      
      </Suspense>
  </React.StrictMode>
);