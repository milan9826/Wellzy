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
            title="My Retailer"
            navigation={navigation}
             icon="arrow-back"
             lefticon={() => navigation.goBack()}
          />
        ) : (
          <Header
            title="My Retailer"
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
              <View style={{ width: '100%', alignItems: 'center' }}>
                <View style={styles.profileWrapper}>
                  {profileImage ? (
                    <Image source={{ uri: profileImage }} style={styles.profile} />
                  ) : (
                    <View style={styles.profile}>
                      <Text style={styles.initialText}>{user.name ? user.name[0] : 'U'}</Text>
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
              <View style={styles.container}>
                {/* Profile Card */}
                <View style={styles.profileCard}>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.avatarContainer}>
                      {profileImage ? (
                        <Image source={{ uri: profileImage }} style={styles.avatarImage} />
                      ) : (
                        <View style={styles.avatarPlaceholder}>
                          <Text style={styles.avatarInitial}>
                            {(firstname?.[0] || user.first_name?.[0] || 'M').toUpperCase()}
                          </Text>
                        </View>
                      )}
                      <TouchableOpacity
                        style={styles.editPencilBadge}
                        onPress={() => setEdit(true)}
                        activeOpacity={0.8}
                      >
                        <Ionicons name="pencil" size={14} color="#ffffff" />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.nameContainer}>
                      <Text style={styles.fullNameText}>
                        {`${firstname || user.first_name || ''} ${lastname || user.last_name || ''}`.trim() || user.name || user.username || 'User Profile'}
                      </Text>
                    
                    </View>
                  </View>

                  <View style={styles.cardDivider} />

                  <View style={styles.detailsGrid}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>First Name</Text>
                      <Text style={styles.detailValue}>{firstname || user.first_name || '-'}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Last Name</Text>
                      <Text style={styles.detailValue}>{lastname || user.last_name || '-'}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.retailerCard}>
                  <Text style={styles.retailerCardTitle}>Why this is your retailer</Text>
                  <Text style={styles.retailerCardText}>
                    You were matched to this store as part of the Smartway network near you. Your orders are fulfilled here first, with nearby stores as backup.
                  </Text>
                </View>

                <View style={styles.actionList}>
                  <TouchableOpacity
                    style={styles.actionCard}
                    onPress={() => navigation.navigate('YourOrder')}
                    activeOpacity={0.7}
                  >
                    <View style={styles.actionLeft}>
                      <View style={styles.actionIconContainer}>
                        <Ionicons name="bag-handle-outline" size={22} color="#1C2FDB" />
                      </View>
                      <Text style={styles.actionTitle}>Your Orders</Text>
                    </View>
                    <Ionicons name="chevron-forward-outline" size={20} color="#9CA3AF" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionCard}
                    onPress={() => navigation.navigate('OrderTracking')}
                    activeOpacity={0.7}
                  >
                    <View style={styles.actionLeft}>
                      <View style={styles.actionIconContainer}>
                        <Ionicons name="location-outline" size={22} color="#1C2FDB" />
                      </View>
                      <Text style={styles.actionTitle}>Track your Orders</Text>
                    </View>
                    <Ionicons name="chevron-forward-outline" size={20} color="#9CA3AF" />
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
  container: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  profileCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarContainer: {
    position: 'relative',
    width: 68,
    height: 68,
  },
  avatarImage: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#F3F4F6',
  },
  avatarPlaceholder: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#141618',
    justifycontent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontSize: 28,
    marginTop: 12,
    fontWeight: 'bold',
  },
  editPencilBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#1C2FDB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  nameContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  fullNameText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  usernameText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  cardDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 14,
  },
  detailsGrid: {
    gap: 10,
  },
  retailerCard: {
    width: '100%',
    backgroundColor: '#EAF7EC',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#C6E7C6',
  },
  retailerCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E4620',
    marginBottom: 6,
  },
  retailerCardText: {
    fontSize: 13.5,
    color: '#2E6930',
    lineHeight: 20,
  },
  actionList: {
    width: '100%',
    gap: 12,
  },
  actionCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
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
