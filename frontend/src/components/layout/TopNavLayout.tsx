// src/components/layout/TopNavLayout.tsx
import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, CircularProgress, Select } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import authService from '../../services/authService';
import menuService from '../../services/menuService';
import type { MenuItem as MenuType } from '../../services/menuService';
import SettingsMenu from './SettingsMenu';
import { useTranslation } from 'react-i18next';
import IconMapper from '../IconMapper';

const TopNavLayout = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [menuItems, setMenuItems] = useState<MenuType[]>([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    menuService.getMenus()
      .then(data => setMenuItems(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, menuId: string) => {
    setAnchorEl({ ...anchorEl, [menuId]: event.currentTarget });
  };

  const handleMenuClose = (menuId: string) => {
    setAnchorEl({ ...anchorEl, [menuId]: null });
  };
  
  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My LCNC Framework
          </Typography>
          
          {loading ? <CircularProgress color="inherit" size={24} /> : menuItems.map(item => {
            if (item.children && item.children.length > 0) {
              return (
                <Box key={item.id}>
                  <Button
                    color="inherit"
                    endIcon={<ArrowDropDownIcon />}
                    onClick={(e) => handleMenuOpen(e, item.id)}
                  >
                    {item.name}
                  </Button>
                  <Menu
                    anchorEl={anchorEl[item.id]}
                    open={Boolean(anchorEl[item.id])}
                    onClose={() => handleMenuClose(item.id)}
                  >
                    {item.children.map(child => (
                      <MenuItem key={child.id} component={NavLink} to={child.path} onClick={() => handleMenuClose(item.id)}>
                         <IconMapper iconName={child.icon} />
                         <Typography sx={{ ml: 1 }}>{child.name}</Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              );
            }
            return (
              <Button key={item.id} color="inherit" component={NavLink} to={item.path}>
                {item.name}
              </Button>
            );
          })}

          <SettingsMenu />
          <Select
            value={i18n.language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            variant="standard"
            disableUnderline
            sx={{ color: 'white', '& .MuiSvgIcon-root': { color: 'white' }, mx: 1 }}
          >
            <MenuItem value="zh-TW">繁體中文</MenuItem>
            <MenuItem value="en-US">English</MenuItem>
          </Select>
          <IconButton color="inherit" onClick={handleLogout}><LogoutIcon /></IconButton>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};
export default TopNavLayout;