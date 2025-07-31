// src/services/formService.ts
import api from './api';
import type { CreateFormRequestDto } from '../types/api'; // 我們將在下一步建立這個型別


// =================================================================
// 修正點一：在 enum 和 interface 前面，全部加上 export 關鍵字
// =================================================================
export enum FieldType {
  TextField,
  NumberField,
  DatePicker,
  Checkbox,
  Dropdown,
}

export interface FieldDefinitionResponseDto {
  id: string;
  name: string;
  label: string;
  fieldType: FieldType;
  isRequired: boolean;
  sortOrder: number;
  configurationJson?: string;
}

export interface FormDefinitionResponseDto {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  fields: FieldDefinitionResponseDto[];
}

// =================================================================

class FormService {
  /*
  async getFormDefinition(formName: string): Promise<FormDefinitionResponseDto> {
    const response = await api.get<FormDefinitionResponseDto>(`/formdefinitions/${formName}`);
    return response.data;
  }
  */

  // 修正點三：將 getFormDefinition 方法的路徑改為使用 by-name，並且將回傳值類型設為 FormDefinitionResponseDto
  async getFormDefinition(formName: string): Promise<FormDefinitionResponseDto> {
    const response = await api.get<FormDefinitionResponseDto>(`/formdefinitions/by-name/${formName}`);
    return response.data;
  }

  // 修正點二：使用更安全的聯合型別取代 any，並將回傳值設為 void
  async submitFormData(formName: string, data: Record<string, string | number | boolean | Date | null>): Promise<void> {
    await api.post(`/form-data/${formName}`, data);
  }


  async createFormDefinition(formData: CreateFormRequestDto): Promise<FormDefinitionResponseDto> {
    const response = await api.post<FormDefinitionResponseDto>('/formdefinitions', formData);
    return response.data;
  }

  async getFormDefinitions(): Promise<FormDefinitionResponseDto[]> {
    const response = await api.get<FormDefinitionResponseDto[]>('/formdefinitions');
    return response.data;
  }
}


export default new FormService();