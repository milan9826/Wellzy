import { BASE_URL } from '../apiConstant';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiClient = axios.create({
  baseURL: BASE_URL,
});


export const updateAddressApi = async (addressId, addressData) => {
    console.log('updateAddressApi called with data:', addressData);
    try {
        const token = await AsyncStorage.getItem('token');
        const response = await apiClient.put(`/address/${addressId}`, addressData, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        console.log('updateAddressApi response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating address:', error);
        throw error;
    }
};