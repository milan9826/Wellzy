import { BASE_URL } from '../apiConstant';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiClient = axios.create({
  baseURL: BASE_URL,
});

export const getProduct = async () => {
  try {
    const token = await AsyncStorage.getItem('token');

    const response = await apiClient.get('/product', {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {},
    });

    console.log('Response data:', response.data);
    const payload = response.data.data;
    const products = payload;
    console.log('Products:', products);

    return products;
  } catch (error) {
    //console.error('Error fetching products:', error);
    throw error;
  }
};
