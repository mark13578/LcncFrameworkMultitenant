// src/types/api.ts
import { FieldType } from '../services/formService';

// 這個型別對應後端的 CreateFieldDto
interface CreateFieldDto {
  name: string;
  label: string;
  fieldType: FieldType;
  isRequired: boolean;
  sortOrder: number;
  configurationJson?: string;
}

// 這個型別對應後端的 CreateFormRequestDto
export interface CreateFormRequestDto {
  name: string;
  displayName: string;
  description?: string;
  fields: CreateFieldDto[];
}