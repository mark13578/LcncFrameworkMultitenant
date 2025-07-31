// src/components/IconMapper.tsx
import { iconMap } from '../utils/iconUtils'; // 從新的工具檔案中引用
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

interface IconMapperProps {
  iconName: string | null | undefined;
}

const IconMapper = ({ iconName }: IconMapperProps) => {
  if (!iconName) {
    return <HelpOutlineIcon />;
  }

  // 從 iconMap 中查找對應的元件
  const IconComponent = iconMap[iconName.toLowerCase()];

  // 如果找到就渲染，否則渲染預設圖示
  return IconComponent ? <IconComponent /> : <HelpOutlineIcon />;
};

export default IconMapper;