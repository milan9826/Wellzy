import axios from 'axios';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { BASE_URL, API_KEY_HEADER, API_KEY_VALUE } from './apiConstant';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    [API_KEY_HEADER]: API_KEY_VALUE,
  },
});

export const signUp = async data => {
  console.log('Sign Up Data:', data);
  const response = await apiClient.post('/auth/signup', data);
  // console.log("Sign Up Response:", response.data);
  if (!response.data.success) {
    Alert.alert(response.data.message || 'Sign up failed');
    throw new Error(response.data.message || 'Sign up failed');
  } else {
    Alert.alert('Sign up successful');
  }

  return response.data;
};

export const login = async data => {
   console.log("Login Data:", data);
  const response = await apiClient.post('/auth/login', data);

  console.log("Login Response:", response.data);
  if (!response.data.success) {
    Alert.alert(response.data.message || 'Login failed');
  } else {
    Alert.alert('Login successful');
  }

  const token = response.data.token;
  if (token) {
    await AsyncStorage.setItem('token', token);
  } else {
    //console.warn("No token received from login response.");
  }

  return response.data;
};

export const logout = async () => {
  try {
    const token = await AsyncStorage.getItem('token');

    const response = await apiClient.post(
      '/logout',
      {},
      {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
              token,
            }
          : {},
      },
    );
    //console.log("Logout Response:", response.data);
    if (!response.data.success) {
      Alert.alert(response.data.message || 'Logout failed');
      throw new Error(response.data.message || 'Logout failed');
    }
    await AsyncStorage.removeItem('token');
    return response.data;
  } catch (error) {
    // console.error("Error during logout:", error);
    throw error;
  }
};

export default signUp;
