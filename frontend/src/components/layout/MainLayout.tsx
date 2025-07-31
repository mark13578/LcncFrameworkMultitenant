// src/components/layout/MainLayout.tsx
import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse, IconButton, CircularProgress } from '@mui/material';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import LogoutIcon from '@mui/icons-material/Logout';
import menuService from '../../services/menuService';
import authService from '../../services/authService';
import type { MenuItem as Menu } from '../../services/menuService';
import IconMapper from '../IconMapper';

const drawerWidth = 240;

const MainLayout = () => {
  const [menuItems, setMenuItems] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

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
        <Outlet /> {/* <-- 子頁面內容將會被渲染在這裡 */}
      </Box>
    </Box>
  );
};

export default MainLayout;