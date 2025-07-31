// src/pages/RoleManagementPage.tsx
import { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Alert, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Grid, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import roleService from '../services/roleService';
import menuService from '../services/menuService';
import type { Role, RoleInput } from '../services/roleService';
import type { MenuItem } from '../services/menuService';
import axios from 'axios';


const RoleManagementPage = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [menuTree, setMenuTree] = useState<MenuItem[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<Partial<RoleInput> & { id?: string }>({});
  const isEditMode = !!currentRole.id;

  const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) { return error.response?.data?.message || error.message; }
    if (error instanceof Error) { return error.message; }
    return '發生未知錯誤';
  };
  
  const initialLoad = async () => {
    setLoading(true);
    try {
      // 使用 Promise.all 同時獲取角色列表和完整的選單樹
      const [rolesData, menusData] = await Promise.all([
        roleService.getRoles(),
        menuService.getAllMenusForManagement() 
      ]);
      setRoles(rolesData);
      setMenuTree(menusData);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initialLoad();
  }, []);

  // 當選中角色變更時，非同步獲取該角色的權限
  useEffect(() => {
    if (selectedRole) {
      roleService.getMenuPermissions(selectedRole.id)
        .then(permissionIds => {
          setSelectedPermissions(permissionIds);
        })
        .catch(err => setError(getErrorMessage(err)));
    } else {
      // 如果沒有選中角色，清空權限列表
      setSelectedPermissions([]);
    }
  }, [selectedRole]);

  const handleOpenModal = (role?: Role) => {
    if (role) {
      setCurrentRole({ id: role.id, name: role.name, description: role.description });
    } else {
      setCurrentRole({ name: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentRole({});
  };

  const handleSaveRole = async () => {
    try {
      if (!currentRole.name) {
        alert('角色名稱為必填項。');
        return;
      }
      const inputData: RoleInput = { name: currentRole.name, description: currentRole.description };
      if (currentRole.id) {
        await roleService.updateRole(currentRole.id, inputData);
      } else {
        await roleService.createRole(inputData);
      }
      await initialLoad(); // 重新載入所有資料
      handleCloseModal();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };
  
  const handleDeleteRole = async (id: string) => {
    if (window.confirm('您確定要刪除這個角色嗎？')) {
      try {
        await roleService.deleteRole(id);
        await initialLoad(); // 重新載入所有資料
        if (selectedRole?.id === id) {
          setSelectedRole(null); // 如果刪除的是當前選中的角色，則取消選取
        }
      } catch (err) {
        setError(getErrorMessage(err));
      }
    }
  };
  
  const handleSavePermissions = async () => {
    if (!selectedRole) return;
    try {
      await roleService.updateMenuPermissions(selectedRole.id, selectedPermissions);
      alert('權限儲存成功！');
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (loading) return <CircularProgress />;
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>角色與權限管理</Typography>
      {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}
      
      <Grid container spacing={3}>
        {/* 左側：角色列表 */}
        <Grid item xs={12} md={5}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">角色列表</Typography>
            <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>新增角色</Button>
          </Box>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead><TableRow><TableCell>角色名稱</TableCell><TableCell>描述</TableCell><TableCell align="right">操作</TableCell></TableRow></TableHead>
              <TableBody>
                {roles.map((role) => (
                  <TableRow key={role.id} hover selected={selectedRole?.id === role.id} onClick={() => setSelectedRole(role)} sx={{ cursor: 'pointer' }}>
                    <TableCell>{role.name}</TableCell>
                    <TableCell>{role.description}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleOpenModal(role); }}><EditIcon /></IconButton>
                      <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDeleteRole(role.id); }}><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* 右側：權限設定 */}
        <Grid item xs={12} md={7}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              選單權限設定 {selectedRole ? ` - ${selectedRole.name}` : ''}
            </Typography>
            <Button variant="contained" onClick={handleSavePermissions} disabled={!selectedRole}>儲存權限</Button>
          </Box>
          <Paper sx={{ p: 2, height: '60vh', overflowY: 'auto' }}>
            {selectedRole ? (
              <RichTreeView
                items={menuTree}
                getItemId={(item) => item.id}
                getItemLabel={(item) => item.name}
                checkboxSelection
                multiSelect 
                selectedItems={selectedPermissions}
                onSelectedItemsChange={(event, ids) => setSelectedPermissions(ids)}
                defaultExpandedItems={menuTree.map(m => m.id)}
              />
            ) : (
              <Typography color="textSecondary">請從左側選擇一個角色以設定權限</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* 新增/編輯角色的 Dialog (彈出視窗) */}
      <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>{isEditMode ? '編輯角色' : '新增角色'}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="角色名稱" type="text" fullWidth variant="outlined" value={currentRole.name || ''} onChange={(e) => setCurrentRole(prev => ({...prev, name: e.target.value}))} sx={{ mt: 1 }} />
          <TextField margin="dense" label="描述" type="text" fullWidth multiline rows={3} variant="outlined" value={currentRole.description || ''} onChange={(e) => setCurrentRole(prev => ({...prev, description: e.target.value}))} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>取消</Button>
          <Button onClick={handleSaveRole} variant="contained">儲存</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
export default RoleManagementPage;