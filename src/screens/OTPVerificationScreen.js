import React, { useState ,useEffect,useRef} from 'react';
import { View, Text, StyleSheet, StatusBar, Pressable } from 'react-native';
import TextInputWraper from '../component/TextInput';
import ButtonWrapper from '../component/Button';
import { verifyOTP,sendOTP } from '../api/sendOTPApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../theme';

const OTPVerificationScreen = ({ route, navigation }) => {
  const [otp, setOtp] = useState(['', '', '', '','','' ]);
  // const [otp, setOtp] = useState('');
  // const [otpError, setOtpError] = useState('');
  const usernumber = route.params.usernumber;
  const [timer, setTimer] = useState(30);

  const inputRefs = useRef([]);

  const options = [
  { id: '1', label: 'Male' },
  { id: '2', label: 'Female' },
  { id: '3', label: 'Other' },
];

const handleInputChange = (index,text) => {
  console.log('Input changed at index:', index, 'New value:', text);
  const newOtp = [...otp];
  const digit = text.replace(/\D/g, '').slice(-1);
  newOtp[index] = digit;
  const nextIndex = index + 1;
  if (digit && nextIndex < newOtp.length) {
    inputRefs.current[nextIndex]?.focus();
  }
  setOtp(newOtp);
}
 const handleVerifyOTP = async  () => {
            const isNumberValid = /^[0-9]{6}$/.test(otp);

    // if (otp === '') {
    //   setOtpError('Please enter your OTP');
    //   return;
    // }
    // else if (!isNumberValid) {
    //     setOtpError('Please enter a valid 6-digit OTP');
    //     return;
    // }
    // else {
    //   setOtpError('');
    // }

    try {
      const data = {
        mobile_number:route.params.usernumber, 
        otp_code: otp.join(''),
      };
      console.log('Data sent for OTP verification:', data);
      const response=await verifyOTP(data);

      
      if(response.needs_registration) {
        navigation.navigate('Register', {  response });
      }else {
        await AsyncStorage.setItem('token', response.token);
        await AsyncStorage.setItem('name', response.user.name);
        await AsyncStorage.setItem('user', JSON.stringify(response.user));

        navigation.replace('Drawer', {
          screen: 'Tabs',
          params: {
            screen: 'Home',
            
          },
        });
      } 

        } catch (error) {
      console.error('Error verifying OTP:', error);
      // setOtpError('Failed to verify OTP. Please try again.');
    }
}

useEffect(() => {
  const time = setTimeout(() => {

    setTimer((prevTimer) => {
      if (prevTimer > 0) {
        return prevTimer - 1;
      } else {
        clearTimeout(time);
        return 0;
      } 
    });
  }, 1000);

  return () => clearTimeout(timer);
}, [timer]);


const handleResendOtp = async () => {
  try {
    const data = {
      mobile_number: usernumber,
      country_code: '+91',
      otp_type: 'LOGIN',
    };
    await sendOTP(data);
    setTimer(30);
  } catch (error) {
    console.error('Error resending OTP:', error);
    setOtpError('Failed to resend OTP. Please try again.');
  }
}

return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>
      <Text style={styles.subtitle}>Enter the 4-digit code sent to {usernumber}</Text>
  <StatusBar barStyle="dark-content" backgroundColor="#fff" />

  <View style={styles.inputGroup}>
  {otp.map((digit, index) => (
    <TextInputWraper
      key={index}
      value={digit}
      onChangeText={text => handleInputChange(index,text)}
      
      onKeyPress={({ nativeEvent }) => {
        if (
          nativeEvent.key === 'Backspace' &&
          !digit &&
          index > 0
        ) {
          inputRefs.current[index - 1]?.focus();
        }
      }}
      ref={(ref) => {
        inputRefs.current[index] = ref;
      }}
      maxLength={1}
      style={styles.input}
      containerStyle={{ width: 'auto' }}
      keyboardType="numeric"
    />
  ))}
   
  </View>

  <ButtonWrapper
    title="Verify OTP"
    style={styles.button}
    onPress={handleVerifyOTP}
  />
{timer > 0 ? (
    <View style={{ alignItems: 'center',flexDirection: 'row', justifyContent: 'center' }}>

  <Text style={styles.timer}>Didn't receive the code? </Text>
  <Text style={styles.resendText}>{timer} seconds remaining</Text>
  </View>
) : (
  <View style={{  alignItems: 'center',flexDirection: 'row', justifyContent: 'center' }}>
      <Text style={styles.timer}>Didn't receive the code? </Text>
      <Pressable onPress={handleResendOtp}>
        <Text style={styles.resendText}>Resend OTP</Text>
      </Pressable>

  </View>
)}

<ButtonWrapper title="Change Number" style={[styles.button, { backgroundColor: "#FFFFFF", borderColor: theme.colors.danger, borderWidth: 1,marginTop:30 }]} textStyle={{color:theme.colors.button,fontWeight:600,fontSize:18}} onPress={() => navigation.replace('Login')} />

    </View>
)
}
const styles=StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
    padding: 16,
    transparent: true,
    },
    title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
    },
    subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    },
     input: {
      height: 60,
      width: 60,
      borderWidth: 1.5,
      borderColor: '#ccc',
      borderRadius: 10,
      textAlign: 'center',
      fontSize: 22,
      fontWeight: 'bold',
      color: '#000',
      backgroundColor: '#fff',
      paddingHorizontal: 2,
  },
  button: {
    marginVertical: 10,
    backgroundColor: theme.colors.button,
  },
   inputGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  timer: {
    fontSize: 16,
    color: '#666',
    marginTop: 26,
    alignSelf: 'center',
  },

resendText: {
  color: theme.colors.button,
  marginLeft: 4,
  marginTop: 24,
  fontSize: 16,
  fontWeight: '600',
},
   
  label: {
    fontSize: 18,
    marginBottom: 6,
  },

})

export default OTPVerificationScreen;
