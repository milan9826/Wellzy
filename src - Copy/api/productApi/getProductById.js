import { BASE_URL } from '../apiConstant';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiClient = axios.create({
  baseURL: BASE_URL,
});


export const getProductById = async (productId) => {
  try {
    console.log('Fetching product with ID:', productId);
    const token = await AsyncStorage.getItem('token');
    const response = await apiClient.get(`/product/${productId}`, {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {},
    });
    console.log('Response data:', response.data);
    const product =response.data?.product
      
    console.log('Product:', product);
    return product;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error;
  }
};
