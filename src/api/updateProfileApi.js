import { BASE_URL,} from './apiConstant';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const apiClient = axios.create({
  baseURL: BASE_URL,
 
});

export const updateProfile = async (data) => {
  console.log('Update Profile Data:', data);
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('No token found in AsyncStorage');
    }
  
    const response = await apiClient.put('/auth/profile', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
        console.log('Profile updated successfully:', response.data);

    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};