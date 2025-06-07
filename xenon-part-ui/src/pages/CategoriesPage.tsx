import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
} from '@mui/material';
import { Add as AddIcon, FileDownload as FileDownloadIcon, TableChart as TableChartIcon, Upload as UploadIcon } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { LoadingState } from '../components/LoadingState';
import { ImportDialog } from '../components/ImportDialog';
import * as XLSX from 'xlsx';

const API_URL = 'http://localhost:8080/api';

interface Category {
  categoryId: number;
  name: string;
  description: string;
}

interface CategoryRequest {
  name: string;
  description: string;
}

const CategoriesPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState<CategoryRequest>({
    name: '',
    description: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: categories, isLoading, error, refetch } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/categories`);
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (categoryData: CategoryRequest) => {
      const response = await axios.post(`${API_URL}/categories`, categoryData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: CategoryRequest }) => {
      const response = await axios.put(`${API_URL}/categories/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      try {
        await axios.delete(`${API_URL}/categories/${id}`);
      } catch (error: any) {
        if (error.response?.status === 500 && error.response?.data?.message?.includes('violates foreign key constraint')) {
          throw new Error('Невозможно удалить категорию, так как существуют связанные запчасти');
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setSnackbar({
        open: true,
        message: 'Категория успешно удалена',
        severity: 'success'
      });
    },
    onError: (error: Error) => {
      setSnackbar({
        open: true,
        message: error.message || 'Произошла ошибка при удалении категории',
        severity: 'error'
      });
    }
  });

  const handleImport = async (data: any[]) => {
    try {
      for (const item of data) {
        await createMutation.mutateAsync({
          name: item['Название'],
          description: item['Описание']
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
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const validateForm = (data: CategoryRequest): boolean => {
    if (!data.name || data.name.trim() === '') {
      setSnackbar({
        open: true,
        message: 'Пожалуйста, введите название категории',
        severity: 'error'
      });
      return false;
    }
    if (data.name.length > 100) {
      setSnackbar({
        open: true,
        message: 'Название категории не должно превышать 100 символов',
        severity: 'error'
      });
      return false;
    }
    if (data.description && data.description.length > 250) {
      setSnackbar({
        open: true,
        message: 'Описание не должно превышать 250 символов',
        severity: 'error'
      });
      return false;
    }
    return true;
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setNewCategory({
      ...newCategory,
      name: value
    });
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setNewCategory({
      ...newCategory,
      description: value
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const categoryData: CategoryRequest = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
    };

    if (!validateForm(categoryData)) {
      return;
    }

    if (selectedCategory) {
      updateMutation.mutate({ id: selectedCategory.categoryId, data: categoryData });
      setSnackbar({
        open: true,
        message: 'Категория успешно обновлена',
        severity: 'success'
      });
    } else {
      createMutation.mutate(categoryData);
      setSnackbar({
        open: true,
        message: 'Категория успешно добавлена',
        severity: 'success'
      });
    }
  };

  const handleCloseNotification = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCategory(null);
    setNewCategory({
      name: '',
      description: ''
    });
  };

  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category);
    setOpenDelete(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedCategory) {
      deleteMutation.mutate(selectedCategory.categoryId);
      setOpenDelete(false);
    }
  };

  const handleDeleteCancel = () => {
    setOpenDelete(false);
    setSelectedCategory(null);
  };

  const handleExportToExcel = () => {
    // Создаем заголовки для Excel
    const headers = ['ID', 'Название', 'Описание'];
    
    // Подготавливаем данные
    const data = categories?.map(category => [
      category.categoryId,
      category.name,
      category.description
    ]) || [];

    // Создаем рабочую книгу
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);

    // Устанавливаем ширину столбцов
    const colWidths = [
      { wch: 5 },  // ID
      { wch: 30 }, // Название
      { wch: 40 }  // Описание
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
    headers.forEach((_, index) => {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: index });
      if (!ws[cellRef]) ws[cellRef] = { v: headers[index] };
      ws[cellRef].s = headerStyle;
    });

    // Применяем стили к данным
    data.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const cellRef = XLSX.utils.encode_cell({ r: rowIndex + 1, c: colIndex });
        if (!ws[cellRef]) ws[cellRef] = { v: cell };
        ws[cellRef].s = cellStyle;
      });
    });

    // Добавляем лист в книгу
    XLSX.utils.book_append_sheet(wb, ws, 'Категории');

    // Сохраняем файл
    XLSX.writeFile(wb, 'categories.xlsx');
  };

  // Фильтрация данных на основе поискового запроса
  const filteredCategories = categories?.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Категории</Typography>
      </Box>

      <LoadingState 
        isLoading={isLoading}
        error={error ? 'Не удалось загрузить данные. Пожалуйста, проверьте подключение к серверу.' : null}
        onRetry={refetch}
        loadingText="Загрузка списка категорий..."
      />

      {!isLoading && !error && (
        <>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', alignItems: 'center' }}>
              <TextField
                label="Поиск"
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ width: '300px' }}
                placeholder="Поиск по названию или описанию"
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
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
                  Добавить категорию
                </Button>
              </Box>
            </Box>
          </Paper>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Название</TableCell>
                  <TableCell>Описание</TableCell>
                  <TableCell>Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCategories?.map((category: Category) => (
                  <TableRow key={category.categoryId}>
                    <TableCell>{category.categoryId}</TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.description}</TableCell>
                    <TableCell>
                      <Tooltip title="Редактировать">
                        <IconButton
                          onClick={() => {
                            setSelectedCategory(category);
                            setNewCategory({
                              name: category.name,
                              description: category.description
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
                            setSelectedCategory(category);
                            setOpenDelete(true);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <form onSubmit={handleSubmit}>
              <DialogTitle>
                {selectedCategory ? 'Редактировать категорию' : 'Добавить категорию'}
              </DialogTitle>
              <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                  <TextField
                    name="name"
                    label="Название"
                    fullWidth
                    defaultValue={selectedCategory?.name}
                    inputProps={{ maxLength: 100 }}
                  />
                  <TextField
                    name="description"
                    label="Описание"
                    fullWidth
                    multiline
                    rows={3}
                    defaultValue={selectedCategory?.description}
                    inputProps={{ maxLength: 250 }}
                  />
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Отмена</Button>
                <Button type="submit" variant="contained">
                  {selectedCategory ? 'Сохранить' : 'Добавить'}
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
                Вы уверены, что хотите удалить категорию "{selectedCategory?.name}"?
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
        templateHeaders={['Название', 'Описание']}
        validateData={validateImportData}
        title="Импорт категорий"
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert
          onClose={handleCloseNotification}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CategoriesPage; 