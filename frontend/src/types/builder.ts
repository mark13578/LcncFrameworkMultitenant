// src/types/builder.ts
import { FieldType } from '../services/formService';

export interface CanvasField {
    id: string;
    type: FieldType;
    // --- 核心屬性 ---
    label: string;
    // --- 後端需要的屬性 ---
    name: string; // 機器可讀的名稱
    isRequired: boolean;
    configurationJson?: string;
  }