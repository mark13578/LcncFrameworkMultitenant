// src/components/UserFormModal.tsx
import { useState, useEffect, ReactNode } from 'react';
// 修正點一：分離 'SelectChangeEvent' 的 import
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, OutlinedInput, Switch, FormControlLabel, CircularProgress, Box } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import type { UserDetail, CreateUserInput, UpdateUserInput } from '../services/userService';
import type { Department } from '../services/departmentService';
import type { Role } from '../services/roleService';
import departmentService from '../services/departmentService';
import roleService from '../services/roleService';

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CreateUserInput | UpdateUserInput, id?: string) => void;
  user: UserDetail | null;
}

const UserFormModal = ({ open, onClose, onSave, user }: UserFormModalProps) => {
  const [formData, setFormData] = useState<Partial<CreateUserInput>>({});
  const [departments, setDepartments] = useState<Department[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const isEditMode = !!user;

  useEffect(() => {
    if (open) {
      setLoading(true);
      Promise.all([
        departmentService.getDepartments(),
        roleService.getRoles()
      ]).then(([depts, rols]) => {
        // 展平樹狀部門列表以便於選擇
        const flattenedDepts: Department[] = [];
        const flatten = (deptList: Department[]) => {
            deptList.forEach(d => {
                flattenedDepts.push(d);
                if (d.children) flatten(d.children);
            });
        };
        flatten(depts);
        setDepartments(flattenedDepts);
        setRoles(rols);
        
        if (isEditMode && user) {
          setFormData({
            username: user.username,
            email: user.email,
            isActive: user.isActive,
            departmentId: user.departmentId,
            roleIds: user.roleIds,
          });
        } else {
          setFormData({ username: '', password: '', email: '', isActive: true, departmentId: '', roleIds: [] });
        }
      }).finally(() => setLoading(false));
    }
  }, [open, user, isEditMode]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name!]: value }));
  };
  
  const handleSelectChange = (event: SelectChangeEvent<string | string[]>) => {
    const { name, value } = event.target;
    if (name === 'roleIds') {
        if (Array.isArray(value) && value.length > 3) {
            return;
        }
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData as (CreateUserInput | UpdateUserInput), user?.id);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEditMode ? '編輯使用者' : '新增使用者'}</DialogTitle>
      <DialogContent>
        {loading ? <CircularProgress /> : (
          <Box component="form" sx={{ mt: 2 }}>
            <TextField label="使用者名稱" name="username" value={formData.username || ''} onChange={handleTextChange} fullWidth margin="normal" disabled={isEditMode} />
            {!isEditMode && <TextField label="密碼" name="password" type="password" value={formData.password || ''} onChange={handleTextChange} fullWidth margin="normal" />}
            <TextField label="電子郵件" name="email" value={formData.email || ''} onChange={handleTextChange} fullWidth margin="normal" />
            <FormControl fullWidth margin="normal">
              <InputLabel>部門</InputLabel>
              <Select name="departmentId" value={formData.departmentId || ''} onChange={handleSelectChange} label="部門">
                {departments.map(d => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>角色 (最多3個)</InputLabel>
              <Select
                name="roleIds"
                multiple
                value={formData.roleIds || []}
                onChange={handleSelectChange}
                input={<OutlinedInput label="角色 (最多3個)" />}
                renderValue={(selected: string[]) => selected.map(id => roles.find(r => r.id === id)?.name).join(', ')}
              >
                {roles.map(role => (
                  <MenuItem key={role.id} value={role.id}>
                    {/* 修正點二：將 '--1' 改為 '-1' */}
                    <Checkbox checked={(formData.roleIds || []).indexOf(role.id) > -1} />
                    <ListItemText primary={role.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControlLabel control={<Switch checked={formData.isActive ?? true} onChange={(e) => setFormData(prev => ({...prev, isActive: e.target.checked}))} />} label="啟用狀態" />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button onClick={handleSave} variant="contained">儲存</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserFormModal;