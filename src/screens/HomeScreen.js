import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Header from '../component/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import CardWrapper from '../component/CardWrapper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Modal } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import ButtonWrapper from '../component/Button';
import FamilyScreen from './FamilyScreen';
import { getAddressApi } from '../api/addressApi/getAddressApi';

const HomeScreen = ({ navigation }) => {


  const [location, setLocation] = useState('');

  const medicine = [
    {
      name: 'Metformin 500',
      description: 'Strip of 10 ',
    },
    {
      name: 'Telma 40',
      description: 'Strip of 15 ',
    },
    {
      name: 'Vitamin D3 ',
      description: 'Bottle ',
    },
  ];

  const browse = [
    {
      color: '#FDE68A',
      name: 'Medicine',
    },
    {
      color: '#FECACA',
      name: 'Personal Care',
    },
    {
      color: '#C7D2FE',
      name: 'Family',
    },
    {
      color: '#FDE68A',
      name: 'Wellness',
    },
  ];

  const [camModalVisible, setCamModalVisible] = useState(false);
  const [user, setUser] = useState({});

  

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        setUser(JSON.parse(user));
        const addressData = await getAddressApi();
        setLocation(addressData?.[0]?.address_line_1 || 'Not Available');
        // if (addressData && addressData.length > 0) {
        //   const firstAddress = addressData[0];
        //   const formattedLocation = `${firstAddress.address_line_1}, ${firstAddress.city}, ${firstAddress.state}`;
        //   setLocation(formattedLocation);
        // } else {
        //   console.log('No addresses found.');
        // }
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    };

    fetchLocation();
  }, []);



  const handleCamAndImagePicker = () => {
    setCamModalVisible(true);
  };

  const handleImagePicker = async picker => {
    const options = {
      mediaType: 'photo',
      selectionLimit: 3,
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
      const assets = (result.assets || []).slice(0, 3);
      if (assets.length) {
        // setImage(assets);
      }
    } catch (e) {
      console.warn('ImagePicker exception', e);
    }
  };

  const handleTakePhoto = () => {
    setCamModalVisible(false);
    setTimeout(() => {
      handleImagePicker(launchCamera);
    }, 400);
  };

  const handleChooseFromLibrary = () => {
    setCamModalVisible(false);
    setTimeout(() => {
      handleImagePicker(launchImageLibrary);
    }, 400);
  };

  

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Header
        title={location || 'Not Available'}
        navigation={navigation}
        onPress={() => navigation.navigate('Profile')}
         lefticon={() => navigation.openDrawer()}
         icon="location-sharp"
        righticon={true}
      />

      <ScrollView
        style={{ flex: 1, width: '90%', alignSelf: 'center' }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
      >
        <View style={{ marginTop: 10, marginBottom: 12 ,flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
        <Text style={styles.text}>Good morning, {user.first_name}</Text>

        <ButtonWrapper
          title="+ Add new order"
          onPress={() => ('')}  
          style={{ backgroundColor: '#7a2d09', paddingVertical: 10, paddingHorizontal: 10,marginTop:10, borderRadius: 8 }}
          textStyle={{ color: '#ede7e5', fontSize: 14, fontWeight: '600' }}
        />
        </View>
        <CardWrapper
          title="Scan or speak your prescription"
          content="Get matched medicines from your retailer in seconds"
          des={true}
          button={true}
          btntitle="Get Started"
          onPress={handleCamAndImagePicker}
          btnstyle={styles.btn}
          backgroundColor="#E6F4EA"
          borderColor="#D1E8D3"
          btnColor="#7a2d09"
        />
        <CardWrapper
          title="Dad's BP medicine due in 3days"
          content="Tap to reorder from family basket"
          des={true}
          backgroundColor="#EFE0C2"
          borderColor="#D4C5A8"
        />

        <CardWrapper
          title="Go WellZy Plus - free express delivery on every order"
          des={false}
          backgroundColor="#E0F2FE"
          borderColor="#BFD9E8"
        />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 12,
            marginBottom: 6,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '600', marginLeft: 12 }}>
            Your usual
          </Text>
          <ButtonWrapper
            title="See all"
            style={styles.seebtn}
            textStyle={styles.seebtntexe}
          />
        </View>
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        >
          {medicine.map((item, index) => (
            <CardWrapper
              key={index.toString()}
              title={item.name}
              content={item.description}
              des={true}
              cardStyle={{ width: 160, gap: 12 }}
            />
          ))}
        </ScrollView>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '600',
            marginLeft: 12,
            marginTop: 16,
            marginBottom: 10,
          }}
        >
          Browse
        </Text>

        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 12 }}
        >
          {browse.map((item, index) => (
            <View
              key={index.toString()}
              style={{ alignItems: 'center', marginHorizontal: 10, width: 72 }}
            >
              <View
                style={{
                  height: 56,
                  width: 56,
                  borderRadius: 28,
                  backgroundColor: item.color,
                  marginBottom: 6,
                }}
              />
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '500',
                  color: '#374151',
                  textAlign: 'center',
                }}
              >
                {item.name}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.storeCard}>
          <View style={styles.storeAvatar}>
            <Text style={styles.storeAvatarText}>S</Text>
          </View>
          <View style={styles.storeInfo}>
            <Text style={styles.storeName}>Sharma medical store</Text>
            <Text style={styles.storeDetails}>0.4 km · open now</Text>
          </View>
        </View>
      </ScrollView>

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    transparent: true,
  },
  text: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'left',
    marginTop: 12,
  },
  btn: {
    backgroundColor: '#2054c6',
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'left',
    width: '40%',
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
  seebtn: {
    backgroundColor: '#fcfdff',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  seebtntexe: {
    color: '#090b0e',
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 20,
    paddingHorizontal: 4,
    gap: 12,
  },
  browseListContent: {
    paddingHorizontal: 4,
    paddingBottom: 12,
    alignItems: 'flex-start',
  },
  browseItem: {
    alignItems: 'center',
    marginHorizontal: 10,
    width: 72,
  },
  browseCircle: {
    height: 56,
    width: 56,
    borderRadius: 28,
    marginBottom: 6,
  },
  browseLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
  storeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  storeAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E6F4EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeAvatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4B5563',
  },
  storeInfo: {
    marginLeft: 12,
  },
  storeName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  storeDetails: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 2,
  },
});
export default HomeScreen;
