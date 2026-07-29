import { BASE_URL } from '../apiConstant';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiClient = axios.create({
  baseURL: BASE_URL,
});


export const clearCartApi = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await apiClient.delete('/cart/clear', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    console.log('clearCartApi response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  } 
};

