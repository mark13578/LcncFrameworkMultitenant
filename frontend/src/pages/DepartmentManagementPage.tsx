// src/pages/DepartmentManagementPage.tsx
import { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton, Dialog, DialogTitle, DialogContent, TextField, DialogActions, CircularProgress, Alert } from '@mui/material';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import departmentService from '../services/departmentService';
import type { Department, DepartmentInput } from '../services/departmentService';
import axios from 'axios';

// --- 步驟一：新增一個遞迴搜尋的輔助函式 ---
// 這個函式可以在樹狀結構的 departments 陣列中，根據 id 找到對應的部門物件
const findDepartmentById = (nodes: Department[], id: string): Department | null => {
  for (const node of nodes) {
    if (node.id === id) {
      return node;
    }
    if (node.children) {
      const found = findDepartmentById(node.children, id);
      if (found) {
        return found;
      }
    }
  }
  return null;
};


const DepartmentManagementPage = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<Partial<DepartmentInput> & { id?: string }>({});

  const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
      return error.response?.data?.message || error.message;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return '發生未知錯誤';
  };

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const data = await departmentService.getDepartments();
      setDepartments(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleOpen = (dept?: Department, parentId?: string) => {
    if (dept) {
      setCurrentDepartment({ id: dept.id, name: dept.name, parentId: dept.parentId });
    } else {
      setCurrentDepartment({ parentId: parentId, name: '' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentDepartment({});
  };

  const handleSave = async () => {
    try {
      if (!currentDepartment.name) {
        alert('部門名稱為必填項。');
        return;
      }
      const inputData: DepartmentInput = { name: currentDepartment.name, parentId: currentDepartment.parentId };
      if (currentDepartment.id) {
        await departmentService.updateDepartment(currentDepartment.id, inputData);
      } else {
        await departmentService.createDepartment(inputData);
      }
      await fetchDepartments();
      handleClose();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm('您確定要刪除這個部門嗎？')) {
      try {
        await departmentService.deleteDepartment(id);
        await fetchDepartments();
      } catch (err) {
        setError(getErrorMessage(err));
      }
    }
  };

  if (loading) return <CircularProgress />;
  
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">部門管理</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>新增根部門</Button>
      </Box>
      {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}
      
      <RichTreeView
        items={departments}
        getItemId={(item) => item.id}
        getItemLabel={(item) => item.name}
        slotProps={{
          item: (ownerState) => ({
            label: (
              <Box sx={{ display: 'flex', alignItems: 'center', py: 0.5, pr: 1 }}>
                <Typography sx={{ flexGrow: 1 }}>{ownerState.label}</Typography>
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleOpen(undefined, ownerState.itemId); }}><AddIcon fontSize="inherit" /></IconButton>
                {/* --- 步驟二：修正 onClick 的邏輯 --- */}
                <IconButton 
                  size="small" 
                  onClick={(e) => { 
                    e.stopPropagation();
                    const departmentToEdit = findDepartmentById(departments, ownerState.itemId);
                    if (departmentToEdit) {
                      handleOpen(departmentToEdit);
                    }
                  }}
                >
                  <EditIcon fontSize="inherit" />
                </IconButton>
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDelete(ownerState.itemId); }}><DeleteIcon fontSize="inherit" /></IconButton>
              </Box>
            ),
            sx: {
              '.MuiTreeItem-content': {
                paddingY: '4px',
              },
            }
          }),
        }}
        sx={{ flexGrow: 1, overflowY: 'auto' }}
      />

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <DialogTitle>{currentDepartment.id ? '編輯部門' : '新增部門'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="部門名稱"
            type="text"
            fullWidth
            variant="outlined"
            value={currentDepartment.name || ''}
            onChange={(e) => setCurrentDepartment(prev => ({ ...prev, name: e.target.value }))}
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

export default DepartmentManagementPage;