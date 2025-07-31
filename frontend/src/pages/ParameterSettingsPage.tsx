// src/pages/ParameterSettingsPage.tsx
import { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Alert, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, TextField, DialogActions, FormControlLabel, Switch } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockIcon from '@mui/icons-material/Lock';
import systemParameterService from '../services/systemParameterService';
import type { SystemParameter, CreateSystemParameterInput, UpdateSystemParameterInput } from '../services/systemParameterService';
import axios from 'axios';

const PARAMETER_CATEGORY = 'System'; // <-- 唯一的不同點：指定分類為 'System'

const ParameterSettingsPage = () => {
  const [parameters, setParameters] = useState<SystemParameter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<SystemParameter>>({});
  const isEditMode = !!currentItem.id;

  const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) { return error.response?.data?.message || error.message; }
    if (error instanceof Error) { return error.message; }
    return '發生未知錯誤';
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await systemParameterService.getParametersByCategory(PARAMETER_CATEGORY);
      setParameters(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpen = (item?: SystemParameter) => {
    if (item) {
      setCurrentItem({ ...item });
    } else {
        setCurrentItem({ key: '', value: '', displayName: '', description: '', isSystemLocked: false });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentItem({});
  };

  const handleSave = async () => {
    try {
      if (!currentItem.key) {
        alert('鍵 (Key) 為必填項。');
        return;
      }
      if (isEditMode) {
        const payload: UpdateSystemParameterInput = { value: currentItem.value, displayName: currentItem.displayName, description: currentItem.description };
        await systemParameterService.updateParameter(currentItem.id!, payload);
      } else {
        const payload: CreateSystemParameterInput = {
          category: PARAMETER_CATEGORY,
          key: currentItem.key!,
          value: currentItem.value,
          displayName: currentItem.displayName,
          isSystemLocked: currentItem.isSystemLocked,
          description: currentItem.description,
        };
        await systemParameterService.createParameter(payload);
      }
      await fetchData();
      handleClose();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('您確定要刪除這個參數嗎？')) {
      try {
        await systemParameterService.deleteParameter(id);
        await fetchData();
      } catch (err) {
        setError(getErrorMessage(err));
      }
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">參數設置</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>新增參數</Button>
      </Box>
      {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>參數名稱</TableCell>
              <TableCell>參數鍵名 (Key)</TableCell>
              <TableCell>參數值 (Value)</TableCell>
              <TableCell align="right">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {parameters.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell>
                  {item.displayName}
                  {item.isSystemLocked && <LockIcon sx={{ fontSize: '1rem', ml: 1, verticalAlign: 'middle', color: 'text.disabled' }}/>}
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{item.key}</TableCell>
                <TableCell>{item.value}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleOpen(item)} disabled={item.isSystemLocked}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(item.id)} disabled={item.isSystemLocked}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>{isEditMode ? '編輯參數' : '新增參數'}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="參數鍵名 (Key)" fullWidth variant="outlined" value={currentItem.key || ''} onChange={(e) => setCurrentItem(prev => ({ ...prev, key: e.target.value }))} disabled={isEditMode} sx={{ mt: 2 }}/>
          <TextField margin="dense" label="參數名稱 (DisplayName)" fullWidth variant="outlined" value={currentItem.displayName || ''} onChange={(e) => setCurrentItem(prev => ({ ...prev, displayName: e.target.value }))} />
          <TextField margin="dense" label="參數值 (Value)" fullWidth variant="outlined" value={currentItem.value || ''} onChange={(e) => setCurrentItem(prev => ({ ...prev, value: e.target.value }))} />
          <TextField margin="dense" label="描述" fullWidth multiline rows={3} variant="outlined" value={currentItem.description || ''} onChange={(e) => setCurrentItem(prev => ({ ...prev, description: e.target.value }))} />
          <FormControlLabel 
            control={<Switch checked={currentItem.isSystemLocked || false} onChange={(e) => setCurrentItem(prev => ({...prev, isSystemLocked: e.target.checked}))} />} 
            label="系統內置 (鎖定後無法修改/刪除)"
            disabled={isEditMode}
            sx={{mt: 1}}
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

export default ParameterSettingsPage;