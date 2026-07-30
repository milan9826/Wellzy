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
import { theme } from '../theme';
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
      navigation.replace('OTPVerification', { usernumber: usernumber });
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
              <View style={styles.logo}>  
                {/* <Ionicons 
                  name="add-circle-outline"
                  size={28}
                  color="#141618"
                 
                /> */}

                <Text style={{ fontSize: 28, fontWeight: 'bold', color: theme.colors.danger }}>Wellzy</Text>
                <Text style={{ fontSize: 16, color: theme.colors.logoText }}>YOUR FAMILY WELLNESS SPACE</Text>
              </View>
              <View style={styles.formContainer}>
                  <View style={{ alignItems: 'center', marginBottom: 40 }}>
                <Text style={styles.welcomeText}>Welcome</Text>
                <Text style={{ fontSize: 16,  textAlign: 'center' }}>Enter your mobile number to continue</Text>
</View>
                {/* <Text style={styles.title}>Login</Text> */}

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>MOBILE NUMBER</Text>
                  <View style={styles.countryCodeContainer}>
                    <View style={styles.ccontainer}>
                    <Text style={styles.flag} >IN</Text>
                    <Text style={styles.countryCode}>+91</Text>
                    </View>
                    <TextInputWraper
                    placeholder="Enter number Here.."
                    style={styles.input}
                    value={usernumber}
                    onChangeText={setUserNumber}
    
                    keytype={'next'}
                    keyboardType="numeric"
                  />
                  </View>
                  <Text style={{ color: theme.colors.error, fontSize: 12, marginTop: 4 }}>{numberError}</Text>
                  
                  <Text style={{ color: theme.colors.danger, fontSize: 12, marginTop: 4 }}>• We'll send you an OTP to verify</Text>

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
  countryCodeContainer: {
    flexDirection: 'row',
  alignItems: 'center',
  borderWidth: 1,
  borderColor: theme.colors.border,
  borderRadius: 12,
  height: 56,
  paddingHorizontal: 12,
  backgroundColor: '#fff',
  },
  ccontainer: {
    flexDirection: 'row',
  alignItems: 'center',
  paddingRight: 10,
  borderRightWidth: 1,
  borderRightColor: theme.colors.border,
  },
  flag: {
  fontSize: 18,
  marginRight: 6,
},

code: {
  fontSize: 16,
  fontWeight: '600',
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
    fontSize: 14,
    marginBottom: 6,
    color: theme.colors.label,
  },
  input: {
   flex: 1,
  marginLeft: 12,
  fontSize: 16,

  },
  button: {
    marginVertical: 10,
    backgroundColor: theme.colors.button,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  logo: {
    marginBottom: 20,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
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
