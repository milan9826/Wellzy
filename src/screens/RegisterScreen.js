import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Modal,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TextInputWraper from '../component/TextInput';
import ButtonWrapper from '../component/Button';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerUser } from '../api/registerUserApi';
import { theme } from '../theme';

const GENDER_OPTIONS = ['Male', 'Female', 'Other'];

const RegisterScreen = ({ route }) => {
  const user=route.params?.response?.user || {};
  const [firstname, SetFirstName] = useState('');
  const [lastname, SetLastName] = useState('');
  // const [email, SetEmail] = useState('');
  // const [number, SetNumber] = useState('');
  const [gender, setGender] = useState('Male');
  const [weight, SetWeight] = useState('');
  const [age, SetAge] = useState('');

  const [loading, setLoading] = useState(false);

  const [firstnameError, setFirstNameError] = useState('');
  const [lastnameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  // const [numberError, setNumberError] = useState(user?.mobile_number );
  const [weightError, setWeightError] = useState('');
  const [ageError, setAgeError] = useState('');

  const navigation = useNavigation();

  const number=user?.mobile_number || route.params?.response?.mobile_number || '';
  console.log('User number:', number);

  const handleRegister = async () => {
    let isValid = true;

    if (firstname.trim() === '') {
      setFirstNameError('Please enter your first name');
      isValid = false;
    } else {
      setFirstNameError('');
    }

    if (lastname.trim() === '') {
      setLastNameError('Please enter your last name');
      isValid = false;
    } else {
      setLastNameError('');
    }

    // if (number.trim() === '') {
    //   setNumberError('Please enter your number');
    //   isValid = false;
    // } else if (!/^[0-9]{10}$/.test(number.trim())) {
    //   setNumberError('Please enter a valid 10-digit number');
    //   isValid = false;
    // } else {
    //   setNumberError('');
    // }

    // if (email.trim() === '') {
    //   setEmailError('Please enter your email');
    //   isValid = false;
    // } else if (
    //   !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email.trim())
    // ) {
    //   setEmailError('Please enter a valid email address');
    //   isValid = false;
    // } else {
    //   setEmailError('');
    // }

    if (weight.trim() === '') {
      setWeightError('Please enter your body weight');
      isValid = false;
    } else if (!/^[0-9]+$/.test(weight.trim())) {
      setWeightError('Please enter a valid body weight');
      isValid = false;
    } else {
      setWeightError('');
    }

    if (age.trim() === '') {
      setAgeError('Please enter your age');
      isValid = false;
    } else if (!/^[0-9]+$/.test(age.trim())) {
      setAgeError('Please enter a valid age');
      isValid = false;
    } else {
      setAgeError('');
    }

    if (!isValid) return;

    const regData = {
      role: 'Customer',
      mobile_number: number ,
      country_code: '+91',
      gender: gender,
      age: age,
      body_weight: weight,
      first_name: firstname,
      last_name: lastname,
    };

    try {
      setLoading(true);
      const response = await registerUser(regData);
      if (response) {
        if (response.token) {
          await AsyncStorage.setItem('token', response.token);
        }
        if (response.user) {
          await AsyncStorage.setItem('name', response.user.name || firstname);
          await AsyncStorage.setItem('user', JSON.stringify(response.user));
        }
        navigation.navigate('Drawer', {
          screen: 'Tabs',
          params: {
            screen: 'Home',
          },
        });
      }
    } catch (error) {
      console.log('Error during registration:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Tell us about yourself</Text>
            <Text style={styles.subtitle}>
              Please provide your details to continue
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.genderContainer}>
                {GENDER_OPTIONS.map(item => {
                  const isSelected = gender === item;
                  return (
                    <TouchableOpacity
                      key={item}
                      style={[
                        styles.genderOption,
                        isSelected
                          ? styles.genderOptionSelected
                          : styles.genderOptionUnselected,
                      ]}
                      onPress={() => setGender(item)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.genderText,
                          isSelected
                            ? styles.genderTextSelected
                            : styles.genderTextUnselected,
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

             <View style={styles.inputGroup}>
              <Text style={styles.label}>First Name</Text>
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
              <Text style={styles.label}>Body Weight (kg)</Text>
              <TextInputWraper
                placeholder="Enter Body Weight here..."
                style={styles.input}
                value={weight}
                onChangeText={SetWeight}
                error={weightError}
                keyboardType="numeric"
              />
            </View>

            {/* <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInputWraper
                placeholder="Enter Email Here...."
                style={styles.input}
                value={email}
                onChangeText={SetEmail}
                error={emailError}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View> */}
{/* 
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Number</Text>
              <View style={styles.numberInputWrapper}>
                <Text style={styles.countryCode}>+91</Text>
                <TextInputWraper
                  placeholder="Enter Number Here...."
                  style={styles.numInput}
                  value={number}
                  onChangeText={SetNumber}
                  keyboardType="numeric"
                  maxLength={10}
                  error={numberError}
                  containerStyle={{ flex: 1 }}
                />
              </View>
            </View> */}

            <ButtonWrapper
              title="Continue"
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
            <ActivityIndicator size="large" color={theme.colors.button} />
            <Text style={styles.loadingText}>Please wait...</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 40,
  },
  headerContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.label || '#6B7280',
  },
  formContainer: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  genderOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderOptionSelected: {
    backgroundColor: theme.colors.button,
    borderWidth: 0,
    shadowColor: theme.colors.button,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  genderOptionUnselected: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  genderText: {
    fontSize: 15,
    fontWeight: '600',
  },
  genderTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  genderTextUnselected: {
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 15,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
  },
  numberInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingLeft: 14,
  },
  countryCode: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginRight: 4,
  },
  numInput: {
    paddingHorizontal: 8,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1F2937',
    borderRadius: 12,
  },
  button: {
    marginTop: 16,
    marginVertical: 10,
    backgroundColor: theme.colors.button,
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.button,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
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

export default RegisterScreen;
