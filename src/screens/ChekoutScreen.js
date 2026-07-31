import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Modal, TouchableOpacity } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import Header from '../component/Header';
import { theme } from '../theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from 'react-native/types_generated/index';
import ButtonWrapper from '../component/Button';
import { useCart } from '../context/CartContext';


const CheckoutScreen = ({ route, navigation }) => {
    const { cartItems } = route?.params || {};
    const [selectedDelivery, setSelectedDelivery] = useState('standard');
    const [selectedPayment, setSelectedPayment] = useState('upi');
    console.log('cartItems in CheckoutScreen:', cartItems);

    const subtotal = Number(cartItems?.total || cartItems?.totalAmount);
    const deliveryCharge = selectedDelivery === 'express' ? 159 : 0;
    const totalAmount = subtotal + deliveryCharge;
    const {setCartItems , fetchCart} = useCart();

    const [modalVisible, setModalVisible] = useState(false);

    const handleCloseModal = () => {
        setModalVisible(false);
        setCartItems([]); // Clear the cart items
        fetchCart(); // Fetch the updated cart state
        navigation.navigate('OrderTracking');
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Checkout" lefticon={() => navigation.goBack()} icon="arrow-back" />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.labelStyle}>Delivery</Text>

                <View style={styles.deliveryCard}>
                    <Pressable
                        style={[
                            styles.deliveryOption,
                            selectedDelivery === 'standard' && styles.selectedOption,
                        ]}
                        onPress={() => setSelectedDelivery('standard')}
                    >
                        <View style={styles.optionLeft}>
                            <Text
                                style={[
                                    styles.optionTitle,
                                    selectedDelivery === 'standard' && styles.selectedText,
                                ]}
                            >
                                Standard delivery
                            </Text>
                            <Text style={styles.optionSubtitle}>Arrives in 40-50 min</Text>
                        </View>
                        <Text
                            style={[
                                styles.priceText,
                                selectedDelivery === 'standard' && styles.selectedText,
                            ]}
                        >
                            Free
                        </Text>
                    </Pressable>

                    <View style={styles.divider} />

                    <Pressable
                        style={[
                            styles.deliveryOption,
                            selectedDelivery === 'express' && styles.selectedOption,
                        ]}
                        onPress={() => setSelectedDelivery('express')}
                    >
                        <View style={styles.optionLeft}>
                            <Text
                                style={[
                                    styles.optionTitle,
                                    selectedDelivery === 'express' && styles.selectedText,
                                ]}
                            >
                                Express delivery
                            </Text>
                            <Text style={styles.optionSubtitle}>Arrives in 15-20 min</Text>
                        </View>
                        <Text
                            style={[
                                styles.priceText,
                                selectedDelivery === 'express' && styles.selectedText,
                            ]}
                        >
                            ₹159
                        </Text>
                    </Pressable>
                </View>

                <Text style={styles.labelStyle}>Payment</Text>
                <View style={{ marginHorizontal: 24, marginTop: 4, borderRadius: 16, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF', overflow: 'hidden' }}>
                    <Pressable
                        style={[
                            styles.deliveryOption,
                            selectedPayment === 'upi' && styles.selectedOption,
                        ]}
                        onPress={() => setSelectedPayment('upi')}
                    >
                        <Text style={styles.addressText}>UPI</Text>
                        {selectedPayment === 'upi' && (
                            <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
                        )}
                    </Pressable>
                    <View style={styles.divider} />
                    <Pressable
                        style={[
                            styles.deliveryOption,
                            selectedPayment === 'card' && styles.selectedOption,
                        ]}
                        onPress={() => setSelectedPayment('card')}
                    >
                        <Text style={styles.addressText}>Card</Text>
                        {selectedPayment === 'card' && (
                            <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
                        )}
                    </Pressable>
                    <View style={styles.divider} />
                    <Pressable
                        style={[
                            styles.deliveryOption,
                            selectedPayment === 'Cash on Delivery' && styles.selectedOption,
                        ]}
                        onPress={() => setSelectedPayment('Cash on Delivery')}
                    >
                        <Text style={styles.addressText}>Cash on Delivery</Text>
                        {selectedPayment === 'Cash on Delivery' && (
                            <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
                        )}
                    </Pressable>
                </View>

                <View style={styles.summaryCard}>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Subtotal</Text>
                        <Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Delivery</Text>
                        <Text style={styles.summaryValue}>
                            {deliveryCharge > 0 ? `₹${deliveryCharge}` : 'Free'}
                        </Text>
                    </View>
                    <View style={styles.summaryDivider} />
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total Amount</Text>
                        <Text style={styles.totalAmount}>₹{totalAmount.toFixed(2)}</Text>
                    </View>
                </View>

                <View style={{ width: "80%", alignSelf: "center", marginTop: 20 }}>
                    <ButtonWrapper
                        title="Place Order"
                        textStyle={styles.checkoutBtnText}
                        style={styles.checkoutBtn}
                        onPress={() => setModalVisible(true)}
                    />
                </View>
            </ScrollView>

            <Modal
                transparent
                animationType="fade"
                visible={modalVisible}
                onRequestClose={handleCloseModal}
            >
                <View style={styles.modalBackdrop} >
                    <View style={styles.modalCard} >
                        <View style={styles.checkCircle}>
                            <Ionicons name="checkmark" size={44} color="#16A34A" />
                        </View>
                        <Text style={styles.modalTitle}>Order Placed!</Text>
                        <Text style={styles.modalMessage}>
                            Your order has been placed successfully
                        </Text>
                        <Pressable
                            style={styles.closeButton}
                            onPress={handleCloseModal}
                        >
                            <Ionicons name="close" size={24} color="#9CA3AF" style={{ marginTop: 20 }}  />
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        paddingBottom: 30,
    },
    labelStyle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 10,
        marginTop: 18,
        marginLeft: 24,
        color: '#6B7280',
    },
    deliveryCard: {
        marginHorizontal: 24,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
    },
    deliveryOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
    },
    selectedOption: {
        backgroundColor: '#F3F4F6',
    },
    optionLeft: {
        flexDirection: 'column',
    },
    optionTitle: {
        fontSize: 15,
        fontWeight: '500',
        color: '#9CA3AF',
    },
    selectedText: {
        color: '#4B5563',
        fontWeight: '600',
    },
    optionSubtitle: {
        fontSize: 13,
        color: '#9CA3AF',
        marginTop: 4,
    },
    priceText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#9CA3AF',
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 14,
        padding: 16,
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    addressText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#1F2937',
    },
    summaryCard: {
        marginHorizontal: 24,
        marginTop: 24,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        padding: 16,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    summaryLabel: {
        color: '#9CA3AF',
        fontSize: 15,
        fontWeight: '400',
    },
    summaryValue: {
        color: '#374151',
        fontSize: 15,
        fontWeight: '500',
    },
    summaryDivider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 10,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        color: '#1F2937',
        fontSize: 16,
        fontWeight: '700',
    },
    totalAmount: {
        color: '#1F2937',
        fontSize: 16,
        fontWeight: '700',
    },
    checkoutBtn: {
        backgroundColor: theme.colors.button,
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalCard: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingVertical: 32,
        paddingHorizontal: 24,
        alignItems: 'center',
    },
    checkCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#DCFCE7',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 18,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#4B5563',
        marginBottom: 8,
        textAlign: 'center',
    },
    modalMessage: {
        fontSize: 14,
        color: '#9CA3AF',
        textAlign: 'center',
        lineHeight: 20,
    },
    closeButton: {
        position: 'absolute',
        right: 16,
    },
});

export default CheckoutScreen;
