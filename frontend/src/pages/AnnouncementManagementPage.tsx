// src/pages/AnnouncementManagementPage.tsx
import { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Alert, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Switch, FormControlLabel } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import announcementService from '../services/announcementService';
import type { Announcement, AnnouncementInput } from '../services/announcementService';
import axios from 'axios';
import dayjs from 'dayjs';

const AnnouncementManagementPage = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Partial<AnnouncementInput> & { id?: string }>({});
  const isEditMode = !!currentItem.id;

  const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) { return error.response?.data?.message || error.message; }
    if (error instanceof Error) { return error.message; }
    return '發生未知錯誤';
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await announcementService.getAnnouncements();
      setAnnouncements(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpen = (item?: Announcement) => {
    if (item) {
      setCurrentItem({ ...item });
    } else {
      setCurrentItem({ title: '', content: '', isPublished: true, publishDate: new Date().toISOString() });
    }
    setOpen(true);
  };
  
  const handleClose = () => { setOpen(false); setCurrentItem({}); };
  
  const handleSave = async () => {
    try {
        if (!currentItem.title || !currentItem.content) {
            alert('標題和內容為必填項。');
            return;
        }
        const payload: AnnouncementInput = {
            title: currentItem.title,
            content: currentItem.content,
            isPublished: currentItem.isPublished ?? true,
            publishDate: currentItem.publishDate || new Date().toISOString(),
            expiryDate: currentItem.expiryDate,
        };
        if (isEditMode) {
            await announcementService.updateAnnouncement(currentItem.id!, payload);
        } else {
            await announcementService.createAnnouncement(payload);
        }
        await fetchData();
        handleClose();
    } catch (err) {
        setError(getErrorMessage(err));
    }
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm('您確定要刪除這則公告嗎？')) {
      try {
        await announcementService.deleteAnnouncement(id);
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
            <Typography variant="h4">公告管理</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>新增公告</Button>
        </Box>
        {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>標題</TableCell>
                <TableCell>發布狀態</TableCell>
                <TableCell>發布日期</TableCell>
                <TableCell align="right">操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {announcements.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell sx={{ fontWeight: 'bold' }}>{item.title}</TableCell>
                  <TableCell>
                    <Switch checked={item.isPublished} readOnly />
                  </TableCell>
                  <TableCell>{dayjs(item.publishDate).format('YYYY-MM-DD')}</TableCell>
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
            <DialogTitle>{isEditMode ? '編輯公告' : '新增公告'}</DialogTitle>
            <DialogContent>
                <TextField autoFocus margin="dense" label="標題" fullWidth variant="outlined" value={currentItem.title || ''} onChange={(e) => setCurrentItem(prev => ({ ...prev, title: e.target.value }))} sx={{ mt: 2 }} />
                <TextField margin="dense" label="內容" fullWidth multiline rows={8} variant="outlined" value={currentItem.content || ''} onChange={(e) => setCurrentItem(prev => ({ ...prev, content: e.target.value }))} />
                <DatePicker label="發布日期" value={currentItem.publishDate ? dayjs(currentItem.publishDate) : null} onChange={(date) => setCurrentItem(prev => ({ ...prev, publishDate: date?.toISOString() }))} sx={{ mt: 2, mr: 2 }}/>
                <DatePicker label="過期日期 (可選)" value={currentItem.expiryDate ? dayjs(currentItem.expiryDate) : null} onChange={(date) => setCurrentItem(prev => ({ ...prev, expiryDate: date?.toISOString() }))} sx={{ mt: 2 }}/>
                <FormControlLabel control={<Switch checked={currentItem.isPublished ?? true} onChange={(e) => setCurrentItem(prev => ({...prev, isPublished: e.target.checked}))} />} label="立即發布" />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>取消</Button>
                <Button onClick={handleSave} variant="contained">儲存</Button>
            </DialogActions>
        </Dialog>
    </Box>
  );
};

export default AnnouncementManagementPage;