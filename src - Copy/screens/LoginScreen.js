import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  StatusBar,
} from 'react-native';
import TextInputWraper from '../component/TextInput';
import ButtonWrapper from '../component/Button';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { login } from '../api/authApi';

import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendOTP } from '../api/sendOTPApi';

const LoginScreen = ({ route }) => {
  const navigation = useNavigation();

  const [usernumber, setUserNumber] = useState();

  const [loading, setLoading] = useState(false);
  const [numberError, setNumberError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [lloginCheck, setLoginCheck] = useState(false);

  useEffect(() => {
    setLoginCheck(true);
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const name = await AsyncStorage.getItem('name');
        setLoginCheck(false);
        navigation.replace('Drawer', {
          screen: 'Tabs',
          params: {
            screen: 'Home',
            params: { name },
          },
        });
      }
    };
    setLoginCheck(false);
    checkToken();
  }, [navigation]);

  

  const handleLogin = async () => {
    const isNumberValid = /^[0-9]{10}$/.test(usernumber);

    if (usernumber === '') {
      setNumberError('Please enter your number');
      return;
    } else if (!isNumberValid) {
      setNumberError('Please enter a valid 10-digit number');
      return;
    } else {
      setNumberError('');

    }

  

  //   try {
  //     setLoading(true);
  //     const name = await AsyncStorage.getItem('name');

  //     const data = {
  //       platform: 1,
  //       email: usernumber,
  //       password: userpassword,
  //     };

  //     await login(data);
  //     await AsyncStorage.setItem('flag', 'true');
  //     setNumberError('');

  //     navigation.replace('Drawer', {
  //       screen: 'Tabs',
  //       params: {
  //         screen: 'Home',
  //         params: { name },
  //       },
  //     });
  //   } catch (error) {
  //     console.error('Error during login:', error);
  //     setNumberError('Invalid number or password');
  //     // setPasswordError('Invalid email or password');
  //   } finally {
  


  //   }
    //   }

  //     setLoading(false);
  
      

    try {
      setLoading(true);
      const data = {
        mobile_number: usernumber,
        country_code: '+91',
        otp_type: 'LOGIN',
      };
       await sendOTP(data);
      setNumberError('');
      navigation.navigate('OTPVerification', { usernumber: usernumber });
    } catch (error) {
      console.error('Error sending OTP:', error);
      setNumberError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }}

  return (
    <View style={{ flex: 1 ,transparent: true}}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={'padding'}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {lloginCheck ? (
            <View style={styles.container}>
              <ActivityIndicator size="large" color="#141618" />
            </View>
          ) : (
            <View style={styles.container}>
              <View style={styles.formContainer}>
                <Text style={styles.welcomeText}>Welcome to App</Text>

                {/* <Text style={styles.title}>Login</Text> */}

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Number</Text>
                  <TextInputWraper
                    placeholder="Enter number Here.."
                    style={styles.input}
                    value={usernumber}
                    onChangeText={setUserNumber}
                    error={numberError}
                    keytype={'next'}
                    keyboardType="numeric"
                  />
                </View>

                <ButtonWrapper
                  title="Send OTP"
                  onPress={handleLogin}
                  style={[styles.button, loading && styles.buttonDisabled]}
                  disabled={loading}
                />

                {/* <ButtonWrapper
                  title="Register"
                  onPress={() => navigation.navigate('Register')}
                  style={styles.button}
                /> */}
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal transparent animationType="fade" visible={loading}>
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#141618" />
            <Text style={styles.loadingText}>Logging in...</Text>
          </View>
        </View>
      </Modal>


{/*  */}
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  formContainer: {
    width: '80%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 4,
  },
  label: {
    fontSize: 18,
    marginBottom: 6,
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
  buttonDisabled: {
    opacity: 0.5,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 60,
    textAlign: 'center',
  },
  loadingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  loadingText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },
});
export default LoginScreen;
