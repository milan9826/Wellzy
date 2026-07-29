import { BASE_URL, API_KEY_HEADER, API_KEY_VALUE } from './apiConstant';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    [API_KEY_HEADER]: API_KEY_VALUE,
  },
});

export const updateImage = async profileImage => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('Token not found');
    }

    const formData = new FormData();
    formData.append('image', {
      uri: profileImage,
      type: 'image/jpeg',
      name: 'profile.jpg',
    });

    const response = await apiClient.put(
      '/user-profile/profile-picture',
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    const updatedImageData = response.data;
    //  console.log('Profile image :', response.data);
    return updatedImageData;
  } catch (error) {
    //console.error('Error updating profile image:', error);
    throw error;
  }
};
