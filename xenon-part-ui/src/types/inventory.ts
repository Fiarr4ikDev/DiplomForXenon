export interface Inventory {
    inventoryId: number;
    partId: number;
    partName: string;
    quantityInStock: number;
    lastRestockDate: string;
}

export interface InventoryRequest {
    partId: number;
    quantityInStock: number;
} 