// src/pages/FormBuilderPage.tsx
import { useState } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Box, Typography, Paper, List, ListItem, ListItemButton, ListItemText, Button, Snackbar, Alert, TextField } from '@mui/material';
import DraggableItem from '../components/DraggableItem';
import DroppableCanvas from '../components/DroppableCanvas';
import PropertiesPanel from '../components/PropertiesPanel';
import formService, { FieldType } from '../services/formService';
import type { CanvasField } from '../types/builder';
import type { CreateFormRequestDto } from '../types/api';
import axios from 'axios'; 

const PALETTE_COMPONENTS = [
  { id: 'palette-textfield', type: FieldType.TextField, label: '文字欄位' },
  { id: 'palette-numberfield', type: FieldType.NumberField, label: '數字欄位' },
  { id: 'palette-datepicker', type: FieldType.DatePicker, label: '日期選擇' },
];

const generateFieldName = (label: string) => {
  return label.trim().toLowerCase().replace(/\s+/g, '_');
};

const FormBuilderPage = () => {
  const [canvasFields, setCanvasFields] = useState<CanvasField[]>([]);
  const [selectedField, setSelectedField] = useState<CanvasField | null>(null);
  const [formName, setFormName] = useState('');
  const [formDisplayName, setFormDisplayName] = useState('');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' } | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id.toString().startsWith('palette-') && over.id === 'canvas-droppable') {
      const component = PALETTE_COMPONENTS.find(c => c.id === active.id);
      if (component) {
        const newField: CanvasField = {
          id: `${component.id}-${Date.now()}`,
          type: component.type,
          label: component.label,
          name: generateFieldName(component.label),
          isRequired: false, // <-- 新增元件時，預設為非必填
        };
        setCanvasFields(prevFields => [...prevFields, newField]);
      }
      return;
    }
    const activeId = active.id.toString();
    const overId = over.id.toString();
    if (canvasFields.some(f=>f.id===activeId) && canvasFields.some(f=>f.id===overId) && activeId !== overId) {
        const oldIndex = canvasFields.findIndex(f => f.id === activeId);
        const newIndex = canvasFields.findIndex(f => f.id === overId);
        setCanvasFields(fields => arrayMove(fields, oldIndex, newIndex));
    }
  };

  const handleUpdateField = (updatedField: CanvasField) => {
    // 當 label 變動時，同步更新 name
    if (updatedField.label !== selectedField?.label) {
        updatedField.name = generateFieldName(updatedField.label);
    }
    
    setCanvasFields(prevFields => prevFields.map(f => f.id === updatedField.id ? updatedField : f));
    setSelectedField(updatedField);
  };

  const handleSelectField = (id: string | null) => {
    const field = canvasFields.find(f => f.id === id);
    setSelectedField(field || null);
  };
  
  const handleDeleteField = (id: string) => {
    setCanvasFields(fields => fields.filter(f => f.id !== id));
    setSelectedField(null);
  };

  const handleSave = async () => {
    if (!formName || !formDisplayName || canvasFields.length === 0) {
      setSnackbar({ open: true, message: '表單名稱、顯示名稱和至少一個欄位為必填項！', severity: 'error' });
      return;
    }
    const payload: CreateFormRequestDto = {
      name: formName,
      displayName: formDisplayName,
      fields: canvasFields.map((field, index) => ({
        name: field.name,
        label: field.label,
        fieldType: field.type,
        isRequired: field.isRequired, // <-- 確保 isRequired 被正確傳遞
        sortOrder: index,
        configurationJson: field.configurationJson,
      })),
    };
    try {
      await formService.createFormDefinition(payload);
      setSnackbar({ open: true, message: '表單儲存成功！', severity: 'success' });
    } catch (error) {
      let errorMessage = '發生未知錯誤';
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setSnackbar({ open: true, message: `儲存失敗: ${errorMessage}`, severity: 'error' });
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter} sensors={sensors}>
      <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
        <Paper sx={{ width: 240, p: 2, overflowY: 'auto' }} elevation={2}>
          <Typography variant="h6" gutterBottom>元件</Typography>
          <List>
            {PALETTE_COMPONENTS.map(component => (
              <DraggableItem key={component.id} id={component.id}>
                <ListItem disablePadding sx={{ border: '1px dashed grey', mb: 1, cursor: 'grab' }}>
                  <ListItemButton>
                    <ListItemText primary={component.label} />
                  </ListItemButton>
                </ListItem>
              </DraggableItem>
            ))}
          </List>
        </Paper>
        <Box sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column', backgroundColor: '#f5f5f5' }} onClick={() => handleSelectField(null)}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">我的表單</Typography>
            <Button variant="contained" onClick={handleSave}>儲存表單</Button>
          </Box>
          <Paper sx={{ p: 2, mb: 2 }}>
            <TextField label="表單名稱 (英文/數字/底線)" value={formName} onChange={e => setFormName(e.target.value)} size="small" sx={{ mr: 2 }} />
            <TextField label="表單顯示名稱" value={formDisplayName} onChange={e => setFormDisplayName(e.target.value)} size="small" />
          </Paper>
          <DroppableCanvas 
            fields={canvasFields}
            selectedFieldId={selectedField?.id || null}
            onSelectField={handleSelectField}
          />
        </Box>
        <Paper sx={{ width: 300, p: 2, overflowY: 'auto' }} elevation={2}>
           <PropertiesPanel 
            selectedField={selectedField}
            onUpdateField={handleUpdateField}
            onDeleteField={handleDeleteField}
          />
        </Paper>
      </Box>
      <Snackbar open={snackbar?.open} autoHideDuration={6000} onClose={() => setSnackbar(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setSnackbar(null)} severity={snackbar?.severity} sx={{ width: '100%' }}>
          {snackbar?.message}
        </Alert>
      </Snackbar>
    </DndContext>
  );
};

export default FormBuilderPage;