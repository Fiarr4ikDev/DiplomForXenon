import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { LoginRequest } from '../pages/LoginPage'; // Предполагается, что LoginRequest находится здесь или в общем месте

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  avatarUrl: string | null;
  login: (credentials: LoginRequest) => Promise<boolean>;
  logout: () => void;
  updateUsername: (newUsername: string) => void;
  fetchAndSetAvatar: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const fetchAndSetAvatar = async () => {
    const userId = 1;
    try {
      const response = await axios.get(`${API_URL}/auth/avatar/${userId}`, { responseType: 'arraybuffer' });

      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const reader = new FileReader();

      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setAvatarUrl(imageUrl);
        localStorage.setItem('avatarUrl', imageUrl);
      };

      reader.onerror = () => {
        console.error('FileReader error');
        setAvatarUrl(null);
        localStorage.removeItem('avatarUrl');
      };

      reader.readAsDataURL(blob);

    } catch (error) {
      console.error('Error fetching avatar:', error);
      setAvatarUrl(null);
      localStorage.removeItem('avatarUrl');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUsername = localStorage.getItem('username');
    const storedAvatarUrl = localStorage.getItem('avatarUrl');

    if (token && storedUsername) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
      if (storedAvatarUrl) {
        setAvatarUrl(storedAvatarUrl);
      } else {
        fetchAndSetAvatar();
      }
    } else {
      localStorage.removeItem('authToken');
      localStorage.removeItem('username');
      localStorage.removeItem('avatarUrl');
      setIsAuthenticated(false);
      setUsername(null);
      setAvatarUrl(null);
    }
  }, []);

  const login = async (credentials: LoginRequest): Promise<boolean> => {
    try {
      console.log('Attempting login with:', credentials);
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      console.log('Login response:', response);
      console.log('Login response data:', response.data);

      if (response.data && response.data.token && response.data.username) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('username', response.data.username);
        setIsAuthenticated(true);
        setUsername(response.data.username);

        fetchAndSetAvatar();

        return true;
      } else {
        console.log('Login failed: No token or username in response');
        setIsAuthenticated(false);
        setUsername(null);
        setAvatarUrl(null);
        return false;
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: `${API_URL}/auth/login`
      });
      setIsAuthenticated(false);
      setUsername(null);
      setAvatarUrl(null);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('avatarUrl');
    setIsAuthenticated(false);
    setUsername(null);
    setAvatarUrl(null);
  };

  const updateUsername = (newUsername: string) => {
    setUsername(newUsername);
    localStorage.setItem('username', newUsername);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, username, avatarUrl, login, logout, updateUsername, fetchAndSetAvatar }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 