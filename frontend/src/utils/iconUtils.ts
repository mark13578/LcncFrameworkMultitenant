// src/utils/iconUtils.ts
import type { SvgIconComponent } from '@mui/icons-material'; // 使用 type-only import
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import WebIcon from '@mui/icons-material/Web';
import SettingsIcon from '@mui/icons-material/Settings';
import ArticleIcon from '@mui/icons-material/Article';
import TranslateIcon from '@mui/icons-material/Translate';
import CampaignIcon from '@mui/icons-material/Campaign';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import BuildIcon from '@mui/icons-material/Build';

// 建立一個圖示名稱到元件的映射表
export const iconMap: Record<string, SvgIconComponent> = {
  dashboard: DashboardIcon,
  people: PeopleIcon,
  accounttree: AccountTreeIcon,
  vpnkey: VpnKeyIcon,
  menubook: MenuBookIcon,
  web: WebIcon,
  settings: SettingsIcon,
  article: ArticleIcon,
  translate: TranslateIcon,
  campaign: CampaignIcon,
  build: BuildIcon,
  helpoutline: HelpOutlineIcon,
};

// 導出可用的圖示名稱列表，供下拉選單使用
export const availableIcons = Object.keys(iconMap);