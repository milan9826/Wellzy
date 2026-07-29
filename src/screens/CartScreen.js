import React, { useEffect, useState,useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import Header from '../component/Header';
import ButtonWrapper from '../component/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../context/CartContext';
import { removeCartItemApi } from '../api/cartApi/removeCartitemApi';
import { clearCartApi } from '../api/cartApi/clearCartApi';


const CartScreen = ({ navigation }) => {
  const { cartItems, setCartItems, handleQty, removeFromCart, fetchCart, loading: isCartLoading, qtyById } = useCart();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedItemToRemove, setSelectedItemToRemove] = React.useState(null);
  const [loading, setLoading] = useState(false);
  const [disable,setDisable] = useState(false);


  const cart = cartItems;

  const getProductId = item => {
    return item?.product_id || item?.id || item?._id || item?.product?.id || item?.product?._id;
  };

  const getItemQty = item => {
    const productId = getProductId(item);
    if (productId && qtyById && qtyById[productId] !== undefined) {
      return Number(qtyById[productId]);
    }
    return Number(item?.quantity || 0);
  };

  const handleIncreaseQuantity = async item => {
    const productId = getProductId(item);
    if (productId) {
      try {
        setDisable(true);
        await handleQty(productId, 1, item);
      } finally {
        setDisable(false);
      }
    }
  };

  const handleDecreaseQuantity = async item => {
    const productId = getProductId(item);
    const currentQty = getItemQty(item);
    if (currentQty <= 1) return;
    if (productId) {
      try {
        setDisable(true);
        await handleQty(productId, -1, item);
      } finally {
        setDisable(false);
      }
    }
  };

  const total = cart.reduce(
    (sum, item) =>
      sum + (Number(item.price || item.product?.price) || 0) * getItemQty(item),
    0,
  );

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemoveItem = item => {
    setSelectedItemToRemove(item);
    setModalVisible(true);
  };


  const handleRemove = async () => {
    if (selectedItemToRemove) {
      const productId = getProductId(selectedItemToRemove);
      try {
        if (productId) {
          await removeCartItemApi(productId);
        }
      } catch (error) {
        console.error('Error removing item:', error);
      }  
      // Remove from cartItems + clear qtyById for this product
      removeFromCart(productId);
    }
    setModalVisible(false);
    setSelectedItemToRemove(null);
  };

  const closeLogoutConfirm = () => {
    setModalVisible(false);
    setSelectedItemToRemove(null);
  };


  const handleClearCart = async () => {
    try {
      setLoading(true);
      await clearCartApi();
      // Update the cart items in the context
      await fetchCart(); // Refresh the cart after clearing
      setCartItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Header
        navigation={navigation}
        title="Cart"
        icon="arrow-back"
        lefticon={() => navigation.goBack()}
      />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#111827" />
          <Text style={styles.loadingText}>Loading cart...</Text>
        </View>
      ) : (
        <>
          <ScrollView
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
          >
            {cart.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>Your cart is empty</Text>
                <Text style={styles.emptyText}>
                  Add items from the store to see them here.
                </Text>
              </View>
            ) : (
              <>
                <Text style={styles.sectionTitle}>ORDER SUMMARY</Text>
                {cart.map((item, index) => (
                  <View key={item.id || item._id || item.product_id || index} style={styles.card}>
                    <View style={styles.itemDetails}>
                      <Text style={styles.cardText} numberOfLines={1}>
                        {item.name || item.product?.name}
                      </Text>
                      <Text style={styles.price}>₹{item.price || item.product?.price}</Text>
                    </View>
                    <View style={styles.quantityControls}>
                      <ButtonWrapper
                        title="−"
                        onPress={() => handleDecreaseQuantity(item)}
                        style={styles.quantityButton}
                        textStyle={styles.quantityButtonText}
                        disable={disable}
                      />
                      <View style={styles.quantityBadge}>
                        <Text style={styles.quantityText}>{getItemQty(item)}</Text>
                      </View>
                      <ButtonWrapper
                        title="+"
                        onPress={() => handleIncreaseQuantity(item)}
                        style={styles.quantityButton}
                        textStyle={styles.quantityButtonText}
                        disable={disable}
                      />
                    </View>
                    <TouchableOpacity
                      onPress={() => handleRemoveItem(item)}
                      style={styles.removeButton}
                      activeOpacity={0.7}
                    >
                      <Ionicons name="trash-outline" size={20} color="#eae6e6ff" />
                    </TouchableOpacity>
                  </View>
                ))}
              </>
            )}
          </ScrollView>
          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>₹{total.toFixed(2)}</Text>
            <ButtonWrapper title="Clear Cart" onPress={handleClearCart} />
          </View>
        </>
      )}

      {modalVisible && (
        <View
          style={[StyleSheet.absoluteFill, { zIndex: 1000, elevation: 10 }]}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Remove Item?</Text>
              <Text style={styles.modalMessage}>
                Are you sure you want to remove this item from the cart?
              </Text>
              <View style={styles.buttonRow}>
                <View style={styles.buttonSpacing}>
                  <ButtonWrapper title="No" onPress={closeLogoutConfirm} />
                </View>
                <View style={styles.buttonSpacing}>
                  <ButtonWrapper
                    title="Yes"
                    onPress={handleRemove}
                    style={styles.modalButton}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    transparent: true,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 92,
    backgroundColor: '#F7F8FA',
  },
  sectionTitle: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 12,
  },
  card: {
    marginBottom: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#111827',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  itemDetails: {
    flex: 1,
    paddingRight: 12,
  },

  cardText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  price: {
    marginTop: 6,
    fontSize: 15,
    fontWeight: '600',
    color: '#2563EB',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  quantityBadge: {
    minWidth: 34,

    height: 34,
    borderRadius: 9,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '700',
  },
  removeButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: '#f61f1fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },

  quantityButton: {
    minHeight: 34,
    width: 34,
    paddingHorizontal: 0,
    paddingVertical: 0,

    borderRadius: 9,
    backgroundColor: '#111827',
  },
  quantityButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 22,
  },
  totalCard: {
    marginTop: 8,
    padding: 18,
    borderRadius: 16,
    backgroundColor: '#111827',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 20,
    width: '70%',
  },
  totalLabel: {
    color: '#D1D5DB',
    fontSize: 16,
    fontWeight: '600',
  },
  totalAmount: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  emptyState: {
    flex: 1,
    minHeight: 360,

    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },

  emptyTitle: {
    color: '#111827',
    fontSize: 22,
    fontWeight: '800',
  },
  emptyText: {
    marginTop: 8,
    color: '#6B7280',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
    spacing: 0.5,
  },
  modalMessage: {
    fontSize: 15,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonSpacing: {
    flex: 1,
    marginHorizontal: 4,
  },
  logoutButton: {
    backgroundColor: '#DC2626',
    marginTop: 330,
    borderRadius: 12,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#DC2626',
    minHeight: 48,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F7F8FA',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
  },
});

export default CartScreen;
