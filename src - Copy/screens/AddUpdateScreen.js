import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Modal,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import TextInputWraper from '../component/TextInput';
import ButtonWrapper from '../component/Button';
import Header from '../component/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import products from '../component/Data';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { IMAGE_BASE_URL } from '../api/apiConstant';
import Ionicons from '@react-native-vector-icons/ionicons';
import AwesomeAlert from 'react-native-awesome-alerts';
import { createProductApi } from '../api/productApi/createProductApi';

import { getProductById } from '../api/productApi/getProductById';

const imageArray = imageItem => {
  if (imageItem && typeof imageItem === 'object' && imageItem.uri) {
    return { uri: imageItem.uri };
  }
  if (typeof imageItem === 'string') {
    return { uri: imageItem };
  }
  return require('../images/medicine.jpg');
};

const AddUpdateScreen = ({ navigation, route }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [nameError, setNameError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [image, setImage] = useState([]);
  const [camModalVisible, setCamModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const item = route?.params?.item;

  useEffect(() => {
    const fetchProduct = async () => {
      if (item) {
        const product = await getProductById(item.id);
        console.log('Fetched product:', product);
        setName( product.name || '');
        setDescription(product.description || '');
        setPrice(product.price.toString() || '');
        const imgUrl = IMAGE_BASE_URL + item.image_name;
        setImage(imgUrl ? [imgUrl] : require('../images/medicine.jpg'));
      } else {
        setName('');
        setDescription('');
        setPrice('');
        setImage([]);
      }
      setNameError('');
      setDescriptionError('');
      setPriceError('');
    };
    fetchProduct();
  }, [item]);

  const navigateToOrders = () => {
    navigation.navigate('Drawer', { screen: 'Orders' });
  };

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
        setImage(assets);
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

  const handleAddItem = async () => {
    setNameError('');
    setDescriptionError('');
    setPriceError('');

    let hasError = false;
    if (!name.trim()) {
      setNameError('Please enter a valid name');
      hasError = true;
    }
    if (!description.trim()) {
      setDescriptionError('Please enter a valid description');
      hasError = true;
    }
    if (price < 0) {
      setPriceError('Please enter a valid price');
      hasError = true;
    }
    if (hasError) return;


    const data=new FormData();
    data.append('name', name.trim());
    data.append('description', description.trim());
    data.append('price', price);


    await createProductApi(data, image);





    const newItem = {
      id: Date.now().toString(),
      name: name.trim(),
      description: description.trim(),
      price: price,
      image: image.slice(0, 3),
    };
    products.unshift(newItem);
    navigateToOrders();
  };

  const handleUpdateItem = () => {
    const index = products.findIndex(product => product.id === item?.id);
    if (index !== -1) {
      products[index] = {
        ...products[index],
        name: name.trim(),
        description: description.trim(),
        price: price,
        image: image.slice(0, 3),
        qty: 0,
      };
    }
    navigateToOrders();
  };

  const openDeleteConfirm = () => {
    setModalVisible(true);
  };

  const handleDeleteItem = () => {
    const index = products.findIndex(product => product.id === item?.id);
    if (index !== -1) {
      products.splice(index, 1);
    }
    setModalVisible(false);
    navigateToOrders();
  };
return (
    <View style={styles.container}>
      <KeyboardAvoidingView style={styles.container} behavior={'padding'}>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="dark-content" backgroundColor="#fff" />
          <ScrollView>
            <Header
              title={item ? 'Update Item' : 'Add Item'}
              navigation={navigation}
              icon="arrow-back"
              lefticon={() => navigation.goBack()}
            />
            <View style={styles.form}>
              <ButtonWrapper
                title="Select Image"
                onPress={handleCamAndImagePicker}
              />
              {image.length > 0 ? (
                <View style={styles.previewContainer}>
                  {image.map((imageItem, index) => (
                    <Image
                      key={index}
                      source={imageArray(imageItem)}
                      style={styles.previewImage}
                    />
                  ))}
                </View>
              ) : null}

              <Text style={styles.label}>Name</Text>
              <TextInputWraper
                placeholder="Enter Item name Here......."
                value={name}
                onChangeText={setName}
                style={styles.input}
                error={nameError}
              />
              <Text style={styles.label}>Description</Text>
              <TextInputWraper
                placeholder="Enter Item description Here......."
                value={description}
                onChangeText={setDescription}
                style={styles.input}
                error={descriptionError}
              />
              <Text style={styles.label}>Price</Text>
              <TextInputWraper
                placeholder="Enter Item price Here......."
                value={price}
                onChangeText={setPrice}
                style={styles.input}
                error={priceError}
                keyboardType="numeric"
              />

              <View style={styles.formActions}>
                {item ? (
                  <>
                    <View style={styles.formButtonSpacing}>
                      <ButtonWrapper
                        title="Update Item"
                        onPress={() => setShowAlert(true)}
                      />
                    </View>
                    <View style={styles.formButtonSpacing}>
                      <ButtonWrapper
                        title="Delete Item"
                        onPress={openDeleteConfirm}
                      />
                    </View>
                  </>
                ) : (
                  <View style={styles.formButtonSpacing}>
                    <ButtonWrapper title="Add Item" onPress={handleAddItem} />
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>

      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.modalCard}
            onPress={() => {}}
          >
            <Text style={styles.modalTitle}>Delete Item?</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to delete this item?
            </Text>
            <View style={styles.buttonRow}>
              <View style={styles.buttonSpacing}>
                <ButtonWrapper
                  title="Delete"
                  onPress={handleDeleteItem}
                  style={styles.modalButton}
                />
              </View>
              <View style={styles.buttonSpacing}>
                <ButtonWrapper
                  title="No"
                  onPress={() => setModalVisible(false)}
                />false
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>


       <AwesomeAlert
        show={showAlert}
        title="Success"
        message="Item updated successfully"
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor="#6C63FF"
        onConfirmPressed={() => handleUpdateItem()}
      />

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
  input: {
    borderWidth: 1,
    borderColor: '#cfc4c4',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    transparent: true,
  },
  form: {
    padding: 16,
  },
  formActions: {
    marginTop: 16,
  },
  formButtonSpacing: {
    marginBottom: 8,
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
  modalButton: {
    backgroundColor: '#DC2626',
    minHeight: 48,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#111827',
  },
  previewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  previewImage: {
    width: 96,
    height: 96,
    borderRadius: 6,
    marginVertical: 8,
    marginRight: 8,
  },
});

export default AddUpdateScreen;
