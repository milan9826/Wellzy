

import axios from 'axios';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { BASE_URL, API_KEY_HEADER, API_KEY_VALUE } from './apiConstant';

const apiClient = axios.create({
  baseURL: BASE_URL,
  
});


export const sendOTP = async (data) => {
  try {
    console.log('Sending OTP with data:', data);
    const response = await apiClient.post('/auth/request-otp', data);
    console.log('OTP sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending OTP:', error);
    Alert.alert('Error', 'Failed to send OTP. Please try again.');
    throw error;
};

};



export const verifyOTP = async (data) => {
  try {
    console.log('Verifying OTP with data:', data);
    const response = await apiClient.post('auth/verify-otp', data);

    console.log('OTP verified successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    Alert.alert('Error', 'Failed to verify OTP. Please try again.');
    throw error;
  } 
}