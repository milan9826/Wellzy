import { BASE_URL, API_KEY_HEADER, API_KEY_VALUE } from './apiConstant';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const apiClient = axios.create({
  baseURL: BASE_URL, 
});

export const getProfile = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('No token found in AsyncStorage');
    }
    const response = await apiClient.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const profileData = response.data.user;
      console.log('Profile data fetched successfully:', response.data);

    return profileData;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};
