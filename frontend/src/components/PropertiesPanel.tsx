// src/components/PropertiesPanel.tsx
import {   Box, Typography, TextField, Button, Divider, FormControlLabel, Switch } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type { CanvasField } from '../types/builder'; // <-- 修正點：從新的中立檔案導入型別

interface PropertiesPanelProps {
  selectedField: CanvasField | null;
  onUpdateField: (updatedField: CanvasField) => void;
  onDeleteField: (id: string) => void;
}

const PropertiesPanel = ({ selectedField, onUpdateField, onDeleteField  }: PropertiesPanelProps) => {
  if (!selectedField) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          屬性
        </Typography>
        <Typography color="textSecondary" sx={{ mt: 2 }}>
          請選擇一個元件進行編輯
        </Typography>
      </Box>
    );
  }

  // 統一的屬性變更處理函式
  const handlePropertyChange = (propName: keyof CanvasField, value: string | boolean) => {
    // 檢查 selectedField 是否存在，以確保型別安全
    if (selectedField) {
      onUpdateField({
        ...selectedField,
        [propName]: value,
      });
    }
  };
 // 修正點：將 label 的變更處理函式改為使用統一的屬性變更處理函式

  /*
  const handleLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateField({
      ...selectedField,
      label: event.target.value,
    });
  };*/

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        屬性
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        ID: {selectedField.id}
      </Typography>
      
      <TextField
        label="欄位標籤 (Label)"
        value={selectedField.label}
        onChange={(e) => handlePropertyChange('label', e.target.value)}
        fullWidth
        margin="normal"
        variant="outlined"
      />

      <FormControlLabel
        control={
          <Switch
            checked={selectedField.isRequired}
            onChange={(e) => handlePropertyChange('isRequired', e.target.checked)}
          />
        }
        label="是否必填"
        sx={{ mt: 1 }}
      />


      <Divider sx={{ my: 3 }} />

      <Button
        variant="outlined"
        color="error"
        fullWidth
        startIcon={<DeleteIcon />}
        onClick={() => onDeleteField(selectedField.id)}
      >
        刪除此元件
      </Button>
    </Box>
  );
};

export default PropertiesPanel;