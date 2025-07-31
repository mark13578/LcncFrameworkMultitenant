// src/pages/RoleManagementPage.tsx
import { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton, Dialog, DialogTitle, DialogContent, TextField, DialogActions, CircularProgress, Alert, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import roleService from '../services/roleService';
import type { Role, RoleInput } from '../services/roleService';
import axios from 'axios';

const RoleManagementPage = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<Partial<RoleInput> & { id?: string }>({});

  const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
      return error.response?.data?.message || error.message;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return '發生未知錯誤';
  };

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const data = await roleService.getRoles();
      setRoles(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleOpen = (role?: Role) => {
    if (role) {
      setCurrentRole({ id: role.id, name: role.name, description: role.description });
    } else {
      setCurrentRole({ name: '', description: '' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentRole({});
  };

  const handleSave = async () => {
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
      await fetchRoles();
      handleClose();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('您確定要刪除這個角色嗎？')) {
      try {
        await roleService.deleteRole(id);
        await fetchRoles();
      } catch (err) {
        setError(getErrorMessage(err));
      }
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">角色管理</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>新增角色</Button>
      </Box>
      {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>角色名稱</TableCell>
              <TableCell>描述</TableCell>
              <TableCell align="right">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>{role.name}</TableCell>
                <TableCell>{role.description}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleOpen(role)}><EditIcon /></IconButton>
                  <IconButton size="small" onClick={() => handleDelete(role.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{currentRole.id ? '編輯角色' : '新增角色'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="角色名稱"
            type="text"
            fullWidth
            variant="outlined"
            value={currentRole.name || ''}
            onChange={(e) => setCurrentRole(prev => ({ ...prev, name: e.target.value }))}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="描述"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={currentRole.description || ''}
            onChange={(e) => setCurrentRole(prev => ({ ...prev, description: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>取消</Button>
          <Button onClick={handleSave} variant="contained">儲存</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoleManagementPage;