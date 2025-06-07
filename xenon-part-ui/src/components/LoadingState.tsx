import React from 'react';
import { Box, CircularProgress, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '400px',
  padding: theme.spacing(3),
  textAlign: 'center',
}));

interface LoadingStateProps {
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  loadingText?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  isLoading = false,
  error = null,
  onRetry,
  loadingText = 'Ожидание подключения к API...',
}) => {
  if (isLoading) {
    return (
      <StyledBox>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography>{loadingText}</Typography>
      </StyledBox>
    );
  }

  if (error) {
    return (
      <StyledBox>
        <Typography variant="h6" color="error" gutterBottom>
          Произошла ошибка
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          {error}
        </Typography>
        {onRetry && (
          <Button
            variant="contained"
            color="primary"
            onClick={onRetry}
            sx={{ mt: 2 }}
          >
            Попробовать снова
          </Button>
        )}
      </StyledBox>
    );
  }

  return null;
}; 