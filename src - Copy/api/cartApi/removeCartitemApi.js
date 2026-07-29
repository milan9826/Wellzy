import { BASE_URL } from '../apiConstant';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiClient = axios.create({
  baseURL: BASE_URL,
});


export const removeCartItemApi = async (itemId) => {
    console.log('removeCartItemApi itemId:', itemId);
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await apiClient.delete(`/cart/remove/${itemId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    console.log('removeCartItemApi response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error removing item from cart:', error);
    throw error;
  }
};