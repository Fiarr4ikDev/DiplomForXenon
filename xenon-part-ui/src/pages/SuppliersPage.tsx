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
import { Add as AddIcon, FilterList as FilterListIcon, FileDownload as FileDownloadIcon, TableChart as TableChartIcon } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { LoadingState } from '../components/LoadingState';
import * as XLSX from 'xlsx';

const API_URL = 'http://localhost:8080/api';

interface Supplier {
  supplierId: number;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
}

interface SupplierRequest {
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
}

const SuppliersPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const queryClient = useQueryClient();
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'error' | 'success' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });

  const { data: suppliers, isLoading, error, refetch } = useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/suppliers`);
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (supplierData: SupplierRequest) => {
      const response = await axios.post(`${API_URL}/suppliers`, supplierData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      setOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: SupplierRequest }) => {
      const response = await axios.put(`${API_URL}/suppliers/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      setOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      try {
        await axios.delete(`${API_URL}/suppliers/${id}`);
      } catch (error: any) {
        if (error.response?.status === 500 && error.response?.data?.message?.includes('violates foreign key constraint')) {
          throw new Error('Невозможно удалить поставщика, так как существуют связанные запчасти');
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      setNotification({
        open: true,
        message: 'Поставщик успешно удален',
        severity: 'success'
      });
    },
    onError: (error: Error) => {
      setNotification({
        open: true,
        message: error.message || 'Произошла ошибка при удалении поставщика',
        severity: 'error'
      });
    }
  });

  const validateForm = (data: SupplierRequest): boolean => {
    if (!data.name || data.name.trim() === '') {
      setNotification({
        open: true,
        message: 'Пожалуйста, введите название поставщика',
        severity: 'error'
      });
      return false;
    }
    if (!data.phone || data.phone.trim() === '') {
      setNotification({
        open: true,
        message: 'Пожалуйста, введите номер телефона',
        severity: 'error'
      });
      return false;
    }
    if (!data.email || data.email.trim() === '' || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(data.email)) {
      setNotification({
        open: true,
        message: 'Пожалуйста, введите корректный email',
        severity: 'error'
      });
      return false;
    }
    return true;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const supplierData: SupplierRequest = {
      name: formData.get('name') as string,
      contactPerson: formData.get('contactPerson') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      address: formData.get('address') as string,
    };

    if (!validateForm(supplierData)) {
      return;
    }

    if (selectedSupplier) {
      updateMutation.mutate({ id: selectedSupplier.supplierId, data: supplierData });
      setNotification({
        open: true,
        message: 'Поставщик успешно обновлен',
        severity: 'success'
      });
    } else {
      createMutation.mutate(supplierData);
      setNotification({
        open: true,
        message: 'Поставщик успешно добавлен',
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
    setSelectedSupplier(null);
  };

  const handleDeleteClick = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setOpenDelete(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedSupplier) {
      deleteMutation.mutate(selectedSupplier.supplierId);
      setOpenDelete(false);
    }
  };

  const handleDeleteCancel = () => {
    setOpenDelete(false);
    setSelectedSupplier(null);
  };

  const handleExportToExcel = () => {
    // Создаем заголовки для Excel
    const headers = ['ID', 'Название', 'Контактное лицо', 'Телефон', 'Email', 'Адрес'];
    
    // Подготавливаем данные
    const data = suppliers?.map(supplier => [
      supplier.supplierId,
      supplier.name,
      supplier.contactPerson,
      supplier.phone,
      supplier.email,
      supplier.address
    ]) || [];

    // Создаем рабочую книгу
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);

    // Устанавливаем ширину столбцов
    const colWidths = [
      { wch: 5 },  // ID
      { wch: 30 }, // Название
      { wch: 20 }, // Контактное лицо
      { wch: 15 }, // Телефон
      { wch: 25 }, // Email
      { wch: 40 }  // Адрес
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
    XLSX.utils.book_append_sheet(wb, ws, 'Поставщики');

    // Сохраняем файл
    XLSX.writeFile(wb, 'suppliers.xlsx');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Поставщики</Typography>
      </Box>

      <LoadingState 
        isLoading={isLoading}
        error={error ? 'Не удалось загрузить данные. Пожалуйста, проверьте подключение к серверу.' : null}
        onRetry={refetch}
        loadingText="Загрузка списка поставщиков..."
      />

      {!isLoading && !error && (
        <>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<FilterListIcon />}
              >
                Фильтры
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
                Добавить поставщика
              </Button>
            </Box>
          </Paper>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Название</TableCell>
                  <TableCell>Контактное лицо</TableCell>
                  <TableCell>Телефон</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Адрес</TableCell>
                  <TableCell>Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {suppliers?.map((supplier: Supplier) => (
                  <TableRow key={supplier.supplierId}>
                    <TableCell>{supplier.supplierId}</TableCell>
                    <TableCell>{supplier.name}</TableCell>
                    <TableCell>{supplier.contactPerson}</TableCell>
                    <TableCell>{supplier.phone}</TableCell>
                    <TableCell>{supplier.email}</TableCell>
                    <TableCell>{supplier.address}</TableCell>
                    <TableCell>
                      <Tooltip title="Редактировать">
                        <IconButton
                          onClick={() => {
                            setSelectedSupplier(supplier);
                            setOpen(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Удалить">
                        <IconButton
                          onClick={() => handleDeleteClick(supplier)}
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
                {selectedSupplier ? 'Редактировать поставщика' : 'Добавить поставщика'}
              </DialogTitle>
              <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                  <TextField
                    name="name"
                    label="Название"
                    fullWidth
                    defaultValue={selectedSupplier?.name}
                  />
                  <TextField
                    name="contactPerson"
                    label="Контактное лицо"
                    fullWidth
                    defaultValue={selectedSupplier?.contactPerson}
                  />
                  <TextField
                    name="phone"
                    label="Телефон"
                    fullWidth
                    defaultValue={selectedSupplier?.phone}
                  />
                  <TextField
                    name="email"
                    label="Email"
                    fullWidth
                    defaultValue={selectedSupplier?.email}
                  />
                  <TextField
                    name="address"
                    label="Адрес"
                    fullWidth
                    defaultValue={selectedSupplier?.address}
                  />
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Отмена</Button>
                <Button type="submit" variant="contained">
                  {selectedSupplier ? 'Сохранить' : 'Добавить'}
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
                Вы уверены, что хотите удалить поставщика "{selectedSupplier?.name}"?
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
    </Box>
  );
};

export default SuppliersPage; 