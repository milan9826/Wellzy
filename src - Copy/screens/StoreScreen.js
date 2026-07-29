import React from 'react';
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
import { StatusBar } from 'react-native';

const StoreScreen = ({ navigation }) => {
  const [name, setName] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [firstname, setFirstName] = React.useState('');
  const [lastname, setLastName] = React.useState('');
  const [profileImage, setProfileImage] = React.useState(null);
  const [camModalVisible, setCamModalVisible] = React.useState(false);

  const [usernameError, setUsernameError] = React.useState('');
  const [firstnameError, setFirstNameError] = React.useState('');
  const [lastnameError, setLastNameError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

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
      setProfileImage(result.assets[0].uri);
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

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfile();
        if (profileData) {
          setName(profileData.username);
          setUsername(profileData.username);
          setFirstName(profileData.firstname);
          setLastName(profileData.lastname);
          setProfileImage(IMAGE_BASE_URL + profileData.image);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, [navigation]);

  const handleUpdateProfile = async () => {
    if (!validateInputs()) {
      return;
    }
    try {
      setLoading(true);
      const response = await updateProfile(username, firstname, lastname);
      await updateImage(profileImage);
      console.log('update response .......:', response);
      alert(response?.message);
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
    <View style={{ flex: 1, backgroundColor: '#fff' ,transparent: true}}>
      <SafeAreaView style={{ flex: 1 }}>
        {isInDrawer ? (
          <Header
            title="Store"
            navigation={navigation}
            icon="menu"
            lefticon={() => navigation.openDrawer()}
          />
        ) : (
          <Header
            title="Store"
            navigation={navigation}
            icon="arrow-back"
            lefticon={() => navigation.goBack()}
          />
        )}
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={'padding'}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 16,
            }}
          >
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <View style={styles.profileWrapper}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profile} />
              ) : (
                <View style={styles.profile}>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 40,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      lineHeight: 100,
                    }}
                  >
                    {name[0]}
                  </Text>
                </View>
              )}
              <TouchableOpacity
                style={styles.pencilButton}
                onPress={handleCamAndImagePicker}
              >
                <Ionicons name="pencil" size={22} color="#fff" />
              </TouchableOpacity>
            </View>

            <Text
              style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}
            >
              {name}
            </Text>

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
              <ActivityIndicator animating={loading} />
            ) : (
              <ButtonWrapper
                title="Update Profile"
                onPress={handleUpdateProfile}
              />
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Image picker modal — OUTSIDE SafeAreaView so it covers the full screen */}
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
    transparent: true,
  },
  profileWrapper: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
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
  inputGroup: {
    width: '80%',
    marginBottom: 20,
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
