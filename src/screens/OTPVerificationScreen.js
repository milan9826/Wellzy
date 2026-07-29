import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import TextInputWraper from '../component/TextInput';
import ButtonWrapper from '../component/Button';
import { verifyOTP } from '../api/sendOTPApi';
import AsyncStorage from '@react-native-async-storage/async-storage';




const OTPVerificationScreen = ({ route, navigation }) => {
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');


  const options = [
  { id: '1', label: 'Male' },
  { id: '2', label: 'Female' },
  { id: '3', label: 'Other' },
];

    const handleVerifyOTP = async  () => {
            const isNumberValid = /^[0-9]{6}$/.test(otp);

    if (otp === '') {
      setOtpError('Please enter your OTP');
      return;
    }
    else if (!isNumberValid) {
        setOtpError('Please enter a valid 6-digit OTP');
        return;
    }
    else {
      setOtpError('');
    }

    try {
      const data = {
        mobile_number:route.params.usernumber, 
        otp_code: otp,
      };
      const response=await verifyOTP(data);

      
      if(response.needs_registration) {
        navigation.navigate('Register', {  response });
      }else {
        await AsyncStorage.setItem('token', response.token);
        await AsyncStorage.setItem('name', response.user.name);
        await AsyncStorage.setItem('user', JSON.stringify(response.user));

        navigation.navigate('Drawer', {
          screen: 'Tabs',
          params: {
            screen: 'Home',
            
          },
        });
      }

        } catch (error) {
      console.error('Error verifying OTP:', error);
      setOtpError('Failed to verify OTP. Please try again.');
    }
}



return (
    <View style={styles.container}>
      <Text style={styles.title}>OTP Verification</Text>
      <Text style={styles.subtitle}>Enter the OTP sent to your number</Text>
  <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.inputGroup}>
                      <Text style={styles.label}>OTP</Text>
      <TextInputWraper 
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        error={otpError}
        keyboardType="numeric"
        style={styles.input}
      />
      </View>


      

      <ButtonWrapper
        title="Verify OTP"
        style={styles.button}
        onPress={handleVerifyOTP}
      />
        

    
      </View>
)
}
const styles=StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    transparent: true,
    },
    title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    },
    subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    },
     input: {
    borderWidth: 1,
    borderColor: '#151212',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
  },
  button: {
    marginVertical: 10,
    backgroundColor: '#141618',
  },
   inputGroup: {
    marginBottom: 4,
    width: '90%',
  },
  label: {
    fontSize: 18,
    marginBottom: 6,
  },

})

export default OTPVerificationScreen;
