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


const CartScreen = ({ navigation,route }) => {
  const { cartItems, setCartItems, handleQty, removeFromCart, fetchCart, loading: isCartLoading, qtyById } = useCart();
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedItemToRemove, setSelectedItemToRemove] = React.useState(null);
  const [loading, setLoading] = useState(false);
  const [disable,setDisable] = useState(false);
  const [medQtyMap, setMedQtyMap] = useState({});

  const reorderData=route.params?.item || null;
  console.log('reorderData:', reorderData);


  const cart = cartItems;

  const getProductId = item => {
    return item?.product_id ;//|| item?.id || item?._id || item?.product?.id || item?.product?._id;
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
    if (productId) {
      try {
        setDisable(true);
        if (currentQty <= 1) {
          // Quantity 0 hogi to item auto-remove
          await removeCartItemApi(productId);
          removeFromCart(productId);
        } else {
          await handleQty(productId, -1, item);
        }
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
  const handleMedQty = (index, change) => {
    setMedQtyMap(prev => {
      const current = prev[index] ?? 1;
      const newQty = current + change;
      if (newQty < 1) return prev;
      return { ...prev, [index]: newQty };
    });
  }


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
        title="Your Cart"
        icon="arrow-back"
        lefticon={() => navigation.goBack()}
        titleStyle={styles.titleStyle}
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
            {(!reorderData && cart.length === 0) ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>Your cart is empty</Text>
                <Text style={styles.emptyText}>
                  Add items from the store to see them here.
                </Text>
              </View>
            ) : (
              <>
              {reorderData ? (
                <>
                  <Text style={styles.sectionTitle}>Reorder Summary</Text>
                  {/* <Text style={[styles.price, { marginBottom: 8 }]}>Order Total: ₹{reorderData.totalAmount}</Text> */}
                  {reorderData.medicines.map((medicine, index) => (
                    <View key={index} style={styles.card}>
                      <View style={styles.itemDetails}>
                        <Text style={styles.cardText} numberOfLines={1}>
                          {medicine}
                        </Text>
                      </View>
                      <View style={styles.quantityControls}>
                        <ButtonWrapper
                          title="−"
                          onPress={() => handleMedQty(index, -1)}
                          style={styles.quantityButton}
                          textStyle={styles.quantityButtonText}
                          disable={disable}
                        />
                        <View style={styles.quantityBadge}>
                          <Text style={styles.quantityText}>{medQtyMap[index] ?? 1}</Text>
                        </View>
                        <ButtonWrapper
                          title="+"
                          onPress={() => handleMedQty(index, 1)}
                          style={styles.quantityButton}
                          textStyle={styles.quantityButtonText}
                          disable={disable}
                        />
                      </View>
                      
                    </View>
                  ))}
                </>
              ) : (
                <>
                  <Text style={styles.sectionTitle}>ORDER SUMMARY</Text>
                  {cart.map((item, index) => (
                    <View key={item.id || item._id || item.product_id || index} style={styles.card}>
                      <View style={styles.itemDetails}>
                        <Text style={styles.cardText} numberOfLines={1}>
                          {item.name || item.product?.name}
                        </Text>
                        <Text style={styles.price}>₹{item.price || item.product?.price} each</Text>
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
                      {/* <TouchableOpacity
                        onPress={() => handleRemoveItem(item)}
                        style={styles.removeButton}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="trash-outline" size={20} color="#eae6e6ff" />
                      </TouchableOpacity> */}
                    </View>
                  ))}
                </>
              )}
              </>
            )}
          </ScrollView>
          <View style={styles.totalCard}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Order Total</Text>
              <Text style={styles.totalAmount}>₹{reorderData?.totalAmount ?? total.toFixed(2)}</Text>
            </View>
            <ButtonWrapper
            title="Checkout"
            textStyle={styles.checkoutBtnText}
              style={styles.checkoutBtn}
              onPress={() => navigation.navigate('Orders')}
              activeOpacity={0.85}
            />
              
            <ButtonWrapper
              title="Clear Cart"
              style={styles.clearBtn}
              onPress={handleClearCart}
              activeOpacity={0.7}

            />
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
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    transparent: true,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 160,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 12,
  },
  card: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#FFFFFF',
  },
  itemDetails: {
    flex: 1,
    paddingRight: 12,
  },

  cardText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 3,
  },
  price: {
    fontSize: 13,
    fontWeight: '400',
    color: '#6B7280',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleStyle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  marginLeft:98, },

  quantityBadge: {
    minWidth: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '600',
    minWidth: 20,
    textAlign: 'center',
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
    width: 30,
    height: 30,
    minHeight: 0,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  quantityButtonText: {
    color: '#374151',
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 20,
  },
  totalCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  checkoutBtn: {
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  checkoutBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  clearBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  clearBtnText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  totalLabel: {
    color: '#6B7280',
    fontSize: 15,
    fontWeight: '500',
  },
  totalAmount: {
    color: '#111827',
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
