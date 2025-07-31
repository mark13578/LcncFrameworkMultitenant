// src/components/DraggableItem.tsx
import { useDraggable } from '@dnd-kit/core';
import { Box } from '@mui/material';

interface DraggableItemProps {
  id: string;
  children: React.ReactNode;
}

const DraggableItem = ({ id, children }: DraggableItemProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <Box ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </Box>
  );
};

export default DraggableItem;