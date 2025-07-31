// src/components/DynamicFormRenderer.tsx
import { TextField, Checkbox, FormControlLabel, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { FieldType } from '../services/formService';
import type { FieldDefinitionResponseDto } from '../services/formService';
import dayjs from 'dayjs';

type FormDataValue = string | number | boolean | Date | null;

interface DynamicFormRendererProps {
  fields: FieldDefinitionResponseDto[];
  formData: Record<string, FormDataValue>;
  onFieldChange: (fieldName: string, value: FormDataValue) => void;
}

const DynamicFormRenderer = ({ fields, formData, onFieldChange }: DynamicFormRendererProps) => {
  const renderField = (field: FieldDefinitionResponseDto) => {
    const { name, label, fieldType, isRequired } = field;
    const value = formData[name];

    switch (fieldType) {
      case FieldType.TextField:
        return <TextField key={name} name={name} label={label} value={value || ''} onChange={(e) => onFieldChange(name, e.target.value)} required={isRequired} fullWidth margin="normal" />;
      
      case FieldType.NumberField:
        return <TextField key={name} name={name} label={label} type="number" value={value || ''} onChange={(e) => onFieldChange(name, e.target.value)} required={isRequired} fullWidth margin="normal" />;
      
      // ↓↓ 修正點一：為 DatePicker 的 case 加上大括號 {} ↓↓
      case FieldType.DatePicker: {
        const dateValue = value ? dayjs(value as Date) : null;
        return <DatePicker key={name} label={label} value={dateValue} onChange={(newValue) => onFieldChange(name, newValue ? newValue.toDate() : null)} sx={{ width: '100%', mt: 2, mb: 1 }} />;
      }
      
      case FieldType.Checkbox:
        return <FormControlLabel key={name} control={<Checkbox checked={!!value} onChange={(e) => onFieldChange(name, e.target.checked)} name={name} />} label={label} />;
      
      // ↓↓ 修正點二：為 Dropdown 的 case 加上大括號 {} ↓↓
      case FieldType.Dropdown: {
        const config = field.configurationJson ? JSON.parse(field.configurationJson) : { options: [] };
        return (
          <FormControl fullWidth margin="normal" key={name} required={isRequired}>
            <InputLabel>{label}</InputLabel>
            <Select value={value || ''} label={label} onChange={(e) => onFieldChange(name, e.target.value)}>
              {config.options.map((option: string) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      }
      
      default:
        return <div key={name}>不支援的欄位類型: {FieldType[fieldType]}</div>;
    }
  };

  return (
    <>
      {fields.sort((a, b) => a.sortOrder - b.sortOrder).map(renderField)}
    </>
  );
};

export default DynamicFormRenderer;