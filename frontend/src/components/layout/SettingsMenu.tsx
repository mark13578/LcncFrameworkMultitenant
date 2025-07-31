// src/components/layout/SettingsMenu.tsx
import { useState } from 'react';
import { IconButton, Menu, MenuItem, RadioGroup, FormControlLabel, Radio, Typography } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useAppContext } from '../../contexts/AppContext';

const SettingsMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { layoutMode, setLayoutMode } = useAppContext();

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const handleLayoutChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLayoutMode(event.target.value as 'side' | 'top');
    handleCloseMenu();
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleOpenMenu}><SettingsIcon /></IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
        <Typography variant="caption" sx={{ px: 2 }}>佈局模式</Typography>
        <RadioGroup value={layoutMode} onChange={handleLayoutChange} sx={{ px: 2 }}>
          <FormControlLabel value="side" control={<Radio />} label="側邊欄佈局" />
          <FormControlLabel value="top" control={<Radio />} label="頂部導覽列佈局" />
        </RadioGroup>
      </Menu>
    </>
  );
};
export default SettingsMenu;