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
  MenuItem,
  IconButton,
  Tooltip,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Snackbar,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon, AddCircle as AddCircleIcon, RemoveCircle as RemoveCircleIcon, FilterList as FilterListIcon, FileDownload as FileDownloadIcon, TableChart as TableChartIcon, Upload as UploadIcon } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { LoadingState } from '../components/LoadingState';
import { 
    getInventory, 
    createInventory, 
    updateInventory, 
    deleteInventory,
    addInventoryQuantity,
    removeInventoryQuantity
} from '../api/inventory';
import * as XLSX from 'xlsx';
import { ImportDialog } from '../components/ImportDialog';

interface Inventory {
  inventoryId: number;
  partId: number;
  quantityInStock: number;
  lastRestockDate: string;
}

interface InventoryRequest {
  partId: number;
  quantityInStock: number | string;
}

interface Part {
  partId: number;
  name: string;
  description: string;
  categoryId: number;
  categoryName: string;
  supplierId: number;
  supplierName: string;
  unitPrice: number;
}

const API_URL = 'http://localhost:8080/api';

const InventoryPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [openAddQuantity, setOpenAddQuantity] = useState(false);
  const [openRemoveQuantity, setOpenRemoveQuantity] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(null);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [newInventory, setNewInventory] = useState<InventoryRequest>({ partId: 0, quantityInStock: 0 });
  const [quantityToChange, setQuantityToChange] = useState<string>('');
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

  const { data: inventory, isLoading: isInventoryLoading, error: inventoryError, refetch: refetchInventory } = useQuery<Inventory[]>({
    queryKey: ['inventory'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/inventory`);
      return response.data;
    },
  });

  const { data: parts, isLoading: isPartsLoading, error: partsError, refetch: refetchParts } = useQuery<Part[]>({
    queryKey: ['parts'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/parts`);
      return response.data;
    },
  });

  const isLoading = isInventoryLoading || isPartsLoading;
  const error = inventoryError || partsError;

  const handleRetry = () => {
    refetchInventory();
    refetchParts();
  };

  const createMutation = useMutation({
    mutationFn: async (inventoryData: InventoryRequest) => {
      const response = await axios.post(`${API_URL}/inventory`, inventoryData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      setOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number; data: InventoryRequest }) =>
      axios.put(`${API_URL}/inventory/${data.id}`, data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['parts'] });
      setOpen(false);
      setOpenAddQuantity(false);
      setOpenRemoveQuantity(false);
      setSelectedInventory(null);
      setQuantityToChange('');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      try {
        await axios.delete(`${API_URL}/inventory/${id}`);
      } catch (error: any) {
        throw new Error('Произошла ошибка при удалении записи инвентаря');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      setNotification({
        open: true,
        message: 'Запись инвентаря успешно удалена',
        severity: 'success'
      });
    },
    onError: (error: Error) => {
      setNotification({
        open: true,
        message: error.message || 'Произошла ошибка при удалении записи инвентаря',
        severity: 'error'
      });
    }
  });

  const validateForm = (data: InventoryRequest): boolean => {
    if (!data.partId || data.partId === 0) {
      setNotification({
        open: true,
        message: 'Пожалуйста, выберите запчасть',
        severity: 'error'
      });
      return false;
    }
    if (!data.quantityInStock || Number(data.quantityInStock) < 0) {
      setNotification({
        open: true,
        message: 'Количество не может быть отрицательным',
        severity: 'error'
      });
      return false;
    }
    return true;
  };

  const handleQuantityChangeSubmit = async () => {
    if (!selectedInventory || !quantityToChange) {
      setNotification({
        open: true,
        message: 'Пожалуйста, введите количество',
        severity: 'error'
      });
      return;
    }

    const quantity = parseInt(quantityToChange);
    if (isNaN(quantity) || quantity <= 0) {
      setNotification({
        open: true,
        message: 'Пожалуйста, введите корректное количество',
        severity: 'error'
      });
      return;
    }

    try {
      if (openAddQuantity) {
        await addInventoryQuantity(selectedInventory.inventoryId, quantity);
        setNotification({
          open: true,
          message: 'Количество успешно добавлено',
          severity: 'success'
        });
      } else if (openRemoveQuantity) {
        await removeInventoryQuantity(selectedInventory.inventoryId, quantity);
        setNotification({
          open: true,
          message: 'Количество успешно уменьшено',
          severity: 'success'
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      setOpenAddQuantity(false);
      setOpenRemoveQuantity(false);
      setQuantityToChange('');
      setSelectedInventory(null);
    } catch (error) {
      console.error('Ошибка при изменении количества:', error);
      setNotification({
        open: true,
        message: 'Произошла ошибка при изменении количества',
        severity: 'error'
      });
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const inventoryData: InventoryRequest = {
      partId: Number(formData.get('partId')),
      quantityInStock: Number(formData.get('quantityInStock'))
    };

    if (!validateForm(inventoryData)) {
      return;
    }

    if (selectedInventory) {
      updateMutation.mutate({ id: selectedInventory.inventoryId, data: inventoryData });
      setNotification({
        open: true,
        message: 'Запись успешно обновлена',
        severity: 'success'
      });
    } else {
      createMutation.mutate(inventoryData);
      setNotification({
        open: true,
        message: 'Запись успешно добавлена',
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
    setSelectedInventory(null);
    setNewInventory({
      partId: 0,
      quantityInStock: 0
    });
  };

  const handleDeleteClick = (inventory: Inventory) => {
    setSelectedInventory(inventory);
    setOpenDelete(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedInventory) {
      deleteMutation.mutate(selectedInventory.inventoryId);
      setOpenDelete(false);
    }
  };

  const handleDeleteCancel = () => {
    setOpenDelete(false);
    setSelectedInventory(null);
  };

  const handleExportToExcel = () => {
    // Создаем заголовки для Excel
    const headers = ['ID', 'Запчасть', 'Количество', 'Дата последнего пополнения'];
    
    // Подготавливаем данные
    const data = inventory?.map(item => [
      item.inventoryId,
      getPartName(item.partId),
      item.quantityInStock,
      new Date(item.lastRestockDate).toLocaleDateString()
    ]) || [];

    // Создаем рабочую книгу
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);

    // Устанавливаем ширину столбцов
    const colWidths = [
      { wch: 5 },  // ID
      { wch: 30 }, // Запчасть
      { wch: 10 }, // Количество
      { wch: 20 }  // Дата
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
    XLSX.utils.book_append_sheet(wb, ws, 'Инвентарь');

    // Сохраняем файл
    XLSX.writeFile(wb, 'inventory.xlsx');
  };

  const handleImport = async (data: any[]) => {
    try {
      for (const item of data) {
        await createMutation.mutateAsync({
          partId: parseInt(item['ID запчасти']),
          quantityInStock: parseInt(item['Количество']),
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
      if (!row['ID запчасти']) {
        errors.push(`Строка ${index + 1}: Отсутствует ID запчасти`);
      }
      if (row['ID запчасти'] && isNaN(parseInt(row['ID запчасти']))) {
        errors.push(`Строка ${index + 1}: ID запчасти должен быть числом`);
      }
      if (!row['Количество']) {
        errors.push(`Строка ${index + 1}: Отсутствует количество`);
      }
      if (row['Количество'] && isNaN(parseInt(row['Количество']))) {
        errors.push(`Строка ${index + 1}: Количество должно быть числом`);
      }
      if (row['Количество'] && parseInt(row['Количество']) < 0) {
        errors.push(`Строка ${index + 1}: Количество не может быть отрицательным`);
      }
      if (!row['Дата последнего пополнения']) {
        errors.push(`Строка ${index + 1}: Отсутствует дата последнего пополнения`);
      }
      if (row['Дата последнего пополнения'] && isNaN(Date.parse(row['Дата последнего пополнения']))) {
        errors.push(`Строка ${index + 1}: Неверный формат даты`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  if (isLoading) {
    return <LoadingState 
      isLoading={isLoading}
      error={error ? 'Не удалось загрузить данные. Пожалуйста, проверьте подключение к серверу.' : null}
      onRetry={handleRetry}
      loadingText="Загрузка данных инвентаря и списка запчастей..."
    />;
  }

  const getPartName = (partId: number) => {
    console.log('Searching for partId:', partId, 'Type:', typeof partId);
    console.log('Available parts IDs:', parts?.map(p => ({ id: p.partId, type: typeof p.partId })));
    const part = parts?.find((p: Part) => p.partId === partId);
    return part ? part.name : 'Неизвестная запчасть';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Инвентарь</Typography>
      </Box>

      <LoadingState 
        isLoading={isLoading}
        error={error ? 'Не удалось загрузить данные. Пожалуйста, проверьте подключение к серверу.' : null}
        onRetry={handleRetry}
        loadingText="Загрузка данных инвентаря..."
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
                Добавить запись
              </Button>
            </Box>
          </Paper>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Запчасть</TableCell>
                  <TableCell>Количество</TableCell>
                  <TableCell>Дата последнего пополнения</TableCell>
                  <TableCell sx={{ minWidth: '180px' }}>Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventory?.map((item: Inventory) => (
                  <TableRow key={item.inventoryId}>
                    <TableCell>{item.inventoryId}</TableCell>
                    <TableCell>{getPartName(item.partId)}</TableCell>
                    <TableCell>{item.quantityInStock}</TableCell>
                    <TableCell>{new Date(item.lastRestockDate).toLocaleDateString()}</TableCell>
                    <TableCell sx={{ minWidth: '180px' }}>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Добавить количество">
                          <IconButton
                            onClick={() => {
                              setSelectedInventory(item);
                              setOpenAddQuantity(true);
                            }}
                          >
                            <AddCircleIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Уменьшить количество">
                          <IconButton
                            onClick={() => {
                              setSelectedInventory(item);
                              setOpenRemoveQuantity(true);
                            }}
                          >
                            <RemoveCircleIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Редактировать">
                          <IconButton
                            onClick={() => {
                              setSelectedInventory(item);
                              setNewInventory({
                                partId: item.partId,
                                quantityInStock: item.quantityInStock
                              });
                              setOpen(true);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Удалить">
                          <IconButton
                            onClick={() => handleDeleteClick(item)}
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
                {selectedInventory ? 'Редактировать запись' : 'Добавить запись'}
              </DialogTitle>
              <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, pt: 2 }}>
                  <FormControl fullWidth>
                    <InputLabel>Запчасть</InputLabel>
                    <Select
                      name="partId"
                      label="Запчасть"
                      defaultValue={selectedInventory?.partId || ''}
                    >
                      {parts?.map((part: Part) => (
                        <MenuItem key={part.partId} value={part.partId}>
                          {part.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    name="quantityInStock"
                    label="Количество"
                    type="number"
                    fullWidth
                    defaultValue={selectedInventory?.quantityInStock}
                    inputProps={{ min: 0 }}
                  />
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Отмена</Button>
                <Button type="submit" variant="contained">
                  {selectedInventory ? 'Сохранить' : 'Добавить'}
                </Button>
              </DialogActions>
            </form>
          </Dialog>

          <Dialog open={openAddQuantity || openRemoveQuantity} onClose={() => {
            setOpenAddQuantity(false);
            setOpenRemoveQuantity(false);
            setQuantityToChange('');
          }}>
            <DialogTitle>
              {openAddQuantity ? 'Добавить количество' : 'Уменьшить количество'}
            </DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Количество"
                type="number"
                fullWidth
                value={quantityToChange}
                onChange={(e) => setQuantityToChange(e.target.value)}
                inputProps={{ min: 1 }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => {
                setOpenAddQuantity(false);
                setOpenRemoveQuantity(false);
                setQuantityToChange('');
              }}>
                Отмена
              </Button>
              <Button onClick={handleQuantityChangeSubmit} variant="contained">
                Подтвердить
              </Button>
            </DialogActions>
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
                Вы уверены, что хотите удалить запись инвентаря для запчасти "{selectedInventory ? getPartName(selectedInventory.partId) : ''}"?
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
        templateHeaders={['ID запчасти', 'Количество', 'Дата последнего пополнения']}
        validateData={validateImportData}
        title="Импорт инвентаря"
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

export default InventoryPage; 