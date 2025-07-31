// src/pages/UserManagementPage.tsx
import { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Alert, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Chip, Switch } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import userService from '../services/userService';
import type { User, UserDetail } from '../services/userService';
import axios from 'axios';
import UserFormModal from '../components/UserFormModal';
import type { CreateUserInput, UpdateUserInput } from '../services/userService';

const UserManagementPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserDetail | null>(null);

  const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) { return error.response?.data?.message || error.message; }
    if (error instanceof Error) { return error.message; }
    return '發生未知錯誤';
  };

  const fetchUsers = async () => {
    // setLoading(true); // 在初次載入後，重新整理時不顯示全頁轉圈
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = async (user?: User) => {
    setError(''); // 清除之前的錯誤
    if (user) {
      try {
        const userDetail = await userService.getUserById(user.id);
        setCurrentUser(userDetail);
      } catch(err) {
        setError(getErrorMessage(err));
        return;
      }
    } else {
      setCurrentUser(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentUser(null);
  };

  const handleSaveUser = async (data: CreateUserInput | UpdateUserInput, id?: string) => {
    try {
      if (id) {
        await userService.updateUser(id, data as UpdateUserInput);
      } else {
        await userService.createUser(data as CreateUserInput);
      }
      await fetchUsers();
      handleCloseModal();
    } catch (err) {
      setError(getErrorMessage(err));
      // 讓 Modal 保持開啟，以便使用者看到錯誤並修正
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">使用者管理</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>新增使用者</Button>
      </Box>
      {error && <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>{error}</Alert>}
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>使用者名稱</TableCell>
              <TableCell>電子郵件</TableCell>
              <TableCell>部門</TableCell>
              <TableCell>角色</TableCell>
              <TableCell>啟用狀態</TableCell>
              <TableCell align="right">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.departmentName}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {user.roles.map(role => <Chip key={role} label={role} size="small" />)}
                  </Box>
                </TableCell>
                <TableCell>
                  <Switch checked={user.isActive} readOnly color="primary" />
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleOpenModal(user)}><EditIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 我們只在 isModalOpen 為 true 時才渲染 Modal，
        這樣可以確保 Modal 內部的 useEffect 會在每次打開時都重新觸發，
        去獲取最新的部門和角色列表。
      */}
      {isModalOpen && (
        <UserFormModal
          open={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveUser}
          user={currentUser}
        />
      )}
    </Box>
  );
};

export default UserManagementPage;