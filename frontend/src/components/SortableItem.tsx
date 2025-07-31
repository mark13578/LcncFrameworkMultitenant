// src/components/SortableItem.tsx
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box } from '@mui/material';

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
  onClick: (event: React.MouseEvent) => void; 
}

const SortableItem = ({ id, children, onClick }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Box ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={onClick}>
      {children}
    </Box>
  );
};
export default SortableItem;