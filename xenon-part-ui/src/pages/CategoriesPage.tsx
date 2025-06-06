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
import { Add as AddIcon } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { LoadingState } from '../components/LoadingState';

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
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState<CategoryRequest>({
    name: '',
    description: ''
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
      setNotification({
        open: true,
        message: 'Категория успешно удалена',
        severity: 'success'
      });
    },
    onError: (error: Error) => {
      setNotification({
        open: true,
        message: error.message || 'Произошла ошибка при удалении категории',
        severity: 'error'
      });
    }
  });

  const validateForm = (data: CategoryRequest): boolean => {
    if (!data.name || data.name.trim() === '') {
      setNotification({
        open: true,
        message: 'Пожалуйста, введите название категории',
        severity: 'error'
      });
      return false;
    }
    if (data.name.length > 100) {
      setNotification({
        open: true,
        message: 'Название категории не должно превышать 100 символов',
        severity: 'error'
      });
      return false;
    }
    if (data.description && data.description.length > 250) {
      setNotification({
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
      setNotification({
        open: true,
        message: 'Категория успешно обновлена',
        severity: 'success'
      });
    } else {
      createMutation.mutate(categoryData);
      setNotification({
        open: true,
        message: 'Категория успешно добавлена',
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

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Категории</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
        >
          Добавить категорию
        </Button>
      </Box>

      <LoadingState 
        isLoading={isLoading}
        error={error ? 'Не удалось загрузить данные. Пожалуйста, проверьте подключение к серверу.' : null}
        onRetry={refetch}
        loadingText="Загрузка списка категорий..."
      />

      {!isLoading && !error && (
        <>
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
                {categories?.map((category: Category) => (
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
                          onClick={() => handleDeleteClick(category)}
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

export default CategoriesPage; 