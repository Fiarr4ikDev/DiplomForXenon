import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { FileDownload as FileDownloadIcon, Upload as UploadIcon } from '@mui/icons-material';
import * as XLSX from 'xlsx';

interface ImportDialogProps {
  open: boolean;
  onClose: () => void;
  onImport: (data: any[]) => void;
  templateHeaders: string[];
  validateData: (data: any[]) => { isValid: boolean; errors: string[] };
  title: string;
}

export const ImportDialog: React.FC<ImportDialogProps> = ({
  open,
  onClose,
  onImport,
  templateHeaders,
  validateData,
  title,
}) => {
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(false);

  const handleDownloadTemplate = () => {
    const wb = XLSX.utils.book_new();
    
    // Создаем массив с заголовками и 10 пустыми строками
    const templateData = [
      templateHeaders,
      ...Array(10).fill(Array(templateHeaders.length).fill(''))
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(templateData);
    
    // Устанавливаем ширину столбцов
    const colWidths = templateHeaders.map(() => ({ wch: 20 }));
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
    templateHeaders.forEach((_, index) => {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: index });
      if (!ws[cellRef]) ws[cellRef] = { v: templateHeaders[index] };
      ws[cellRef].s = headerStyle;
    });

    // Применяем стили к пустым ячейкам
    for (let row = 1; row <= 10; row++) {
      for (let col = 0; col < templateHeaders.length; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
        if (!ws[cellRef]) ws[cellRef] = { v: '' };
        ws[cellRef].s = cellStyle;
      }
    }

    XLSX.utils.book_append_sheet(wb, ws, 'Шаблон');
    XLSX.writeFile(wb, 'template.xlsx');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Валидация данных
        const validation = validateData(jsonData);
        setValidationErrors(validation.errors);
        setIsValid(validation.isValid);

        if (validation.isValid) {
          setPreviewData(jsonData); // Показываем все строки для превью
        }
      } catch (error) {
        setValidationErrors(['Ошибка при чтении файла']);
        setIsValid(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleImport = () => {
    if (isValid) {
      onImport(previewData);
      onClose();
      // Очищаем данные после импорта
      setPreviewData([]);
      setValidationErrors([]);
      setIsValid(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Очищаем данные при закрытии
    setPreviewData([]);
    setValidationErrors([]);
    setIsValid(false);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={handleDownloadTemplate}
            sx={{ mr: 2 }}
          >
            Скачать шаблон
          </Button>
          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadIcon />}
          >
            Выбрать файл
            <input
              type="file"
              hidden
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              onClick={(e) => {
                // Очищаем значение input при клике, чтобы можно было выбрать тот же файл снова
                (e.target as HTMLInputElement).value = '';
              }}
            />
          </Button>
        </Box>

        {validationErrors.length > 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {validationErrors.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </Alert>
        )}

        {previewData.length > 0 && (
          <>
            <Typography variant="h6" sx={{ mb: 2 }}>Предпросмотр данных:</Typography>
            <TableContainer component={Paper} sx={{ maxHeight: 300, overflowY: 'auto' }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    {templateHeaders.map((header, index) => (
                      <TableCell key={index}>{header}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {previewData.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {templateHeaders.map((header, colIndex) => (
                        <TableCell key={colIndex}>{row[header]}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Отмена</Button>
        <Button
          onClick={handleImport}
          variant="contained"
          disabled={!isValid}
        >
          Импорт
        </Button>
      </DialogActions>
    </Dialog>
  );
}; 