// src/pages/MenuManagementPage.tsx
import { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton, Dialog, DialogTitle, DialogContent, TextField, DialogActions, CircularProgress, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import menuService from '../services/menuService';
import type { MenuItem as MenuItemType, MenuInput } from '../services/menuService';
import axios from 'axios';
import IconMapper from '../components/IconMapper';
import { availableIcons } from '../utils/iconUtils'; // <-- 修正點：從新的路徑引用

const findMenuItemById = (nodes: MenuItemType[], id: string): MenuItemType | null => {
    for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children) {
            const found = findMenuItemById(node.children, id);
            if (found) return found;
        }
    }
    return null;
};

const MenuManagementPage = () => {
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<MenuInput> & { id?: string }>({});

  const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) { return error.response?.data?.message || error.message; }
    if (error instanceof Error) { return error.message; }
    return '發生未知錯誤';
  };

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const data = await menuService.getMenus();
      setMenuItems(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleOpen = (item?: MenuItemType, parentId?: string) => {
    if (item) {
      setCurrentItem({ id: item.id, name: item.name, icon: item.icon, path: item.path, sortOrder: item.sortOrder, parentId: item.parentId });
    } else {
      setCurrentItem({ name: '', icon: 'helpoutline', path: '/', sortOrder: 0, parentId: parentId });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentItem({});
  };

  const handleSave = async () => {
    try {
      if (!currentItem.name || !currentItem.path) {
        alert('選單名稱和路徑為必填項。');
        return;
      }
      const inputData: MenuInput = { 
          name: currentItem.name, 
          icon: currentItem.icon, 
          path: currentItem.path, 
          sortOrder: currentItem.sortOrder || 0, 
          parentId: currentItem.parentId 
        };

      if (currentItem.id) {
        await menuService.updateMenuItem(currentItem.id, inputData);
      } else {
        await menuService.createMenuItem(inputData);
      }
      await fetchMenus();
      handleClose();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm('您確定要刪除這個選單項目嗎？')) {
      try {
        await menuService.deleteMenuItem(id);
        await fetchMenus();
      } catch (err) {
        setError(getErrorMessage(err));
      }
    }
  };

  if (loading) return <CircularProgress />;
  
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">選單管理</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>新增根選單</Button>
      </Box>
      {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}
      
      <RichTreeView
        items={menuItems}
        getItemId={(item) => item.id}
        getItemLabel={(item) => item.name}
        slotProps={{
          item: (ownerState) => {
            const currentItem = findMenuItemById(menuItems, ownerState.itemId);
            return {
              label: (
                <Box sx={{ display: 'flex', alignItems: 'center', py: 0.5, pr: 1 }}>
                  <IconMapper iconName={currentItem?.icon} />
                  <Typography sx={{ flexGrow: 1, ml: 1 }}>{ownerState.label}</Typography>
                  <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleOpen(undefined, ownerState.itemId); }}><AddIcon fontSize="inherit" /></IconButton>
                  <IconButton size="small" onClick={(e) => { e.stopPropagation(); if(currentItem) handleOpen(currentItem); }}><EditIcon fontSize="inherit" /></IconButton>
                  <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDelete(ownerState.itemId); }}><DeleteIcon fontSize="inherit" /></IconButton>
                </Box>
              ),
            };
          },
        }}
        sx={{ flexGrow: 1, overflowY: 'auto' }}
      />

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{currentItem.id ? '編輯選單項目' : '新增選單項目'}</DialogTitle>
        <DialogContent>
            <TextField autoFocus margin="dense" label="選單名稱" type="text" fullWidth variant="outlined" value={currentItem.name || ''} onChange={(e) => setCurrentItem(prev => ({ ...prev, name: e.target.value }))} sx={{mt: 2, mb: 2}} />
            <TextField margin="dense" label="路徑 (e.g., /dashboard)" type="text" fullWidth variant="outlined" value={currentItem.path || ''} onChange={(e) => setCurrentItem(prev => ({ ...prev, path: e.target.value }))} sx={{mb: 2}} />
            
            {/* ↓↓ 修正點：將 TextField 替換為 Select ↓↓ */}
            <FormControl fullWidth margin="dense">
              <InputLabel>圖示</InputLabel>
              <Select
                value={currentItem.icon || ''}
                label="圖示"
                onChange={(e) => setCurrentItem(prev => ({ ...prev, icon: e.target.value }))}
              >
                {availableIcons.map(iconName => (
                  <MenuItem key={iconName} value={iconName}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconMapper iconName={iconName} />
                      <Typography sx={{ ml: 2 }}>{iconName}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField margin="dense" label="排序" type="number" fullWidth variant="outlined" value={currentItem.sortOrder || 0} onChange={(e) => setCurrentItem(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))} sx={{mt: 2}}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>取消</Button>
          <Button onClick={handleSave} variant="contained">儲存</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MenuManagementPage;