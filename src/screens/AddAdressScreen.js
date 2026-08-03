import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { theme } from '../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import TextInputWraper from '../component/TextInput';
import ButtonWrapper from '../component/Button';
import Header from '../component/Header';
import { addAdressApi } from '../api/addressApi/addAdressApi';
import { getAddressApi } from '../api/addressApi/getAddressApi';
import AsyncStorage from '@react-native-async-storage/async-storage';


const AddAdreessScreen = ({ navigation }) => {

    const TYPE_OPTIONS = ['Home', 'Work', 'Other'];

    const [addAddress, setAddAddress] = useState(false);

    const [allAddress, setAllAddress] = useState([]);
    const [editingAddress, setEditingAddress] = useState(false);

    const [streetAddress, setStreetAddress] = useState('');
    const [streetAddressError, setStreetAddressError] = useState('');
    const [landmark, setLandmark] = useState('');
    const [landmarkError, setLandmarkError] = useState('');
    const [city, setCity] = useState('');
    const [cityError, setCityError] = useState('');
    const [state, setState] = useState('');
    const [stateError, setStateError] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [postalCodeError, setPostalCodeError] = useState('');
    const [type, setType] = useState('Home');
    const [selectedAddressId, setSelectedAddressId] = useState(null);

    const resetForm = () => {
        setStreetAddress('');
        setLandmark('');
        setCity('');
        setState('');
        setPostalCode('');
        setType('Home');
        setStreetAddressError('');
        setLandmarkError('');
        setCityError('');
        setStateError('');
        setPostalCodeError('');
    };

    console.log('allAddress:', allAddress);
    const handleSaveAddress = async () => {
        let hasError = false;

        if (!streetAddress.trim()) {
            setStreetAddressError('Street Address is required');
            hasError = true;
        } else {
            setStreetAddressError('');
        }

        if (!landmark.trim()) {
            setLandmarkError('Landmark is required');
            hasError = true;
        }
        if (!city.trim()) {
            setCityError('City is required');
            hasError = true;
        } else {
            setCityError('');
        }

        if (!state.trim()) {
            setStateError('State is required');
            hasError = true;
        } else {
            setStateError('');
        }

        if (!postalCode.trim()) {
            setPostalCodeError('Postal Code is required');
            hasError = true;
        } else {
            setPostalCodeError('');
        }

        if (!hasError) {
            const addressData = {
                "street_address": streetAddress,
                "landmark": landmark,
                "city": city,
                "state": state,
                "postal_code": postalCode,
                "address_type": type.toLowerCase(),
            };
            console.log('Address Data:', addressData);
            try {
                const response = await addAdressApi(addressData);
                console.log('Address added successfully:', response);
                navigation.goBack();
            } catch (error) {
                console.error('Error adding address:', error);
            }

        }
    }

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await getAddressApi();
                const selectedAdd = await AsyncStorage.getItem('selectedAddress');
                setSelectedAddressId(selectedAdd ? JSON.parse(selectedAdd)?.id : null);
                setAllAddress(response?.addresses);
            } catch (error) {
                console.error('Error fetching addresses:', error);
            }
        };

        fetchAddresses();
    }, []);

    const handleSelectAddress = async (address) => {
        await AsyncStorage.setItem('selectedAddress', JSON.stringify(address));
                setSelectedAddressId(address.id);
                navigation.goBack();

    }


    const handleEditAddress = (address) => {
        setAddAddress(true);
        setEditingAddress(true);
        setStreetAddress(address.street_address);
        setLandmark(address.landmark);
        setCity(address.city);
        setState(address.state);
        setPostalCode(address.postal_code);
        setType(address.address_type);
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.white }}>
            <ScrollView style={{ paddingHorizontal: 16, marginTop: 12 }} showsVerticalScrollIndicator={false}>
                <Header
                    title="Add Address"
                    navigation={navigation}
                    lefticon={() => navigation.goBack()}
                    icon="arrow-back"
                />

                {addAddress ? (

                    <>
                        {editingAddress ? (<View style={styles.formContainer}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Street Address</Text>
                                <TextInputWraper
                                    placeholder="Enter Street Address here..."
                                    style={styles.input}
                                    value={streetAddress}
                                    onChangeText={setStreetAddress}
                                    error={streetAddressError}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Landmark</Text>
                                <TextInputWraper
                                    placeholder="Enter Landmark here..."
                                    style={styles.input}
                                    value={landmark}
                                    onChangeText={setLandmark}
                                    error={landmarkError}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>City</Text>
                                <TextInputWraper
                                    placeholder="Enter City here..."
                                    style={styles.input}
                                    value={city}
                                    onChangeText={setCity}
                                    error={cityError}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>State</Text>
                                <TextInputWraper
                                    placeholder="Enter State here..."
                                    style={styles.input}
                                    value={state}
                                    onChangeText={setState}
                                    error={stateError}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Postal Code</Text>
                                <TextInputWraper
                                    placeholder="Enter Postal Code here..."
                                    style={styles.input}
                                    value={postalCode}
                                    onChangeText={setPostalCode}
                                    error={postalCodeError}
                                />
                            </View>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Adress Type</Text>
                                <View style={styles.genderContainer}>
                                    {TYPE_OPTIONS.map(item => {
                                        const isSelected = type === item;
                                        return (
                                            <TouchableOpacity
                                                key={item}
                                                style={[
                                                    styles.genderOption,
                                                    isSelected
                                                        ? styles.genderOptionSelected
                                                        : styles.genderOptionUnselected,
                                                ]}
                                                onPress={() => setType(item)}
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

                            <ButtonWrapper
                                title="Update Address"
                                onPress={() => {}}
                                style={{ backgroundColor: theme.colors.button, marginTop: 12 }}
                            />
                        </View>) :
                            (<View style={styles.formContainer}>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Street Address</Text>
                                    <TextInputWraper
                                        placeholder="Enter Street Address here..."
                                        style={styles.input}
                                        value={streetAddress}
                                        onChangeText={setStreetAddress}
                                        error={streetAddressError}
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Landmark</Text>
                                    <TextInputWraper
                                        placeholder="Enter Landmark here..."
                                        style={styles.input}
                                        value={landmark}
                                        onChangeText={setLandmark}
                                        error={landmarkError}
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>City</Text>
                                    <TextInputWraper
                                        placeholder="Enter City here..."
                                        style={styles.input}
                                        value={city}
                                        onChangeText={setCity}
                                        error={cityError}
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>State</Text>
                                    <TextInputWraper
                                        placeholder="Enter State here..."
                                        style={styles.input}
                                        value={state}
                                        onChangeText={setState}
                                        error={stateError}
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Postal Code</Text>
                                    <TextInputWraper
                                        placeholder="Enter Postal Code here..."
                                        style={styles.input}
                                        value={postalCode}
                                        onChangeText={setPostalCode}
                                        error={postalCodeError}
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Adress Type</Text>
                                    <View style={styles.genderContainer}>
                                        {TYPE_OPTIONS.map(item => {
                                            const isSelected = type === item;
                                            return (
                                                <TouchableOpacity
                                                    key={item}
                                                    style={[
                                                        styles.genderOption,
                                                        isSelected
                                                            ? styles.genderOptionSelected
                                                            : styles.genderOptionUnselected,
                                                    ]}
                                                    onPress={() => setType(item)}
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

                                <ButtonWrapper
                                    title="Save Address"
                                    onPress={() => handleSaveAddress()}
                                    style={{ backgroundColor: theme.colors.button, marginTop: 12 }}
                                />
                            </View>)}
                    </>
                ) : (
                    <>
                        <ButtonWrapper
                            title="Add Address"
                            onPress={() => {
                                setEditingAddress(false);
                                resetForm();
                                setAddAddress(true);
                            }} />

                        {allAddress.map((address, index) => (
                            <TouchableOpacity onPress={()=>{handleSelectAddress(address)}} key={index}>
                                
                            <View key={index} style={selectedAddressId === address.id ? styles.selectedAddressCard : styles.addressCard}>
                                
                                <View style={styles.addressIconWrapper}>
                                    <Ionicons name="location-outline" size={22} color={theme.colors.button} />
                                </View>

                                <View style={styles.addressDetails}>
                                    <View style={styles.addressHeader}>
                                        <Text style={styles.addressType}>
                                            {address.address_type ? address.address_type.toUpperCase()  : 'Address'}
                                        </Text>
                                        <TouchableOpacity activeOpacity={0.8} onPress={() => handleEditAddress(address)}>
                                            <Ionicons name="pencil" size={18} color={theme.colors.button} />
                                        </TouchableOpacity>
                                    </View>

                                    <Text style={styles.addressText}>{address.street_address}</Text>
                                    <Text style={styles.addressText}>{address.landmark}</Text>
                                    <Text style={styles.addressText}>{`${address.city}, ${address.state} - ${address.postal_code}`}</Text>
                                </View>
                            </View>
                            </TouchableOpacity>
                        ))}
                    </>




                )}
            </ScrollView>
        </SafeAreaView>
    )
}



const styles = StyleSheet.create({
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
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
    formContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        marginBottom: 16
        

    },
    addressCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginTop:12,
       
    },
    selectedAddressCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#EEF2FF',
        borderRadius: 14,
        padding: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: theme.colors.button,
        marginTop:12,
    },
    addressIconWrapper: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#EEF2FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    addressDetails: {
        flex: 1,
    },
    addressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    addressType: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
        textTransform: 'capitalize',
    },
    addressText: {
        fontSize: 13,
        color: '#4B5563',
        marginBottom: 2,
    },
})

export default AddAdreessScreen;


