import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  CategoryOutlined,
  DonutSmallOutlined,
  Inventory2Outlined,
  ShoppingBasketOutlined,
  StoreOutlined,
} from '@mui/icons-material';
import axios from 'axios';
import { API_URL } from '../config';

interface DashboardData {
  overall: {
    totalParts: number;
    totalValue: number;
    averagePrice: number;
  };
  partsByCategory: Array<{
    categoryName: string;
    partCount: number;
  }>;
  partsBySupplier: Array<{
    supplierName: string;
    partCount: number;
  }>;
  valueByCategory: Array<{
    categoryName: string;
    totalValue: number;
  }>;
  valueBySupplier: Array<{
    supplierName: string;
    totalValue: number;
  }>;
  lowStock: Array<{
    partName: string;
    quantity: number;
  }>;
  categoryStats: Array<{
    categoryName: string;
    partCount: number;
    totalValue: number;
    averagePrice: number;
  }>;
  supplierStats: Array<{
    supplierName: string;
    partCount: number;
    totalValue: number;
    averagePrice: number;
  }>;
  inventoryOverview: {
    totalQuantity: number;
    uniqueParts: number;
    averageQuantity: number;
  };
  stockDistribution: Array<{
    stockLevel: string;
    count: number;
  }>;
}

/**
 * Компонент панели метрик для отображения статистики инвентаря.
 * @returns JSX.Element
 */
