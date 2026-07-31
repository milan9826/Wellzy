

import axios from 'axios';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { BASE_URL, API_KEY_HEADER, API_KEY_VALUE } from '../apiConstant';

const apiClient = axios.create({
  baseURL: BASE_URL,
  
});
export const getAllCategories = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await apiClient.get('/category', {
              headers: token ? { Authorization: `Bearer ${token}` } : {},

    });
    console.log('Fetched categories:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    Alert.alert('Error', 'Failed to fetch categories. Please try again.');
    throw error;
  }
}
