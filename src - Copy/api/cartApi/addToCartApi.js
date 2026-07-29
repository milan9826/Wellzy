import { BASE_URL } from '../apiConstant';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiClient = axios.create({
  baseURL: BASE_URL,
});


export const addToCartApi = async (item) => {
//console.log('addToCartApi item:', item);
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await apiClient.post('/cart/add', item, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    console.log('addToCartApi response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error adding item to cart:', error);
    throw error;
  } 
}