const MetricsDashboard: React.FC = () => {
  const [loadingOverall, setLoadingOverall] = useState(true);
  const [errorOverall, setErrorOverall] = useState<string | null>(null);
  const [overallData, setOverallData] = useState<DashboardData['overall'] | null>(null);

  const [loadingInventory, setLoadingInventory] = useState(true);
  const [errorInventory, setErrorInventory] = useState<string | null>(null);
  const [inventoryData, setInventoryData] = useState<DashboardData['inventoryOverview'] | null>(null);

  const [loadingStockDistribution, setLoadingStockDistribution] = useState(true);
  const [errorStockDistribution, setErrorStockDistribution] = useState<string | null>(null);
  const [stockDistributionData, setStockDistributionData] = useState<DashboardData['stockDistribution'] | null>(null);

  const [loadingCategoryMetrics, setLoadingCategoryMetrics] = useState(true);
  const [errorCategoryMetrics, setErrorCategoryMetrics] = useState<string | null>(null);
  const [categoryStatsData, setCategoryStatsData] = useState<DashboardData['categoryStats'] | null>(null);

  const [loadingSupplierMetrics, setLoadingSupplierMetrics] = useState(true);
  const [errorSupplierMetrics, setErrorSupplierMetrics] = useState<string | null>(null);
  const [supplierStatsData, setSupplierStatsData] = useState<DashboardData['supplierStats'] | null>(null);

  const [loadingLowStock, setLoadingLowStock] = useState(true);
  const [errorLowStock, setErrorLowStock] = useState<string | null>(null);
  const [lowStockData, setLowStockData] = useState<DashboardData['lowStock'] | null>(null);

  const [isConnecting, setIsConnecting] = useState(true);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(10);
  const [mediumStockThreshold, setMediumStockThreshold] = useState<number>(50);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const savedLowThreshold = localStorage.getItem('lowStockThreshold');
    const savedMediumThreshold = localStorage.getItem('mediumStockThreshold');

    if (savedLowThreshold !== null) {
      const numThreshold = Number(savedLowThreshold);
      if (!isNaN(numThreshold)) {
        setLowStockThreshold(numThreshold);
      }
    }

    if (savedMediumThreshold !== null) {
      const numThreshold = Number(savedMediumThreshold);
      if (!isNaN(numThreshold)) {
        setMediumStockThreshold(numThreshold);
      }
    }
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoadingOverall(true);
        const response = await axios.get(`${API_URL}/metrics/overall`);
        setOverallData(response.data);
        setErrorOverall(null);
      } catch (error) {
        console.error('Error fetching overall data:', error);
        setErrorOverall('Ошибка при загрузке общей статистики');
      } finally {
        setLoadingOverall(false);
      }

      try {
        setLoadingInventory(true);
        const response = await axios.get(`${API_URL}/metrics/inventory`);
        setInventoryData(response.data);
        setErrorInventory(null);
      } catch (error) {
        console.error('Error fetching inventory data:', error);
        setErrorInventory('Ошибка при загрузке статистики инвентаря');
      } finally {
        setLoadingInventory(false);
      }

      try {
        setLoadingStockDistribution(true);
        const response = await axios.get(`${API_URL}/metrics/stock-distribution`, {
          params: {
            lowThreshold: lowStockThreshold,
            mediumThreshold: mediumStockThreshold
          }
        });
        setStockDistributionData(response.data);
        setErrorStockDistribution(null);
      } catch (error) {
        console.error('Error fetching stock distribution data:', error);
        setErrorStockDistribution('Ошибка при загрузке распределения запасов');
      } finally {
        setLoadingStockDistribution(false);
      }

      try {
        setLoadingCategoryMetrics(true);
        const response = await axios.get(`${API_URL}/metrics/category-stats`);
        setCategoryStatsData(response.data);
        setErrorCategoryMetrics(null);
      } catch (error) {
        console.error('Error fetching category stats data:', error);
        setErrorCategoryMetrics('Ошибка при загрузке статистики по категориям');
      } finally {
        setLoadingCategoryMetrics(false);
      }

      try {
        setLoadingSupplierMetrics(true);
        const response = await axios.get(`${API_URL}/metrics/supplier-stats`);
        setSupplierStatsData(response.data);
        setErrorSupplierMetrics(null);
      } catch (error) {
        console.error('Error fetching supplier stats data:', error);
        setErrorSupplierMetrics('Ошибка при загрузке статистики по поставщикам');
      } finally {
        setLoadingSupplierMetrics(false);
      }

      try {
        setLoadingLowStock(true);
        const response = await axios.get(`${API_URL}/metrics/low-stock`, {
          params: {
            threshold: lowStockThreshold
          }
        });
        setLowStockData(response.data);
        setErrorLowStock(null);
      } catch (error) {
        console.error('Error fetching low stock data:', error);
        setErrorLowStock('Ошибка при загрузке деталей с низким запасом');
      } finally {
        setLoadingLowStock(false);
      }

      const hasAnyData = overallData || inventoryData || stockDistributionData ||
          categoryStatsData || supplierStatsData || lowStockData;

      if (hasAnyData) {
        setIsInitialLoad(false);
        setIsConnecting(false);
      }
    };

    fetchDashboardData();
  }, [lowStockThreshold, mediumStockThreshold]);

  const refreshData = () => {
    setIsInitialLoad(true);
    setIsConnecting(true);
  };

  useEffect(() => {
    (window as any).refreshDashboardData = refreshData;
    return () => {
      delete (window as any).refreshDashboardData;
    };
  }, []);

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return '-';
    return `${value.toLocaleString()} ₽`;
  };

  const hasAnyData = overallData || inventoryData || stockDistributionData ||
      categoryStatsData || supplierStatsData || lowStockData;

  if (!hasAnyData) {
    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px" flexDirection="column">
          <CircularProgress sx={{ mb: 2 }} />
          <Typography>Ожидание подключения к API...</Typography>
        </Box>
    );
  }

  return (
      <Box sx={{ p: 2 }}>
        {!errorLowStock && (
            <Box sx={{ mb: 2 }}>
              <Card>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <DonutSmallOutlined sx={{ mr: 1 }} />
                    <Typography variant="h6">Детали с низким запасом</Typography>
                  </Box>
                  {loadingLowStock ? (
                      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100px">
                        <CircularProgress />
                      </Box>
                  ) : lowStockData ? (
                      <List dense>
                        {lowStockData.map((item, index) => (
                            <React.Fragment key={index}>
                              <ListItem>
                                <ListItemText
                                    primary={item.partName}
                                    secondary={`Остаток: ${item.quantity}`}
                                />
                              </ListItem>
                              {index < lowStockData.length - 1 && <Divider component="li" />}
                            </React.Fragment>
                        ))}
                      </List>
                  ) : null}
                </CardContent>
              </Card>
            </Box>
        )}

        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', md: 'row' } }}>
          {!errorOverall && (
              <Card sx={{ flexGrow: 1 }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <ShoppingBasketOutlined sx={{ mr: 1 }} />
                    <Typography variant="h6">Общая статистика</Typography>
                  </Box>
                  {loadingOverall ? (
                      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100px">
                        <CircularProgress />
                      </Box>
                  ) : overallData ? (
                      <List dense>
                        <ListItem>
                          <ListItemText
                              primary="Всего деталей"
                              secondary={overallData.totalParts.toLocaleString()}
                          />
                        </ListItem>
                        <Divider />
                        <ListItem>
                          <ListItemText
                              primary="Общая стоимость"
                              secondary={formatCurrency(overallData.totalValue)}
                          />
                        </ListItem>
                        <Divider />
                        <ListItem>
                          <ListItemText
                              primary="Средняя цена"
                              secondary={formatCurrency(overallData.averagePrice)}
                          />
                        </ListItem>
                      </List>
                  ) : null}
                </CardContent>
              </Card>
          )}

          {!errorInventory && (
              <Card sx={{ flexGrow: 1 }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Inventory2Outlined sx={{ mr: 1 }} />
                    <Typography variant="h6">Статистика инвентаря</Typography>
                  </Box>
                  {loadingInventory ? (
                      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100px">
                        <CircularProgress />
                      </Box>
                  ) : inventoryData ? (
                      <List dense>
                        <ListItem>
                          <ListItemText
                              primary="Общее количество"
                              secondary={inventoryData.totalQuantity.toLocaleString()}
                          />
                        </ListItem>
                        <Divider />
                        <ListItem>
                          <ListItemText
                              primary="Уникальных деталей"
                              secondary={inventoryData.uniqueParts.toLocaleString()}
                          />
                        </ListItem>
                        <Divider />
                        <ListItem>
                          <ListItemText
                              primary="Среднее количество"
                              secondary={inventoryData.averageQuantity.toLocaleString()}
                          />
                        </ListItem>
                      </List>
                  ) : null}
                </CardContent>
              </Card>
          )}

          {!errorStockDistribution && (
              <Paper sx={{ flexGrow: 1, p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <DonutSmallOutlined sx={{ mr: 1 }} />
                  <Typography variant="h6">Распределение запасов</Typography>
                </Box>
                {loadingStockDistribution ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100px">
                      <CircularProgress />
                    </Box>
                ) : stockDistributionData ? (
                    <List dense>
                      {stockDistributionData.map((item, index) => (
                          <React.Fragment key={index}>
                            <ListItem>
                              <ListItemText
                                  primary={item.stockLevel}
                                  secondary={`Количество деталей: ${item.count.toLocaleString()}`}
                              />
                            </ListItem>
                            {index < stockDistributionData.length - 1 && <Divider component="li" />}
                          </React.Fragment>
                      ))}
                    </List>
                ) : null}
              </Paper>
          )}
        </Box>

        {!errorCategoryMetrics && (
            <Box sx={{ mb: 2 }}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CategoryOutlined sx={{ mr: 1 }} />
                  <Typography variant="h6">Статистика по категориям</Typography>
                </Box>
                {loadingCategoryMetrics ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100px">
                      <CircularProgress />
                    </Box>
                ) : categoryStatsData ? (
                    <>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        Всего категорий: {categoryStatsData.length}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                        Топ 5 категорий по количеству деталей:
                      </Typography>
                      <List dense disablePadding>
                        {categoryStatsData.slice().sort((a, b) => b.partCount - a.partCount).slice(0, 5).map((item, index) => (
                            <ListItem key={item.categoryName} disableGutters>
                              <ListItemText
                                  primary={`${index + 1}. ${item.categoryName}`}
                                  secondary={`Деталей: ${item.partCount.toLocaleString()}, Стоимость: ${formatCurrency(item.totalValue)}`}
                              />
                            </ListItem>
                        ))}
                      </List>
                      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                        Топ 5 категорий по общей стоимости:
                      </Typography>
                      <List dense disablePadding>
                        {categoryStatsData.slice().sort((a, b) => (b.totalValue || 0) - (a.totalValue || 0)).slice(0, 5).map((item, index) => (
                            <ListItem key={item.categoryName} disableGutters>
                              <ListItemText
                                  primary={`${index + 1}. ${item.categoryName}`}
                                  secondary={`Стоимость: ${formatCurrency(item.totalValue)}, Деталей: ${item.partCount.toLocaleString()}`}
                              />
                            </ListItem>
                        ))}
                      </List>
                    </>
                ) : null}
              </Paper>
            </Box>
        )}

        {!errorSupplierMetrics && (
            <Box sx={{ mb: 2 }}>
              <Paper sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <StoreOutlined sx={{ mr: 1 }} />
                  <Typography variant="h6">Статистика по поставщикам</Typography>
                </Box>
                {loadingSupplierMetrics ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100px">
                      <CircularProgress />
                    </Box>
                ) : supplierStatsData ? (
                    <>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        Всего поставщиков: {supplierStatsData.length}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                        Топ 5 поставщиков по количеству деталей:
                      </Typography>
                      <List dense disablePadding>
                        {supplierStatsData.slice().sort((a, b) => b.partCount - a.partCount).slice(0, 5).map((item, index) => (
                            <ListItem key={item.supplierName} disableGutters>
                              <ListItemText
                                  primary={`${index + 1}. ${item.supplierName}`}
                                  secondary={`Деталей: ${item.partCount.toLocaleString()}, Стоимость: ${formatCurrency(item.totalValue)}`}
                              />
                            </ListItem>
                        ))}
                      </List>
                      <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                        Топ 5 поставщиков по общей стоимости:
                      </Typography>
                      <List dense disablePadding>
                        {supplierStatsData.slice().sort((a, b) => (b.totalValue || 0) - (a.totalValue || 0)).slice(0, 5).map((item, index) => (
                            <ListItem key={item.supplierName} disableGutters>
                              <ListItemText
                                  primary={`${index + 1}. ${item.supplierName}`}
                                  secondary={`Стоимость: ${formatCurrency(item.totalValue)}, Деталей: ${item.partCount.toLocaleString()}`}
                              />
                            </ListItem>
                        ))}
                      </List>
                    </>
                ) : null}
              </Paper>
            </Box>
        )}
      </Box>
  );
};

export default MetricsDashboard;