import axios from 'axios';
import { API_URL } from '../config';
import { Inventory, InventoryRequest } from '../types/inventory';

export const getInventory = async (): Promise<Inventory[]> => {
    const response = await axios.get(`${API_URL}/inventory`);
    return response.data;
};

export const createInventory = async (data: InventoryRequest): Promise<Inventory> => {
    const response = await axios.post(`${API_URL}/inventory`, data);
    return response.data;
};

export const updateInventory = async (id: number, data: InventoryRequest): Promise<Inventory> => {
    const response = await axios.put(`${API_URL}/inventory/${id}`, data);
    return response.data;
};

export const addInventoryQuantity = async (id: number, quantity: number): Promise<Inventory> => {
    const response = await axios.post(`${API_URL}/inventory/${id}/add`, null, {
        params: { quantity }
    });
    return response.data;
};

export const removeInventoryQuantity = async (id: number, quantity: number): Promise<Inventory> => {
    const response = await axios.post(`${API_URL}/inventory/${id}/remove`, null, {
        params: { quantity }
    });
    return response.data;
};

export const deleteInventory = async (id: number): Promise<void> => {
    await axios.delete(`${API_URL}/inventory/${id}`);
}; 