// src/components/DroppableCanvas.tsx
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Paper, Typography, Box } from '@mui/material';
import SortableItem from './SortableItem';
import type { CanvasField } from '../types/builder';

interface DroppableCanvasProps {
  fields: CanvasField[];
  selectedFieldId: string | null;
  onSelectField: (id: string) => void;
}

const DroppableCanvas = ({ fields, selectedFieldId, onSelectField }: DroppableCanvasProps) => {
  const { setNodeRef } = useDroppable({
    id: 'canvas-droppable',
  });

  return (
    <Paper 
      ref={setNodeRef}
      sx={{ minHeight: '100%', p: 2, border: '2px dashed #ccc' }}
    >
      <SortableContext items={fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
        {fields.length === 0 ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Typography color="textSecondary">請從左側拖曳元件到此處</Typography>
          </Box>
        ) : (
          fields.map(field => (
            <SortableItem key={field.id} id={field.id} onClick={(event) => {
              event.stopPropagation(); // 關鍵！阻止事件冒泡
              onSelectField(field.id);
            }}>
              <Box sx={{ 
                p: 2, 
                border: field.id === selectedFieldId ? '2px solid #1976d2' : '1px solid #ccc',
                mb: 1, 
                backgroundColor: 'white', 
                cursor: 'grab' 
              }}>
                {field.label}
              </Box>
            </SortableItem>
          ))
        )}
      </SortableContext>
    </Paper>
  );
};
export default DroppableCanvas;