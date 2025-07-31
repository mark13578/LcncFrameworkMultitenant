// src/pages/FormViewerPage.tsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Box, Typography, Button, CircularProgress, Alert } from '@mui/material';

// ↓↓ 修正後的 import 區域 ↓↓
import formService from '../services/formService';
import type { FormDefinitionResponseDto } from '../services/formService';
// ↑↑ 修正後的 import 區域 ↑↑

import DynamicFormRenderer from '../components/DynamicFormRenderer';
import { AxiosError } from 'axios';

// 定義一個聯合型別，用於表單資料
type FormDataValue = string | number | boolean | Date | null;
type FormData = Record<string, FormDataValue>;

const FormViewerPage = () => {
  const { formName } = useParams<{ formName: string }>();
  const [formDefinition, setFormDefinition] = useState<FormDefinitionResponseDto | null>(null);
  // ↓↓ 修正點一：使用更精確的 FormData 型別 ↓↓
  const [formData, setFormData] = useState<FormData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (formName) {
      setLoading(true);
      setError('');
      setSuccess('');
      formService.getFormDefinition(formName)
        .then(data => {
          setFormDefinition(data);
          // 初始化 formData 狀態
          const initialData: FormData = {};
          data.fields.forEach(field => {
            initialData[field.name] = '';
          });
          setFormData(initialData);
        })
        .catch(err => setError(`載入表單定義失敗: ${err.message}`))
        .finally(() => setLoading(false));
    }
  }, [formName]);

  // ↓↓ 修正點二：修改 value 的型別 ↓↓
  const handleFieldChange = (fieldName: string, value: FormDataValue) => {
    setFormData(prevData => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    if (formName) {
      try {
        await formService.submitFormData(formName, formData);
        setSuccess('資料已成功提交！');
        // 提交成功後可選擇性清空表單
        const clearedData: FormData = {};
        formDefinition?.fields.forEach(field => clearedData[field.name] = '');
        setFormData(clearedData);
      } catch (err) {
        // ↓↓ 修正點三：使用更安全的錯誤處理型別 ↓↓
        if (err instanceof AxiosError) {
          setError(`提交失敗: ${err.response?.data?.message || err.message}`);
        } else if (err instanceof Error) {
          setError(`提交失敗: ${err.message}`);
        } else {
          setError('發生未知錯誤');
        }
      }
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error && !formDefinition) return <Alert severity="error">{error}</Alert>;
  if (!formDefinition) return <Alert severity="warning">找不到表單定義。</Alert>;

  return (
    <Container maxWidth="sm">
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>{formDefinition.displayName}</Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>{formDefinition.description}</Typography>
        
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <DynamicFormRenderer
          fields={formDefinition.fields}
          formData={formData}
          onFieldChange={handleFieldChange}
        />

        <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
          提交
        </Button>
      </Box>
    </Container>
  );
};

export default FormViewerPage;