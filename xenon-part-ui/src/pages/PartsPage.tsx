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
  const queryClient = useQueryClient();

  const { data: parts } = useQuery({
    queryKey: ['parts'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/parts`);
      console.log('Полученные данные запчастей:', response.data);
      return response.data;
    },
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/categories`);
      return response.data;
    },
  });

  const { data: suppliers } = useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/suppliers`);
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (partData: PartRequest) => {
      const response = await axios.post(`${API_URL}/parts`, partData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parts'] });
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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Запчасти</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
        >
          Добавить запчасть
        </Button>
      </Box>

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
              <TableCell>Действия</TableCell>
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
                <TableCell>
                  <Tooltip title="Редактировать">
                    <IconButton
                      onClick={() => {
                        setSelectedPart(part);
                        handleClickOpen();
                      }}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Удалить">
                    <IconButton
                      onClick={() => handleDeleteClick(part)}
                      color="error"
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

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PartsPage; 