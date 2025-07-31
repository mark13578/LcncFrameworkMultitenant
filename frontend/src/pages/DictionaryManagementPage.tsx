// src/pages/DictionaryManagementPage.tsx
import { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Alert, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import systemParameterService from '../services/systemParameterService';
import type { SystemParameter, CreateSystemParameterInput, UpdateSystemParameterInput } from '../services/systemParameterService';
import axios from 'axios';

const DICTIONARY_CATEGORY = 'Dictionary';

const DictionaryManagementPage = () => {
  const [dictionaries, setDictionaries] = useState<SystemParameter[]>([]);
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
      const data = await systemParameterService.getParametersByCategory(DICTIONARY_CATEGORY);
      setDictionaries(data);
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
      setCurrentItem({ key: '', value: '[]', description: '' });
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
        const payload: UpdateSystemParameterInput = { value: currentItem.value, description: currentItem.description };
        await systemParameterService.updateParameter(currentItem.id!, payload);
      } else {
        const payload: CreateSystemParameterInput = {
          category: DICTIONARY_CATEGORY,
          key: currentItem.key!,
          value: currentItem.value,
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
    if (window.confirm('您確定要刪除這個字典項目嗎？')) {
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
        <Typography variant="h4">字典管理</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>新增字典</Button>
      </Box>
      {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>鍵 (Key)</TableCell>
              <TableCell>描述</TableCell>
              <TableCell>值 (Value)</TableCell>
              <TableCell align="right">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dictionaries.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell sx={{ fontWeight: 'bold' }}>{item.key}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{item.value}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleOpen(item)}><EditIcon /></IconButton>
                  <IconButton size="small" onClick={() => handleDelete(item.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>{isEditMode ? '編輯字典' : '新增字典'}</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="鍵 (Key)" type="text" fullWidth variant="outlined" value={currentItem.key || ''} onChange={(e) => setCurrentItem(prev => ({ ...prev, key: e.target.value }))} disabled={isEditMode} sx={{ mt: 2 }}/>
          <TextField margin="dense" label="描述" type="text" fullWidth variant="outlined" value={currentItem.description || ''} onChange={(e) => setCurrentItem(prev => ({ ...prev, description: e.target.value }))} />
          <TextField 
            margin="dense" 
            label="值 (Value)" 
            helperText='通常為 JSON 陣列格式，例如：["選項一", "選項二"]'
            type="text" 
            fullWidth 
            multiline 
            rows={6} 
            variant="outlined" 
            value={currentItem.value || ''} 
            onChange={(e) => setCurrentItem(prev => ({ ...prev, value: e.target.value }))} 
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

export default DictionaryManagementPage;