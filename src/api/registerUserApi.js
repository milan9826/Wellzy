

import axios from 'axios';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { BASE_URL, API_KEY_HEADER, API_KEY_VALUE } from './apiConstant';

const apiClient = axios.create({
  baseURL: BASE_URL,
  
});


export const registerUser = async (data) => {
  try {
    console.log('Registering user with data:', data);
    const response = await apiClient.post('/auth/register', data);
    console.log('User registered successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error registering user:', error);
    Alert.alert('Error', 'Failed to register user. Please try again.');
    throw error;
  }
}