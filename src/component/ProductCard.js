import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import ButtonWrapper from './Button';
import { IMAGE_BASE_URL } from '../api/apiConstant';
import { useCart } from '../context/CartContext';
import { updateCartApi } from '../api/cartApi/updateCartApi';



const footerComponent = () => (
  <View style={styles.footer}>
    <Text style={styles.footerText}>No more products to load.</Text>
  </View>
);



const ProductCard = ({ data = [], navigation }) => {
  const { qtyById, handleQty } = useCart();


  return (
    <FlatList
      data={data}
      keyExtractor={item => String(item.id )}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
      columnWrapperStyle={styles.columnWrapper}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      numColumns={2}
      removeClippedSubviews={false}
      ListFooterComponent={footerComponent}
      renderItem={({ item }) => {
        const productId = item.id ;
        const currentQty = qtyById[productId] || 0;

        return (
          <View style={styles.cardWrapper}>
            <View style={styles.productsCard}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.navigate('ProductDetail', { item })}
              >
                <View style={styles.imageWrap}>
                  <Image
                    source={
                      item.product_images?.length > 0
                        ? { uri: IMAGE_BASE_URL + item.product_images[0] }
                        : require('../images/medicine.jpg')
                    }
                    style={styles.productImage}
                  />
                </View>
              </TouchableOpacity>
              <View style={styles.cardBody}>
                <Text style={styles.productName} numberOfLines={1}>
                  {item.name || item.title}
                </Text>
                <Text style={styles.productDescription} numberOfLines={1}>
                  {item.description || item.short_description}
                </Text>
                <Text style={styles.productPrice}>₹{item.price}</Text>
                <View style={styles.qtyRow}>
                  {currentQty > 0 ? (
                    <>
                      <ButtonWrapper
                        title="-"
                        style={styles.qtyButton}
                        textStyle={styles.qtyButtonText}
                        onPress={() => handleQty(productId, -1,item)}
                      />
                      <Text style={styles.qtyText}>{currentQty}</Text>
                      <ButtonWrapper
                        title="+"
                        style={styles.qtyButton}
                        textStyle={styles.qtyButtonText}
                        onPress={() => handleQty(productId, 1,item)}
                      />
                    </>
                  ) : (
                    <ButtonWrapper
                      title="Buy now"
                      style={styles.buyNowBtn}
                      textStyle={styles.buyNowText}
                      onPress={() => handleQty(productId, 1,item)}
                    />
                  )}
                </View>
              </View>
            </View>
          </View>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    width: '50%',
    alignSelf: 'flex-start',
  },
  productsCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  columnWrapper: {
    paddingHorizontal: 10,
  },
  imageWrap: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  listContent: {
    paddingBottom: 96,
  },
  cardBody: {
    gap: 4,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  productDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  productPrice: {
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '600',
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#6B7280',
  },
  qtyButton: {
    backgroundColor: '#111827',
    width: 32,
    height: 32,
    minWidth: 32,
    minHeight: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  qtyButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 20,
  },
  qtyText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    minWidth: 24,
    textAlign: 'center',
  },
  buyNowBtn: {
    backgroundColor: '#007bff',
    width: '100%',
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  buyNowText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 20,
  },
});

export default ProductCard;
