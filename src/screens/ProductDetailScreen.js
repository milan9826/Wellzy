import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getProductById } from '../api/productApi/getProductById';
import Header from '../component/Header';
import { IMAGE_BASE_URL } from '../api/apiConstant';
import ButtonWrapper from '../component/Button';
import { useCart } from '../context/CartContext';
import { StatusBar } from 'react-native';

const ProductDetailScreen = ({ route, navigation }) => {
  const { item } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const { qtyById, handleQty, addToCart } = useCart();
  let imgArray = false;



  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const fetchedProduct = await getProductById(item.id);
        setProduct(fetchedProduct);
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [item.id]);
  const imageUri = product?.product_images;

  if (Array.isArray(imageUri) && imageUri.length > 0) {
    imgArray = true;
  } else {
    imgArray = false;
  }

  const handleImagePick = (index) => {
    setSelectedImage(IMAGE_BASE_URL + imageUri[index]);
  };




  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Product Details"
        navigation={navigation}
        icon="arrow-back"
        lefticon={() => navigation.goBack()}
      />

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#141618" />
          <Text style={styles.loadingText}>Loading product...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.imageWrap}>
            {imageUri==null ?    (
              <Image
                  source={require('../images/medicine.jpg')}
                style={styles.productImage}
                resizeMode="cover"
              />
            ):(
              <>
                <Image
                  source={{ uri: selectedImage ?? IMAGE_BASE_URL + imageUri[0] }}
                  style={styles.productImage}
                  resizeMode="cover"
                />
                <View style={styles.imageArrayContainer}>
                  {imageUri.map((img, index) => (
                    <TouchableOpacity key={index} onPress={() => handleImagePick(index)}>
                    <Image
                      key={index}
                      source={{ uri: IMAGE_BASE_URL + img }}
                      style={styles.productImageThumbnail}
                      resizeMode="cover"
                    />
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
          </View>

          <View style={{ marginTop: 16, marginHorizontal: 16 }}>
            <Text style={styles.productName}>
              {product?.name}
            </Text>
            <Text style={styles.productPrice}>
              ₹{product?.price}
            </Text>
            <View style={styles.divider} />
            <View style={styles.cardBody}>
              <Text style={styles.sectionLabel}>Description</Text>
              <Text style={styles.productDescription}>
                {product?.description || item?.description || 'No description available.'}
              </Text>
            </View>
          </View>
          {(() => {
            const productId = item.id || item._id || item.product_id;
            const currentQty = qtyById[productId] || 0;
            const itemData = product || item;

            return (
              <View style={styles.qtyRow}>
                <StatusBar barStyle="dark-content" backgroundColor="#fff" />
                {currentQty > 0 ? (
                  <>
                    <ButtonWrapper
                      title="-"
                      style={styles.qtyButton}
                      textStyle={styles.qtyButtonText}
                      onPress={() => handleQty(productId, -1, itemData)}
                    />
                    <Text style={styles.qtyText}>{currentQty}</Text>
                    <ButtonWrapper
                      title="+"
                      style={styles.qtyButton}
                      textStyle={styles.qtyButtonText}
                      onPress={() => handleQty(productId, 1, itemData)}
                    />
                  </>
                ) : (
                  <ButtonWrapper
                    title="Add to Cart"
                    style={styles.addToCartButton}
                    textStyle={styles.buyNowText}
                    onPress={() => handleQty(productId, 1, itemData)}
                  />
                )}
              </View>
            );
          })()}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    transparent: true,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
  },

  scrollContent: {
    paddingBottom: 40,
  },
  imageWrap: {
    width: '100%',
    backgroundColor: '#E5E7EB',
    paddingBottom: 12,
  },
  productImage: {
    width: '90%',
    height: 250,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 15,
  },

  productName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f0f0f',
    marginBottom: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  productDescription: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
  },
  cardBody: {
    gap: 4,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
  },
  addToCartButton: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#935541',
    width: '90%',
    alignSelf: 'center',
  },
  goToCartButton: {
    backgroundColor: '#111827',
    paddingHorizontal: 14,
    minWidth: 90,
  },
  buyNowText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  imageArrayContainer: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 12,
    marginHorizontal: 20,
    
    
  },
  productImageThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 6,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 48,
    marginTop: 20,
    marginHorizontal: 16,
  },
  qtyButton: {
    backgroundColor: '#111827',
    width: 44,
    height: 44,
    minWidth: 44,
    minHeight: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  qtyButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 26,
    textAlign: 'center',
  },
  qtyText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    minWidth: 28,
    textAlign: 'center',
  },
 

});

export default ProductDetailScreen;