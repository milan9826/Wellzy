import { BASE_URL } from '../apiConstant';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiClient = axios.create({
  baseURL: BASE_URL,
});


export const createProductApi = async (productData) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await apiClient.post('/product', productData, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    console.log('createProductApi response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  } 
};