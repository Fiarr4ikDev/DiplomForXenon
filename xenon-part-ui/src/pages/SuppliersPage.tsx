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
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState({
    name: false,
    contactPerson: false,
    phone: false,
    email: false,
    address: false
  });

  const { data: suppliers, isLoading } = useQuery({
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
      await axios.delete(`${API_URL}/suppliers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
  });

  const validateField = (name: string, value: any) => {
    switch (name) {
      case 'name':
        return !value || value.trim() === '';
      case 'phone':
        return !value || value.trim() === '';
      case 'email':
        return !value || value.trim() === '' || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value);
      default:
        return false;
    }
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setErrors(prev => ({ ...prev, name: validateField('name', value) }));
    if (selectedSupplier) {
      setSelectedSupplier({
        ...selectedSupplier,
        name: value
      });
    }
  };

  const handleContactPersonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (selectedSupplier) {
      setSelectedSupplier({
        ...selectedSupplier,
        contactPerson: value
      });
    }
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setErrors(prev => ({ ...prev, phone: validateField('phone', value) }));
    if (selectedSupplier) {
      setSelectedSupplier({
        ...selectedSupplier,
        phone: value
      });
    }
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setErrors(prev => ({ ...prev, email: validateField('email', value) }));
    if (selectedSupplier) {
      setSelectedSupplier({
        ...selectedSupplier,
        email: value
      });
    }
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (selectedSupplier) {
      setSelectedSupplier({
        ...selectedSupplier,
        address: value
      });
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
    setErrors({
      name: true,
      contactPerson: false,
      phone: true,
      email: true,
      address: false
    });
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSupplier(null);
    setErrors({
      name: false,
      contactPerson: false,
      phone: false,
      email: false,
      address: false
    });
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

    if (selectedSupplier) {
      updateMutation.mutate({ id: selectedSupplier.supplierId, data: supplierData });
    } else {
      createMutation.mutate(supplierData);
    }
  };

  if (isLoading) {
    return <Typography>Загрузка...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Поставщики</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
        >
          Добавить поставщика
        </Button>
      </Box>

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
                        if (window.confirm('Вы уверены, что хотите удалить этого поставщика?')) {
                          deleteMutation.mutate(supplier.supplierId);
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
          {selectedSupplier ? 'Редактировать поставщика' : 'Добавить поставщика'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              margin="dense"
              name="name"
              label="Название компании"
              fullWidth
              variant="outlined"
              value={selectedSupplier?.name || ''}
              onChange={handleNameChange}
              required
              error={errors.name}
              helperText={errors.name ? 'Название компании не может быть пустым' : ''}
            />
            <TextField
              margin="dense"
              name="contactPerson"
              label="Контактное лицо"
              fullWidth
              variant="outlined"
              value={selectedSupplier?.contactPerson || ''}
              onChange={handleContactPersonChange}
            />
            <TextField
              margin="dense"
              name="phone"
              label="Телефон"
              fullWidth
              variant="outlined"
              value={selectedSupplier?.phone || ''}
              onChange={handlePhoneChange}
              required
              error={errors.phone}
              helperText={errors.phone ? 'Телефон не может быть пустым' : ''}
            />
            <TextField
              margin="dense"
              name="email"
              label="Email"
              fullWidth
              variant="outlined"
              value={selectedSupplier?.email || ''}
              onChange={handleEmailChange}
              required
              error={errors.email}
              helperText={errors.email ? 
                (selectedSupplier?.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(selectedSupplier.email) ? 
                  'Некорректный формат email' : 
                  'Email не может быть пустым') : 
                ''}
            />
            <TextField
              margin="dense"
              name="address"
              label="Адрес"
              fullWidth
              variant="outlined"
              value={selectedSupplier?.address || ''}
              onChange={handleAddressChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Отмена</Button>
            <Button type="submit" variant="contained">
              {selectedSupplier ? 'Сохранить' : 'Добавить'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default SuppliersPage; 