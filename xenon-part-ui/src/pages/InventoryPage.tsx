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
  FormHelperText,
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon, AddCircle as AddCircleIcon, RemoveCircle as RemoveCircleIcon } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { 
    getInventory, 
    createInventory, 
    updateInventory, 
    deleteInventory,
    addInventoryQuantity,
    removeInventoryQuantity
} from '../api/inventory';

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
  const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(null);
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [newInventory, setNewInventory] = useState<InventoryRequest>({ partId: 0, quantityInStock: 0 });
  const [quantityToChange, setQuantityToChange] = useState<string>('');
  const [errors, setErrors] = useState({
    partId: false,
    quantityInStock: false,
    quantityToChange: false
  });
  const queryClient = useQueryClient();

  const { data: inventory, isLoading: isInventoryLoading } = useQuery<Inventory[]>({
    queryKey: ['inventory'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/inventory`);
      return response.data;
    },
  });

  const { data: parts, isLoading: isPartsLoading } = useQuery<Part[]>({
    queryKey: ['parts'],
    queryFn: async () => {
      const response = await axios.get(`${API_URL}/parts`);
      return response.data;
    },
  });

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
      setOpen(false);
      setOpenAddQuantity(false);
      setOpenRemoveQuantity(false);
      setSelectedInventory(null);
      setQuantityToChange('');
      setErrors({
        partId: false,
        quantityInStock: false,
        quantityToChange: false
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await axios.delete(`${API_URL}/inventory/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });

  const validateField = (name: string, value: any) => {
    switch (name) {
      case 'partId':
        return !value || value === 0;
      case 'quantityInStock':
        return !value || value < 0;
      default:
        return false;
    }
  };

  const handlePartChange = (event: SelectChangeEvent<number>) => {
    const partId = event.target.value as number;
    setErrors(prev => ({ ...prev, partId: validateField('partId', partId) }));
    if (selectedInventory) {
      setSelectedInventory({
        ...selectedInventory,
        partId: partId
      });
    } else {
      setNewInventory({
        ...newInventory,
        partId: partId
      });
    }
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setErrors(prev => ({ ...prev, quantityInStock: validateField('quantityInStock', value) }));
    if (value === '' || /^\d*$/.test(value)) {
      if (selectedInventory) {
        setSelectedInventory({
          ...selectedInventory,
          quantityInStock: value === '' ? 0 : Number(value),
          lastRestockDate: new Date().toISOString()
        });
      } else {
        setNewInventory({
          ...newInventory,
          quantityInStock: value === '' ? '' : Number(value)
        });
      }
    }
  };

  const handleAddQuantity = (inventory: Inventory) => {
    setSelectedInventory(inventory);
    setQuantityToChange('');
    setOpenAddQuantity(true);
  };

  const handleRemoveQuantity = (inventory: Inventory) => {
    setSelectedInventory(inventory);
    setQuantityToChange('');
    setOpenRemoveQuantity(true);
  };

  const handleQuantityChangeSubmit = async () => {
    if (!selectedInventory || !quantityToChange) return;

    const quantity = parseInt(quantityToChange);
    if (isNaN(quantity) || quantity <= 0) {
        setErrors(prev => ({ ...prev, quantityToChange: true }));
        return;
    }

    try {
        if (openAddQuantity) {
            await addInventoryQuantity(selectedInventory.inventoryId, quantity);
        } else if (openRemoveQuantity) {
            await removeInventoryQuantity(selectedInventory.inventoryId, quantity);
        }
        
        // Обновляем данные после успешного изменения
        queryClient.invalidateQueries({ queryKey: ['inventory'] });
        
        // Закрываем модальное окно и сбрасываем состояние
        setOpenAddQuantity(false);
        setOpenRemoveQuantity(false);
        setQuantityToChange('');
        setSelectedInventory(null);
        setErrors(prev => ({ ...prev, quantityToChange: false }));
    } catch (error) {
        console.error('Ошибка при изменении количества:', error);
        // Показываем ошибку пользователю
        setErrors(prev => ({ ...prev, quantityToChange: true }));
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
    setErrors({
      partId: true,
      quantityInStock: true,
      quantityToChange: false
    });
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedInventory(null);
    setNewInventory({
      partId: 0,
      quantityInStock: 0
    });
    setErrors({
      partId: false,
      quantityInStock: false,
      quantityToChange: false
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const inventoryData: InventoryRequest = {
      partId: Number(formData.get('partId')),
      quantityInStock: Number(formData.get('quantityInStock')),
    };

    if (selectedInventory) {
      updateMutation.mutate({ id: selectedInventory.inventoryId, data: inventoryData });
    } else {
      createMutation.mutate(inventoryData);
    }
  };

  if (isInventoryLoading || isPartsLoading) {
    return <Typography>Загрузка...</Typography>;
  }

  const getPartName = (partId: number) => {
    const part = parts?.find((p: Part) => p.partId === partId);
    return part ? part.name : 'Неизвестная запчасть';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Инвентарь</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleClickOpen()}
        >
          Добавить запись
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Запчасть</TableCell>
              <TableCell>Количество</TableCell>
              <TableCell>Последнее обновление</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventory?.map((item: Inventory) => (
              <TableRow key={item.inventoryId}>
                <TableCell>{item.inventoryId}</TableCell>
                <TableCell>{getPartName(item.partId)}</TableCell>
                <TableCell>{item.quantityInStock}</TableCell>
                <TableCell>{new Date(item.lastRestockDate).toLocaleString()}</TableCell>
                <TableCell>
                  <Tooltip title="Добавить количество">
                    <IconButton
                      onClick={() => handleAddQuantity(item)}
                      color="primary"
                    >
                      <AddCircleIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Вычесть количество">
                    <IconButton
                      onClick={() => handleRemoveQuantity(item)}
                      color="error"
                    >
                      <RemoveCircleIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Редактировать">
                    <IconButton
                      onClick={() => {
                        setSelectedInventory(item);
                        const part = parts?.find((p: Part) => p.partId === item.partId);
                        setSelectedPart(part || null);
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
                        if (window.confirm('Вы уверены, что хотите удалить эту запись инвентаря?')) {
                          deleteMutation.mutate(item.inventoryId);
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
          {selectedInventory ? 'Редактировать запись' : 'Добавить запись'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <FormControl fullWidth margin="dense" error={errors.partId}>
              <InputLabel>Запчасть</InputLabel>
              <Select
                name="partId"
                value={selectedInventory?.partId || newInventory.partId || ''}
                onChange={handlePartChange}
                label="Запчасть"
                required
              >
                {parts?.map((part: Part) => (
                  <MenuItem key={part.partId} value={part.partId}>
                    {part.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.partId && <FormHelperText>Выберите запчасть</FormHelperText>}
            </FormControl>

            {selectedPart && (
              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Категория: {selectedPart.categoryName}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Поставщик: {selectedPart.supplierName}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Цена: {selectedPart.unitPrice} ₽
                </Typography>
              </Box>
            )}

            <TextField
              margin="dense"
              name="quantityInStock"
              label="Количество"
              fullWidth
              variant="outlined"
              value={selectedInventory?.quantityInStock || newInventory.quantityInStock || ''}
              onChange={handleQuantityChange}
              required
              error={errors.quantityInStock}
              helperText={errors.quantityInStock ? 'Введите корректное количество (неотрицательное число)' : ''}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Отмена</Button>
            <Button type="submit" variant="contained">
              {selectedInventory ? 'Сохранить' : 'Добавить'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={openAddQuantity} onClose={() => setOpenAddQuantity(false)}>
        <DialogTitle>Добавить количество</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="quantity"
            label="Количество для добавления"
            fullWidth
            variant="outlined"
            value={quantityToChange}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '' || /^\d*$/.test(value)) {
                setQuantityToChange(value);
                setErrors(prev => ({ ...prev, quantityToChange: !value || !/^\d+$/.test(value) }));
              }
            }}
            required
            error={errors.quantityToChange}
            helperText={errors.quantityToChange ? 'Введите корректное количество' : ''}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddQuantity(false)}>Отмена</Button>
          <Button onClick={handleQuantityChangeSubmit} variant="contained" color="primary">
            Добавить
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openRemoveQuantity} onClose={() => setOpenRemoveQuantity(false)}>
        <DialogTitle>Вычесть количество</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="quantity"
            label="Количество для вычитания"
            fullWidth
            variant="outlined"
            value={quantityToChange}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '' || /^\d*$/.test(value)) {
                setQuantityToChange(value);
                setErrors(prev => ({ ...prev, quantityToChange: !value || !/^\d+$/.test(value) }));
              }
            }}
            required
            error={errors.quantityToChange}
            helperText={errors.quantityToChange ? 'Введите корректное количество' : ''}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRemoveQuantity(false)}>Отмена</Button>
          <Button onClick={handleQuantityChangeSubmit} variant="contained" color="error">
            Вычесть
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InventoryPage; 