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
  FormHelperText,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Add as AddIcon } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { SelectChangeEvent } from '@mui/material';

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
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [newPart, setNewPart] = useState<PartRequest>({
    name: '',
    description: '',
    categoryId: 0,
    supplierId: 0,
    unitPrice: 0
  });
  const [errors, setErrors] = useState({
    name: false,
    description: false,
    categoryId: false,
    supplierId: false,
    unitPrice: false
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
      await axios.delete(`${API_URL}/parts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parts'] });
    },
  });

  const validateField = (name: string, value: any) => {
    switch (name) {
      case 'name':
        return !value || value.trim() === '';
      case 'description':
        return !value || value.trim() === '';
      case 'categoryId':
        return !value || value === 0;
      case 'supplierId':
        return !value || value === 0;
      case 'unitPrice':
        return !value || Number(value) <= 0;
      default:
        return false;
    }
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setErrors(prev => ({ ...prev, name: validateField('name', value) }));
    if (selectedPart) {
      setSelectedPart({
        ...selectedPart,
        name: value
      });
    } else {
      setNewPart({
        ...newPart,
        name: value
      });
    }
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setErrors(prev => ({ ...prev, description: validateField('description', value) }));
    if (selectedPart) {
      setSelectedPart({
        ...selectedPart,
        description: value
      });
    } else {
      setNewPart({
        ...newPart,
        description: value
      });
    }
  };

  const handleCategoryChange = (event: SelectChangeEvent<number>) => {
    const categoryId = event.target.value as number;
    setErrors(prev => ({ ...prev, categoryId: validateField('categoryId', categoryId) }));
    const category = categories?.find((c: Category) => c.categoryId === categoryId);
    if (selectedPart && category) {
      setSelectedPart({
        ...selectedPart,
        categoryId: category.categoryId,
        categoryName: category.name
      });
    } else if (category) {
      setNewPart({
        ...newPart,
        categoryId: category.categoryId
      });
    }
  };

  const handleSupplierChange = (event: SelectChangeEvent<number>) => {
    const supplierId = event.target.value as number;
    setErrors(prev => ({ ...prev, supplierId: validateField('supplierId', supplierId) }));
    const supplier = suppliers?.find((s: Supplier) => s.supplierId === supplierId);
    if (selectedPart && supplier) {
      setSelectedPart({
        ...selectedPart,
        supplierId: supplier.supplierId,
        supplierName: supplier.name
      });
    } else if (supplier) {
      setNewPart({
        ...newPart,
        supplierId: supplier.supplierId
      });
    }
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setErrors(prev => ({ ...prev, unitPrice: validateField('unitPrice', value) }));
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      if (selectedPart) {
        setSelectedPart({
          ...selectedPart,
          unitPrice: value
        });
      } else {
        setNewPart({
          ...newPart,
          unitPrice: value === '' ? 0 : Number(value)
        });
      }
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const price = selectedPart ? Number(selectedPart.unitPrice) : newPart.unitPrice;
    
    if (isNaN(price) || price <= 0) {
      alert('Пожалуйста, введите корректную цену');
      return;
    }

    if (selectedPart) {
      updateMutation.mutate({ 
        id: selectedPart.partId, 
        data: {
          name: selectedPart.name,
          description: selectedPart.description,
          categoryId: selectedPart.categoryId,
          supplierId: selectedPart.supplierId,
          unitPrice: price
        }
      });
    } else {
      createMutation.mutate({
        ...newPart,
        unitPrice: price
      });
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
    setErrors({
      name: true,
      description: true,
      categoryId: true,
      supplierId: true,
      unitPrice: true
    });
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPart(null);
    setNewPart({
      name: '',
      description: '',
      categoryId: 0,
      supplierId: 0,
      unitPrice: 0
    });
    setErrors({
      name: false,
      description: false,
      categoryId: false,
      supplierId: false,
      unitPrice: false
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <h2>Запчасти</h2>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedPart(null);
            setNewPart({
              name: '',
              description: '',
              categoryId: 0,
              supplierId: 0,
              unitPrice: 0
            });
            handleClickOpen();
          }}
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
                <TableCell>{part.unitPrice} ₽</TableCell>
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
                      onClick={() => {
                        if (window.confirm('Вы уверены, что хотите удалить эту запчасть?')) {
                          deleteMutation.mutate(part.partId);
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

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedPart ? 'Редактировать запчасть' : 'Добавить запчасть'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              margin="dense"
              name="name"
              label="Название"
              fullWidth
              variant="outlined"
              value={selectedPart?.name || newPart.name}
              onChange={handleNameChange}
              required
              error={errors.name}
              helperText={errors.name ? 'Название не может быть пустым' : ''}
            />
            <TextField
              margin="dense"
              name="description"
              label="Описание"
              fullWidth
              variant="outlined"
              value={selectedPart?.description || newPart.description}
              onChange={handleDescriptionChange}
              required
              error={errors.description}
              helperText={errors.description ? 'Описание не может быть пустым' : ''}
            />
            <FormControl fullWidth margin="dense" error={errors.categoryId}>
              <InputLabel>Категория</InputLabel>
              <Select
                name="categoryId"
                value={selectedPart?.categoryId || newPart.categoryId || ''}
                onChange={handleCategoryChange}
                label="Категория"
                required
              >
                {categories?.map((category: Category) => (
                  <MenuItem key={category.categoryId} value={category.categoryId}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.categoryId && <FormHelperText>Выберите категорию</FormHelperText>}
            </FormControl>
            <FormControl fullWidth margin="dense" error={errors.supplierId}>
              <InputLabel>Поставщик</InputLabel>
              <Select
                name="supplierId"
                value={selectedPart?.supplierId || newPart.supplierId || ''}
                onChange={handleSupplierChange}
                label="Поставщик"
                required
              >
                {suppliers?.map((supplier: Supplier) => (
                  <MenuItem key={supplier.supplierId} value={supplier.supplierId}>
                    {supplier.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.supplierId && <FormHelperText>Выберите поставщика</FormHelperText>}
            </FormControl>
            <TextField
              margin="dense"
              name="unitPrice"
              label="Цена"
              fullWidth
              variant="outlined"
              value={selectedPart?.unitPrice || (newPart.unitPrice ? newPart.unitPrice.toString() : '')}
              onChange={handlePriceChange}
              required
              error={errors.unitPrice}
              helperText={errors.unitPrice ? 'Введите корректную цену (больше 0)' : ''}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Отмена</Button>
            <Button type="submit" variant="contained">
              {selectedPart ? 'Сохранить' : 'Добавить'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default PartsPage; 