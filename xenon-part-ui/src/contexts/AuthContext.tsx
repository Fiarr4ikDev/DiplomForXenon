import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { LoginRequest } from '../pages/LoginPage'; // Предполагается, что LoginRequest находится здесь или в общем месте
import { jwtDecode } from 'jwt-decode';

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

interface JwtPayload {
  userId: number;
  username: string;
  exp: number;
  iat: number;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  const fetchAndSetAvatar = async () => {
    const token = localStorage.getItem('authToken');
    let userId = 1;
    if (token) {
      try {
        const decoded = jwtDecode(token) as JwtPayload;
        userId = decoded.userId;
      } catch (e) {
        userId = 1;
      }
    }
    try {
      const response = await axios.get(`${API_URL}/auth/avatar/${userId}`, { responseType: 'arraybuffer', headers: { Authorization: `Bearer ${token}` } });
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setAvatarUrl(imageUrl);
        localStorage.setItem('avatarUrl', imageUrl);
      };
      reader.onerror = () => {
        setAvatarUrl(null);
        localStorage.removeItem('avatarUrl');
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      setAvatarUrl(null);
      localStorage.removeItem('avatarUrl');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUsername = localStorage.getItem('username');
    const storedAvatarUrl = localStorage.getItem('avatarUrl');
    let storedUserId = null;
    if (token) {
      try {
        const decoded = jwtDecode(token) as JwtPayload;
        storedUserId = decoded.userId;
        setUserId(storedUserId);
        localStorage.setItem('userId', String(storedUserId));
      } catch (e) {
        setUserId(null);
        localStorage.removeItem('userId');
      }
    }
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
      localStorage.removeItem('userId');
      setIsAuthenticated(false);
      setUsername(null);
      setAvatarUrl(null);
      setUserId(null);
    }
  }, []);

  const login = async (credentials: LoginRequest): Promise<boolean> => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      if (response.data && response.data.token && response.data.username && response.data.userId) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('username', response.data.username);
        localStorage.setItem('userId', String(response.data.userId));
        setIsAuthenticated(true);
        setUsername(response.data.username);
        setUserId(response.data.userId);
        fetchAndSetAvatar();
        return true;
      } else {
        setIsAuthenticated(false);
        setUsername(null);
        setAvatarUrl(null);
        setUserId(null);
        return false;
      }
    } catch (error: any) {
      setIsAuthenticated(false);
      setUsername(null);
      setAvatarUrl(null);
      setUserId(null);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('avatarUrl');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
    setUsername(null);
    setAvatarUrl(null);
    setUserId(null);
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