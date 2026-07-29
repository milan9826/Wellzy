import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Modal,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TextInputWraper from '../component/TextInput';
import ButtonWrapper from '../component/Button';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import signUp from '../api/authApi';
import RadioGroup from 'react-native-radio-buttons-group';
import { useMemo } from 'react';
import { registerUser } from '../api/registerUserApi';


const RegisterScreen = ({ route }) => {
  const [firstname, SetFirstName] = useState('');
  const [lastname, SetLastName] = useState('');
  const [email, SetEmail] = useState('');
  const [number, SetNumber] = useState('');

  const navigation = useNavigation();
  const options = useMemo(() => [
    { id: '1', label: 'Male' },
    { id: '2', label: 'Female' },
    { id: '3', label: 'Other' },
  ], []);
  // const [loading, setLoading] = useState(false);
  const [firstnameError, setFirstNameError] = useState('');
  const [lastnameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  const [gender, setGender] = useState(['Male', 'Female', 'Other']);
  const [weight, SetWeight] = useState('');
  const [age, SetAge] = useState('');
  const [loading, setLoading] = useState(false);
  const [weightError, setWeightError] = useState('');
  const [ageError, setAgeError] = useState('');
  const [numberError, setNumberError] = useState('');

  const countryCode = '+91';
  const token = route.params?.response?.token || '';





  const handleRegister = async () => {
    // Validate name
    // if (name === '') {
    //   setNameError('Please enter your name');
    //   return;
    // } else if (!/^[a-zA-Z0-9_]{3,}$/.test(name)) {
    //   setNameError(
    //     'Name must be at least 3 characters long and can only contain letters, numbers, and underscores',
    //   );
    //   return;
    // } else {
    //   setNameError('');
    // }

    // // Validate email
    // if (email === '') {
    //   setEmailError('Please enter your email');
    //   return;
    // } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    //   setEmailError('Please enter a valid email address');
    //   return;
    // } else {
    //   setEmailError('');
    // }

    // // Validate password
    // const isPasswordValid =
    //   /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(password);
    // const isConfirmPasswordValid =
    //   /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(confirmPassword);

    // if (password === '') {
    //   setPasswordError('Please enter your password');
    //   setConfirmPasswordError('Please enter confirm your password');
    //   return;
    // } else if (!isPasswordValid) {
    //   setPasswordError(
    //     'Password must contain at least one uppercase letter and one special character and be between 8 to 20 characters long',
    //   );
    //   setConfirmPasswordError('');
    //   return;
    // } else {
    //   setPasswordError('');
    // }

    // if (confirmPassword === '') {
    //   setConfirmPasswordError('Please enter confirm your password');
    //   return;
    // } else if (!isConfirmPasswordValid) {
    //   setConfirmPasswordError(
    //     'Confirm Password must contain at least one uppercase letter and one special character and be between 8 to 20 characters long',
    //   );
    //   return;
    // } else if (password !== confirmPassword) {
    //   setPasswordError('Passwords do not match');
    //   setConfirmPasswordError('Passwords do not match');
    //   return;
    // } else {
    //   setConfirmPasswordError('');
    // }

    // const data = {
    //   platform: 1,
    //   username: name,
    //   email,
    //   password,
    // };

    // try {
    //   setLoading(true);
    //   await signUp(data);
    //   await AsyncStorage.setItem('name', name);
    //   await AsyncStorage.setItem('email', email);
    //   await AsyncStorage.setItem('password', password);
    //   navigation.replace('Login', { name, email, password });
    //   SetName('');
    //   SetEmail('');
    //   SetPassword('');
    //   SetConfirmPassword('');
    // } catch (error) {
    //   console.log('Error during registration:', error);
    // } finally {
    //   setLoading(false);
    // }



    const isValid = true;

    if (firstname === '') {
      setFirstNameError('Please enter your first name');
      isValid = false;
    } else {
      setFirstNameError('');
    }

    if (lastname === '') {
      setLastNameError('Please enter your last name');
      isValid = false;
    } else {
      setLastNameError('');
    }

    if (number === '') {
      setNumberError('Please enter your number');
      isValid = false;
    } else if (!/^[0-9]{10}$/.test(number)) {
      setNumberError('Please enter a valid 10-digit number');
      isValid = false;
    } else {
      setNumberError('');
    }

    if (weight === '') {
      setWeightError('Please enter your body weight');
      isValid = false;
    } else if (!/^[0-9]+$/.test(weight)) {
      setWeightError('Please enter a valid body weight');
      isValid = false;
    } else {
      setWeightError('');
    }

    if (age === '') {
      setAgeError('Please enter your age');
      isValid = false;
    } else if (!/^[0-9]+$/.test(age)) {
      setAgeError('Please enter a valid age');
      isValid = false;
    } else {
      setAgeError('');
    }

     const regData = {
      "role": "Customer",
      "mobile_number": number,
      "country_code": "+91",
      "gender": gender,
      "age": age,
      "body_weight": weight,
      "first_name": firstname,
      "last_name": lastname,
      "email": email
    }
    if (isValid) {
      const response=await registerUser(regData);
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

   






  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Register</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>FirstName</Text>
              <TextInputWraper
                placeholder="Enter First Name here..."
                style={styles.input}
                value={firstname}
                onChangeText={SetFirstName}
                error={firstnameError}
              />
            </View>


            <View style={styles.inputGroup}>
              <Text style={styles.label}>Last Name</Text>
              <TextInputWraper
                placeholder="Enter Last Name here..."
                style={styles.input}
                value={lastname}
                onChangeText={SetLastName}
                error={lastnameError}
              />
            </View>



            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInputWraper
                placeholder="Enter Email Here...."
                style={styles.input}
                value={email}
                onChangeText={SetEmail}
              />
            </View>


            <View style={styles.inputGroup}>
              <Text style={styles.label}>Number</Text>
              <Text style={styles.country}>+91</Text>
              <TextInputWraper
                placeholder="Enter Number Here...."
                style={styles.numInput}
                value={number}
                onChangeText={SetNumber}
                keyboardType="numeric"
                error={numberError}
              />
            </View>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Body Weight</Text>
              <TextInputWraper
                placeholder="Enter Body Weight here..."
                style={styles.input}
                value={weight}
                onChangeText={SetWeight}
                error={weightError}
                keyboardType="numeric"
              />

            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Age</Text>
              <TextInputWraper
                placeholder="Enter Age here..."
                style={styles.input}
                value={age}
                onChangeText={SetAge}
                error={ageError}
                keyboardType="numeric"
              />



            </View>


            <View style={styles.inputGroup}>

              <Text style={styles.label}>Gender</Text>
              <RadioGroup
                radioButtons={options}
                onPress={setGender}
                selectedId={gender}
                layout="row"
              />
            </View>




            <ButtonWrapper
              title="Register"
              onPress={handleRegister}
              style={[styles.button, loading && styles.buttonDisabled]}
              disabled={loading}
            />

          </View>
        </ScrollView>
      </SafeAreaView>

      <Modal transparent animationType="fade" visible={loading}>
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#141618" />
            <Text style={styles.loadingText}>Please wait...</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    transparent: true,
  },
  scrollContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  formContainer: {
    width: '80%',
  },
  inputGroup: {
    marginBottom: 4,
  },
  label: {
    fontSize: 18,
    marginBottom: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#151212',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
  },
  numInput: {
    borderWidth: 1,
    borderColor: '#151212',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    width: '90%',
    marginLeft: 40, // Adjust this value to position the input field correctly
  },
  button: {
    marginVertical: 10,
    backgroundColor: '#141618',
  },
  buttonDisabled: {
    opacity: 0.5,
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
  country: {
    position: 'absolute',
    top: 40,
    fontSize: 16,
    fontWeight: '800',
    color: '#151212',
  },
});

export default RegisterScreen;
