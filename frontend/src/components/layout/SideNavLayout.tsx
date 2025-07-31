// src/components/layout/SideNavLayout.tsx
import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse, IconButton, CircularProgress, Select, MenuItem } from '@mui/material';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import LogoutIcon from '@mui/icons-material/Logout';
import menuService from '../../services/menuService';
import authService from '../../services/authService';
import type { MenuItem as Menu } from '../../services/menuService';
import IconMapper from '../IconMapper';
import SettingsMenu from './SettingsMenu'; // <-- 引用 SettingsMenu
import { useTranslation } from 'react-i18next'; // <-- 引用 useTranslation

const drawerWidth = 240;

const SideNavLayout = () => {
  const [menuItems, setMenuItems] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  const { i18n } = useTranslation(); // <-- 使用 Hook

  useEffect(() => {
    menuService.getMenus()
      .then(data => setMenuItems(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubMenuClick = (id: string) => {
    setOpenSubMenus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };
  
  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const renderMenuItems = (items: Menu[], depth = 0) => {
    return items.map((item) => {
      if (item.children && item.children.length > 0) {
        return (
          <div key={item.id}>
            <ListItemButton onClick={() => handleSubMenuClick(item.id)} sx={{ pl: 2 + depth * 2 }}>
              <ListItemIcon><IconMapper iconName={item.icon} /></ListItemIcon>
              <ListItemText primary={item.name} />
              {openSubMenus[item.id] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openSubMenus[item.id]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renderMenuItems(item.children, depth + 1)}
              </List>
            </Collapse>
          </div>
        );
      }
      return (
        <ListItem key={item.id} disablePadding>
          <ListItemButton component={NavLink} to={item.path} sx={{ pl: 2 + depth * 2 }}>
            <ListItemIcon><IconMapper iconName={item.icon} /></ListItemIcon>
            <ListItemText primary={item.name} />
          </ListItemButton>
        </ListItem>
      );
    });
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            My LCNC Framework
          </Typography>
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
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          {loading ? <CircularProgress sx={{ m: 2 }} /> : <List>{renderMenuItems(menuItems)}</List>}
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default SideNavLayout;