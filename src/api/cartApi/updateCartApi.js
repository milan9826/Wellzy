import { BASE_URL } from '../apiConstant';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiClient = axios.create({
  baseURL: BASE_URL,
});


export const updateCartApi = async (product_id, quantity) => {
  try {
    const token = await AsyncStorage.getItem('token');
    console.log('updateCartApi product_id:', product_id, 'quantity:', quantity);
    const response = await apiClient.put('/cart/update',
      { product_id, quantity },
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    console.log('updateCartApi response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating item in cart:', error); 
    throw error;
  }
};