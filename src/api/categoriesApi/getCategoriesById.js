import axios from 'axios';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { BASE_URL, API_KEY_HEADER, API_KEY_VALUE } from '../apiConstant';

const apiClient = axios.create({
  baseURL: BASE_URL,
  
});

export const getCategoriesById = async (categoryId) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await apiClient.get(`/category/${categoryId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching category by ID:', error);
    Alert.alert('Error', 'Failed to fetch category. Please try again.');
    throw error;
  }
};
