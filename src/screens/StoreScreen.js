import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Modal,
  Image,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import Header from '../component/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import ButtonWrapper from '../component/Button';
import TextInputWraper from '../component/TextInput';
import { getProfile } from '../api/getProfile';
import { updateProfile } from '../api/updateProfileApi';
import Ionicons from '@react-native-vector-icons/ionicons';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { updateImage } from '../api/updateImageApi';
import { IMAGE_BASE_URL } from '../api/apiConstant';
import AsyncStorage from '@react-native-async-storage/async-storage';


const StoreScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [isNewImage, setIsNewImage] = useState(false);
  const [camModalVisible, setCamModalVisible] = useState(false);
  const [user,setUser] = useState({});


  const [usernameError, setUsernameError] = useState('');
  const [firstnameError, setFirstNameError] = useState('');
  const [lastnameError, setLastNameError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [edit, setEdit] = useState(false);

  const validateInputs = () => {
    let isValid = true;

    if (!username.trim()) {
      setUsernameError('Username is required');
      isValid = false;
    } else {
      setUsernameError('');
    }

    if (!firstname.trim()) {
      setFirstNameError('First name is required');
      isValid = false;
    } else if (!/^[A-Za-z]+$/.test(firstname)) {
      setFirstNameError('First name should contain only letters');
      isValid = false;
    } else {
      setFirstNameError('');
    }

    if (!lastname.trim()) {
      setLastNameError('Last name is required');
      isValid = false;
    } else if (!/^[A-Za-z]+$/.test(lastname)) {
      setLastNameError('Last name should contain only letters');
      isValid = false;
    } else {
      setLastNameError('');
    }

    return isValid;
  };

  const handleCamAndImagePicker = () => {
    setCamModalVisible(true);
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const raw = await AsyncStorage.getItem('user');
        if (raw) {
          setUser(JSON.parse(raw));
        }
      } catch (e) {
        console.warn('Failed to load user from storage', e);
      }
    };
    loadUser();
  }, []);


  const handleImagePicker = async picker => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };
    try {
      const result = await picker(options);
      if (!result || result.didCancel) return;
      if (result.errorCode) {
        console.warn(
          'ImagePicker error: ',
          result.errorMessage || result.errorCode,
        );
        return;
      }
      if (result.assets && result.assets[0]?.uri) {
        setProfileImage(result.assets[0].uri);
        setIsNewImage(true);
      }
    } catch (e) {
      console.warn('ImagePicker exception', e);
    }
  };

  const handleTakePhoto = () => {
    setCamModalVisible(false);
    handleImagePicker(launchCamera);
  };

  const handleChooseFromLibrary = () => {
    setCamModalVisible(false);
    handleImagePicker(launchImageLibrary);
  };

 

  const fetchProfile = async () => {
    try {
      setInitialLoading(true);
      const profileData = await getProfile();
      if (profileData) {
        setName(profileData.username || '');
        setUsername(profileData.username || '');
        setFirstName(profileData.firstname || '');
        setLastName(profileData.lastname || '');
        if (profileData.image) {
          const imgUrl = profileData.image.startsWith('http')
            ? profileData.image
            : IMAGE_BASE_URL + profileData.image;
          setProfileImage(imgUrl);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async () => {
    if (!validateInputs()) {
      return;
    }
    try {
      setLoading(true);
      const response = await updateProfile(username, firstname, lastname);
      if (isNewImage && profileImage) {
        await updateImage(profileImage);
        setIsNewImage(false);
      }
      setName(username);
      alert(response?.message || 'Profile updated successfully!');
      setEdit(false);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Something went wrong';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const parent = navigation.getParent()?.getState?.()?.type;
  const isInDrawer = parent === 'drawer';


  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <SafeAreaView style={{ flex: 1 }}>
        {isInDrawer ? (
          <Header
            title="Store"
            navigation={navigation}
             icon="arrow-back"
             lefticon={() => navigation.goBack()}
          />
        ) : (
          <Header
            title="Store"
            navigation={navigation}
            icon="arrow-back"
            lefticon={() => navigation.goBack()}
          />
        )}
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 16,
            }}
          >
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            {initialLoading ? (
              <ActivityIndicator size="large" color="#141618" />
            ) : edit ? (
              /* --- EDIT MODE --- */
              <View style={{ width: '100%', alignItems: 'center' }}>
                <View style={styles.profileWrapper}>
                  {profileImage ? (
                    <Image source={{ uri: profileImage }} style={styles.profile} />
                  ) : (
                    <View style={styles.profile}>
                      <Text style={styles.initialText}>{user.name[0]}</Text>
                    </View>
                  )}
                  <TouchableOpacity
                    style={styles.pencilButton}
                    onPress={handleCamAndImagePicker}
                  >
                    <Ionicons name="pencil" size={22} color="#fff" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.profileTitle}>{name}</Text>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Username</Text>
                  <TextInputWraper
                    placeholder="Enter Username Here ...."
                    value={username}
                    onChangeText={setUsername}
                    style={styles.input}
                    error={usernameError}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>First Name</Text>
                  <TextInputWraper
                    placeholder="Enter First Name Here ...."
                    value={firstname}
                    onChangeText={setFirstName}
                    style={styles.input}
                    error={firstnameError}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Last Name</Text>
                  <TextInputWraper
                    placeholder="Enter Last Name Here ...."
                    value={lastname}
                    onChangeText={setLastName}
                    style={styles.input}
                    error={lastnameError}
                  />
                </View>

                {loading ? (
                  <ActivityIndicator size="large" color="#141618" />
                ) : (
                  <View style={{ width: '80%', gap: 10 }}>
                    <ButtonWrapper
                      title="Update Profile"
                      onPress={handleUpdateProfile}
                    />
                    <TouchableOpacity
                      style={styles.cancelBtn}
                      onPress={() => {
                        setEdit(false);
                        setUsernameError('');
                        setFirstNameError('');
                        setLastNameError('');
                      }}
                    >
                      <Text style={styles.cancelBtnText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ) : (
              /* --- VIEW MODE --- */

              <View style={{ width: '100%', alignItems: 'center',marginTop: 20 }}>
                
                <View style={styles.profileWrapper}>
                  {profileImage ? (
                    <Image source={{ uri: profileImage }} style={styles.profile} />
                  ) : (
                    <View style={styles.profile}>
                      <Text style={styles.initialText}>{user.first_name ? user.first_name[0] : 'U'}</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.profileTitle}>
                  {user.email || 'User Profile'}
                </Text>
                   <TouchableOpacity
                    style={[styles.pencilButton, { top: 10, right:130  }]}
                    onPress={() => setEdit(true)}
                  >
                    <Ionicons name="pencil" size={22} color="#fff" />
                  </TouchableOpacity>
                <View style={styles.detailCard}>
                
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>First Name:</Text>
                    <Text style={styles.detailValue}>{user.first_name || 'N/A'}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Last Name:</Text>
                    <Text style={styles.detailValue}>{user.last_name || 'N/A'}</Text>
                  </View>


                </View>

                <View  style={{ width: '80%', marginTop: 20, gap: 10,flexDirection: 'row', alignSelf:"center",backgroundColor: '#F9FAFB', padding: 16, borderRadius: 12 }}>
                  <Ionicons name="cart-outline" size={30} color="#b3b7be" style={{ marginTop:10 }} />
                  <TouchableOpacity onPress={() => navigation.navigate('YourOrder')}>
                    <Text style={{ fontSize: 20, fontWeight: '600', color: '#111827', marginTop: 10 }}>
                      Your Orders
                    </Text>
                  </TouchableOpacity>
                </View>

                
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Image picker modal */}
      <Modal
        transparent
        animationType="fade"
        visible={camModalVisible}
        onRequestClose={() => setCamModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setCamModalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalCard}
            onPress={() => {}}
          >
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setCamModalVisible(false)}
            >
              <Ionicons name="close-circle-outline" size={26} color="#111827" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Image</Text>
            <Text style={styles.modalMessage}>
              Choose an option to select an image.
            </Text>
            <View style={styles.buttonRow}>
              <View style={styles.buttonSpacing}>
                <ButtonWrapper title="Take Photo" onPress={handleTakePhoto} />
              </View>
              <View style={styles.buttonSpacing}>
                <ButtonWrapper
                  title="Choose from Library"
                  onPress={handleChooseFromLibrary}
                />
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  profile: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#141618',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  profileWrapper: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  pencilButton: {
    position: 'absolute',
    top: 0,
    right: -6,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1c2fdb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#111827',
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: '#F9FAFB',
  },
  iconstyle: {
    
    color: '#b3b7be',
  },
  inputGroup: {
    width: '80%',
    marginBottom: 16,
  },
  detailCard: {
    width: '80%',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  cancelBtn: {
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
    marginTop: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonSpacing: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default StoreScreen;
