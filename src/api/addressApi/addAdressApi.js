import { BASE_URL } from '../apiConstant';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiClient = axios.create({
  baseURL: BASE_URL,
});


export const addAdressApi = async (addressData) => {
    console.log('addAdressApi called with data:', addressData);
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await apiClient.post('/address', addressData, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    console.log('addAddressApi response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error adding address:', error);
    throw error;
  }
};

