import { BASE_URL } from '../apiConstant';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiClient = axios.create({
  baseURL: BASE_URL,
});

export const getCartApi = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await apiClient.get('/cart', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const data = response.data;
 
    return data
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

