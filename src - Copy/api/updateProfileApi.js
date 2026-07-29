import { BASE_URL, API_KEY_HEADER, API_KEY_VALUE } from './apiConstant';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Alert from 'react-native';
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    [API_KEY_HEADER]: API_KEY_VALUE,
  },
});

export const updateProfile = async (username, firstname, lastname) => {
  console.log('Updating profile with data:', { username, firstname, lastname });
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('No token found in AsyncStorage');
    }
    const response = await apiClient.put(
      '/user-profile',
      {
        username,
        firstname,
        lastname,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log('log 1:', response);
    return response.data;
  } catch (error) {
    console.log('log 2:', error);
    console.error('Error updating profile:', error);
    // console.log('Profile updated not successfully:', error);
  }
};
