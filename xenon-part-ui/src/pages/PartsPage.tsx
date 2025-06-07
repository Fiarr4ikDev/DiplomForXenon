import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Add as AddIcon } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { SelectChangeEvent } from '@mui/material';
import { Typography } from '@mui/material';
import { LoadingState } from '../components/LoadingState';
import { FilterList as FilterListIcon, FileDownload as FileDownloadIcon, TableChart as TableChartIcon, Upload as UploadIcon } from '@mui/icons-material';
import * as XLSX from 'xlsx';
import { ImportDialog } from '../components/ImportDialog';

const API_URL = 'http://localhost:8080/api';

interface Part {
  partId: number;
  name: string;
  description: string;
  categoryId: number;
  categoryName: string;
  supplierId: number;
  supplierName: string;
  unitPrice: string;
}

interface PartRequest {
  name: string;
  description: string;
  categoryId: number;
  supplierId: number;
  unitPrice: number;
}

interface Category {
  categoryId: number;
  name: string;
}

interface Supplier {
  supplierId: number;
  name: string;
}

const PartsPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [newPart, setNewPart] = useState<PartRequest>({
    name: '',
    description: '',
    categoryId: 0,
    supplierId: 0,
    unitPrice: 0
  });
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'error' | 'success' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });
  const [importOpen, setImportOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const queryClient = useQueryClient();

  const { data: parts, isLoading: partsLoading, error: partsError, refetch: refetchParts } = useQuery({
    queryKey: ['parts'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/parts`);
      console.log('Полученные данные запчастей:', response.data);
      return response.data;
    },
  });

  const { data: categories, isLoading: categoriesLoading, error: categoriesError, refetch: refetchCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/categories`);
      return response.data;
    },
  });

  const { data: suppliers, isLoading: suppliersLoading, error: suppliersError, refetch: refetchSuppliers } = useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/suppliers`);
      return response.data;
    },
  });

  const isLoading = partsLoading || categoriesLoading || suppliersLoading;
  const error = partsError || categoriesError || suppliersError;

  const handleRetry = () => {
    refetchParts();
    refetchCategories();
    refetchSuppliers();
  };

  const createMutation = useMutation({
    mutationFn: async (partData: PartRequest) => {
      const response = await axios.post(`${API_URL}/parts`, partData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parts'] });
      (window as any).refreshDashboardData?.();
      setOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: PartRequest }) => {
      const response = await axios.put(`${API_URL}/parts/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parts'] });
      (window as any).refreshDashboardData?.();
      setOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      try {
        await axios.delete(`${API_URL}/parts/${id}`);
      } catch (error: any) {
        if (error.response?.status === 500 && error.response?.data?.message?.includes('violates foreign key constraint')) {
          throw new Error('Невозможно удалить запчасть, так как она используется в инвентаре');
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parts'] });
      (window as any).refreshDashboardData?.();
      setNotification({
        open: true,
        message: 'Запчасть успешно удалена',
        severity: 'success'
      });
    },
    onError: (error: Error) => {
      setNotification({
        open: true,
        message: error.message || 'Произошла ошибка при удалении запчасти',
        severity: 'error'
      });
    }
  });

  const validateForm = (data: PartRequest): boolean => {
    if (!data.name || data.name.trim() === '') {
      setNotification({
        open: true,
        message: 'Пожалуйста, введите название запчасти',
        severity: 'error'
      });
      return false;
    }
    if (!data.description || data.description.trim() === '') {
      setNotification({
        open: true,
        message: 'Пожалуйста, введите описание запчасти',
        severity: 'error'
      });
      return false;
    }
    if (!data.categoryId || data.categoryId === 0) {
      setNotification({
        open: true,
        message: 'Пожалуйста, выберите категорию',
        severity: 'error'
      });
      return false;
    }
    if (!data.supplierId || data.supplierId === 0) {
      setNotification({
        open: true,
        message: 'Пожалуйста, выберите поставщика',
        severity: 'error'
      });
      return false;
    }
    if (!data.unitPrice || data.unitPrice <= 0) {
      setNotification({
        open: true,
        message: 'Пожалуйста, введите корректную цену',
        severity: 'error'
      });
      return false;
    }
    return true;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const partData: PartRequest = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      categoryId: Number(formData.get('categoryId')),
      supplierId: Number(formData.get('supplierId')),
      unitPrice: Number(formData.get('unitPrice'))
    };

    if (!validateForm(partData)) {
      return;
    }

    if (selectedPart) {
      updateMutation.mutate({ id: selectedPart.partId, data: partData });
      setNotification({
        open: true,
        message: 'Запчасть успешно обновлена',
        severity: 'success'
      });
    } else {
      createMutation.mutate(partData);
      setNotification({
        open: true,
        message: 'Запчасть успешно добавлена',
        severity: 'success'
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPart(null);
  };

  const handleDeleteClick = (part: Part) => {
    setSelectedPart(part);
    setOpenDelete(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedPart) {
      deleteMutation.mutate(selectedPart.partId);
      setOpenDelete(false);
    }
  };

  const handleDeleteCancel = () => {
    setOpenDelete(false);
    setSelectedPart(null);
  };

  const handleExportToExcel = () => {
    // Создаем заголовки для Excel
    const headers = ['ID', 'Название', 'Описание', 'Категория', 'Поставщик', 'Цена'];
    
    // Подготавливаем данные
    const data = parts?.map((part: Part) => [
      part.partId,
      part.name,
      part.description,
      part.categoryName,
      part.supplierName,
      part.unitPrice
    ]) || [];

    // Создаем рабочую книгу
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);

    // Устанавливаем ширину столбцов
    const colWidths = [
      { wch: 5 },  // ID
      { wch: 30 }, // Название
      { wch: 40 }, // Описание
      { wch: 20 }, // Категория
      { wch: 20 }, // Поставщик
      { wch: 15 }  // Цена
    ];
    ws['!cols'] = colWidths;

    // Стили для заголовков
    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" }, sz: 12 },
      fill: { fgColor: { rgb: "1976D2" } },
      alignment: { horizontal: "center", vertical: "center" },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } }
      }
    };

    // Стили для ячеек с данными
    const cellStyle = {
      font: { sz: 11 },
      alignment: { vertical: "center" },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } }
      }
    };

    // Применяем стили к заголовкам
    headers.forEach((_: any, index: number) => {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: index });
      if (!ws[cellRef]) ws[cellRef] = { v: headers[index] };
      ws[cellRef].s = headerStyle;
    });

    // Применяем стили к данным
    data.forEach((row: any[], rowIndex: number) => {
      row.forEach((cell: any, colIndex: number) => {
        const cellRef = XLSX.utils.encode_cell({ r: rowIndex + 1, c: colIndex });
        if (!ws[cellRef]) ws[cellRef] = { v: cell };
        ws[cellRef].s = cellStyle;
      });
    });

    // Добавляем лист в книгу
    XLSX.utils.book_append_sheet(wb, ws, 'Запчасти');

    // Сохраняем файл
    XLSX.writeFile(wb, 'parts.xlsx');
  };

  const handleImport = async (data: any[]) => {
    try {
      for (const item of data) {
        await createMutation.mutateAsync({
          name: item['Название'],
          description: item['Описание'],
          categoryId: parseInt(item['ID категории']),
          supplierId: parseInt(item['ID поставщика']),
          unitPrice: item['Цена']
        });
      }
      setSnackbar({
        open: true,
        message: 'Данные успешно импортированы',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Ошибка при импорте данных',
        severity: 'error'
      });
    }
  };

  const validateImportData = (data: any[]) => {
    const errors: string[] = [];
    
    if (data.length === 0) {
      errors.push('Файл не содержит данных');
      return { isValid: false, errors };
    }

    data.forEach((row, index) => {
      if (!row['Название']) {
        errors.push(`Строка ${index + 1}: Отсутствует название`);
      }
      if (row['Название'] && row['Название'].length > 100) {
        errors.push(`Строка ${index + 1}: Название слишком длинное (максимум 100 символов)`);
      }
      if (row['Описание'] && row['Описание'].length > 500) {
        errors.push(`Строка ${index + 1}: Описание слишком длинное (максимум 500 символов)`);
      }
      if (!row['ID категории']) {
        errors.push(`Строка ${index + 1}: Отсутствует ID категории`);
      }
      if (row['ID категории'] && isNaN(parseInt(row['ID категории']))) {
        errors.push(`Строка ${index + 1}: ID категории должен быть числом`);
      }
      if (!row['ID поставщика']) {
        errors.push(`Строка ${index + 1}: Отсутствует ID поставщика`);
      }
      if (row['ID поставщика'] && isNaN(parseInt(row['ID поставщика']))) {
        errors.push(`Строка ${index + 1}: ID поставщика должен быть числом`);
      }
      if (!row['Цена']) {
        errors.push(`Строка ${index + 1}: Отсутствует цена`);
      }
      if (row['Цена'] && isNaN(parseFloat(row['Цена']))) {
        errors.push(`Строка ${index + 1}: Цена должна быть числом`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Запчасти</Typography>
      </Box>

      <LoadingState 
        isLoading={isLoading}
        error={error ? 'Не удалось загрузить данные. Пожалуйста, проверьте подключение к серверу.' : null}
        onRetry={handleRetry}
        loadingText="Загрузка списка запчастей и связанных данных..."
      />

      {!isLoading && !error && (
        <>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<UploadIcon />}
                onClick={() => setImportOpen(true)}
              >
                Импорт
              </Button>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<FileDownloadIcon />}
                onClick={handleExportToExcel}
              >
                Экспорт в Excel
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleClickOpen}
              >
                Добавить запчасть
              </Button>
            </Box>
          </Paper>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Название</TableCell>
                  <TableCell>Описание</TableCell>
                  <TableCell>Категория</TableCell>
                  <TableCell>Поставщик</TableCell>
                  <TableCell>Цена</TableCell>
                  <TableCell sx={{ minWidth: '150px' }}>Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {parts?.map((part: Part) => (
                  <TableRow key={part.partId}>
                    <TableCell>{part.partId}</TableCell>
                    <TableCell>{part.name}</TableCell>
                    <TableCell>{part.description}</TableCell>
                    <TableCell>{part.categoryName}</TableCell>
                    <TableCell>{part.supplierName}</TableCell>
                    <TableCell>{part.unitPrice}</TableCell>
                    <TableCell sx={{ minWidth: '150px' }}>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Редактировать">
                          <IconButton
                            onClick={() => {
                              setSelectedPart(part);
                              setNewPart({
                                name: part.name,
                                description: part.description,
                                categoryId: part.categoryId,
                                supplierId: part.supplierId,
                                unitPrice: Number(part.unitPrice)
                              });
                              setOpen(true);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Удалить">
                          <IconButton
                            onClick={() => {
                              setSelectedPart(part);
                              setOpenDelete(true);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <form onSubmit={handleSubmit}>
              <DialogTitle>
                {selectedPart ? 'Редактировать запчасть' : 'Добавить запчасть'}
              </DialogTitle>
              <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                  <TextField
                    name="name"
                    label="Название"
                    fullWidth
                    defaultValue={selectedPart?.name}
                  />
                  <TextField
                    name="description"
                    label="Описание"
                    fullWidth
                    multiline
                    rows={3}
                    defaultValue={selectedPart?.description}
                  />
                  <FormControl fullWidth>
                    <InputLabel>Категория</InputLabel>
                    <Select
                      name="categoryId"
                      label="Категория"
                      defaultValue={selectedPart?.categoryId || ''}
                    >
                      {categories?.map((category: Category) => (
                        <MenuItem key={category.categoryId} value={category.categoryId}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Поставщик</InputLabel>
                    <Select
                      name="supplierId"
                      label="Поставщик"
                      defaultValue={selectedPart?.supplierId || ''}
                    >
                      {suppliers?.map((supplier: Supplier) => (
                        <MenuItem key={supplier.supplierId} value={supplier.supplierId}>
                          {supplier.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    name="unitPrice"
                    label="Цена"
                    type="number"
                    fullWidth
                    defaultValue={selectedPart?.unitPrice}
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Отмена</Button>
                <Button type="submit" variant="contained">
                  {selectedPart ? 'Сохранить' : 'Добавить'}
                </Button>
              </DialogActions>
            </form>
          </Dialog>

          <Dialog
            open={openDelete}
            onClose={handleDeleteCancel}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Подтверждение удаления</DialogTitle>
            <DialogContent>
              <Typography>
                Вы уверены, что хотите удалить запчасть "{selectedPart?.name}"?
                Это действие необратимо.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteCancel}>Отмена</Button>
              <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                Удалить
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}

      <ImportDialog
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onImport={handleImport}
        templateHeaders={['Название', 'Описание', 'ID категории', 'ID поставщика', 'Цена']}
        validateData={validateImportData}
        title="Импорт запчастей"
      />

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PartsPage; 