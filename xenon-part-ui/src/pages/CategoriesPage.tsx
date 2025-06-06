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
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

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
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState<CategoryRequest>({
    name: '',
    description: ''
  });
  const [errors, setErrors] = useState({
    name: false,
    description: false
  });
  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery({
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
      await axios.delete(`${API_URL}/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const validateField = (name: string, value: any) => {
    switch (name) {
      case 'name':
        return !value || value.trim() === '' || value.length > 100;
      case 'description':
        return value && value.length > 250;
      default:
        return false;
    }
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setErrors(prev => ({ ...prev, name: validateField('name', value) }));
    if (selectedCategory) {
      setSelectedCategory({
        ...selectedCategory,
        name: value
      });
    } else {
      setNewCategory({
        ...newCategory,
        name: value
      });
    }
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setErrors(prev => ({ ...prev, description: validateField('description', value) }));
    if (selectedCategory) {
      setSelectedCategory({
        ...selectedCategory,
        description: value
      });
    } else {
      setNewCategory({
        ...newCategory,
        description: value
      });
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
    setErrors({
      name: true,
      description: false
    });
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCategory(null);
    setNewCategory({
      name: '',
      description: ''
    });
    setErrors({
      name: false,
      description: false
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const categoryData: CategoryRequest = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
    };

    if (selectedCategory) {
      updateMutation.mutate({ id: selectedCategory.categoryId, data: categoryData });
    } else {
      createMutation.mutate(categoryData);
    }
  };

  if (isLoading) {
    return <Typography>Загрузка...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Категории</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
        >
          Добавить категорию
        </Button>
      </Box>

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
                        setOpen(true);
                      }}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Удалить">
                    <IconButton
                      onClick={() => {
                        if (window.confirm('Вы уверены, что хотите удалить эту категорию?')) {
                          deleteMutation.mutate(category.categoryId);
                        }
                      }}
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

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {selectedCategory ? 'Редактировать категорию' : 'Добавить категорию'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="name"
              label="Название"
              fullWidth
              variant="outlined"
              value={selectedCategory?.name || newCategory.name}
              onChange={handleNameChange}
              required
              error={errors.name}
              helperText={errors.name ? 
                ((selectedCategory?.name && selectedCategory.name.length > 100) || newCategory.name.length > 100 ? 
                  'Название не должно превышать 100 символов' : 
                  'Название не может быть пустым') : 
                ''}
            />
            <TextField
              margin="dense"
              name="description"
              label="Описание"
              fullWidth
              variant="outlined"
              value={selectedCategory?.description || newCategory.description}
              onChange={handleDescriptionChange}
              error={errors.description}
              helperText={errors.description ? 'Описание не должно превышать 250 символов' : ''}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Отмена</Button>
            <Button type="submit" variant="contained">
              {selectedCategory ? 'Сохранить' : 'Добавить'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default CategoriesPage; 