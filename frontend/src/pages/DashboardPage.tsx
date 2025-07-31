// src/pages/DashboardPage.tsx
import { useTranslation } from 'react-i18next'; // <-- 引用 useTranslation Hook
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert, List, ListItem, ListItemButton, ListItemText, Divider, Paper } from '@mui/material';
import formService from '../services/formService';
import type { FormDefinitionResponseDto } from '../services/formService';

const DashboardPage = () => {
  const [forms, setForms] = useState<FormDefinitionResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { t } = useTranslation(); // <-- 使用 useTranslation Hook 來獲取翻譯函數

  useEffect(() => {
    formService.getFormDefinitions()
      .then(data => {
        setForms(data);
      })
      .catch(err => {
        setError('無法載入表單列表: ' + err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('dashboard.title')}
      </Typography>
      <Typography variant="body1" color="textSecondary">
        歡迎使用您的 Low-Code 框架。您可以從下方選擇一個已建立的表單來開始使用，或前往管理後台進行設定。
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" gutterBottom>
        可用表單
      </Typography>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}

      {!loading && !error && (
        <Paper variant="outlined">
          <List>
            {forms.length > 0 ? (
              forms.map(form => (
                <ListItem key={form.id} disablePadding>
                  <ListItemButton component={RouterLink} to={`/forms/${form.name}`}>
                    <ListItemText 
                      primary={form.displayName}
                      secondary={form.description || `表單名稱: ${form.name}`}
                    />
                  </ListItemButton>
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="目前沒有可用的表單。" secondary="請前往「表單編輯器」建立您的第一個表單！" />
              </ListItem>
            )}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default DashboardPage;


// src/pages/DashboardPage.tsx
/*
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, CircularProgress } from '@mui/material'; // 從 MUI 引用 Link
import userService from '../services/userService';
import authService from '../services/authService';
import { Link as RouterLink } from 'react-router-dom'; // 引用 Link

interface UserProfile {
  username: string;
}

const DashboardPage = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await userService.getMyProfile();
        setUser(profile);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        // 如果 token 失效等原因導致請求失敗，也應導向登入頁
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  },
);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (loading) {
    return <CircularProgress />; // 載入中，顯示一個轉圈圈的動畫
  }

  return (
    <Box>
      <Typography variant="h4">
        主控台
      </Typography>
      {user && <Typography variant="h6">歡迎您，{user.username}！</Typography>}

      {/* ↓↓ 加入前往編輯器的連結按鈕 ↓↓ }
      <Button component={RouterLink} to="/builder" variant="outlined" sx={{ mt: 2, mr: 2 }}>
        前往表單編輯器
      </Button>
      {/* ↓↓ 加入前往部門管理的連結按鈕 ↓↓ }
      <Button component={RouterLink} to="/management/departments" variant="outlined" sx={{ mt: 2, mr: 2 }}>
        部門管理
      </Button>
      {/* ↓↓ 加入前往角色管理的連結按鈕 ↓↓ }
      <Button component={RouterLink} to="/management/roles" variant="outlined" sx={{ mt: 2, mr: 2 }}>
        角色管理
      </Button>
      <Button component={RouterLink} to="/management/users" variant="outlined" sx={{ mt: 2, mr: 2 }}>
        使用者管理
      </Button>
      <Button component={RouterLink} to="/management/menus" variant="outlined" sx={{ mt: 2, mr: 2 }}>
            選單管理
        </Button>
      <Button variant="contained" onClick={handleLogout} sx={{ mt: 2 }}>
        登出
      </Button>
    </Box>
  );
};

export default DashboardPage;
*/