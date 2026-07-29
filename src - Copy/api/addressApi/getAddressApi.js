import { BASE_URL } from '../apiConstant';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiClient = axios.create({
  baseURL: BASE_URL,
});


export const getAddressApi = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await apiClient.get('/address', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    console.log('getAddressApi response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching addresses:', error);
    throw error;
  } 
};