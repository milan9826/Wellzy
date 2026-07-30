import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import ButtonWrapper from './Button';
import { IMAGE_BASE_URL } from '../api/apiConstant';
import { useCart } from '../context/CartContext';
import { updateCartApi } from '../api/cartApi/updateCartApi';
import { theme } from '../theme';





const footerComponent = () => (
  <View style={styles.footer}>
    <Text style={styles.footerText}>No more products to load.</Text>
  </View>
);

const productCategories = [
  { id: 1, name: 'All' },
  { id: 2, name: 'Medicines & otc' },
  { id: 3, name: 'Nutrition' },
  { id: 4, name: 'Skin & care' },
];

const ProductCard = ({ data = [], navigation }) => {
  const { qtyById, handleQty } = useCart();
  const [selectedCategoryId, setSelectedCategoryId] = React.useState(1);


  return (
    <>
      {productCategories.length > 0 && (
        <View style={styles.categoryContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScrollContent}
          >
            {productCategories.map(category => {
              const isActive = selectedCategoryId === category.id;
              return (
                <TouchableOpacity
                  key={category.id}
                  activeOpacity={0.8}
                  onPress={() => setSelectedCategoryId(category.id)}
                  style={[
                    styles.categoryChip,
                    {
                      backgroundColor: isActive ? theme.colors.button : '#ffffff',
                      borderColor: theme.colors.button,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      {
                        color: isActive ? '#ffffff' : theme.colors.button,
                      },
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      <FlatList
        data={filteredData}
        keyExtractor={item => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        numColumns={2}
        removeClippedSubviews={false}
        ListFooterComponent={footerComponent}
        renderItem={({ item }) => {
          const productId = item.id;
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
                  {/* <Text style={styles.productDescription} numberOfLines={1}>
                    {item.description || item.short_description}
                  </Text> */}
                  <Text style={styles.productPrice}>₹{item.price}</Text>
                  <View style={styles.qtyRow}>
                    {currentQty > 0 ? (
                      <>
                        <ButtonWrapper
                          title="-"
                          style={styles.qtyButton}
                          textStyle={styles.qtyButtonText}
                          onPress={() => handleQty(productId, -1, item)}
                        />
                        <Text style={styles.qtyText}>{currentQty}</Text>
                        <ButtonWrapper
                          title="+"
                          style={styles.qtyButton}
                          textStyle={styles.qtyButtonText}
                          onPress={() => handleQty(productId, 1, item)}
                        />
                      </>
                    ) : (
                      <ButtonWrapper
                        title="Add"
                        style={styles.buyNowBtn}
                        textStyle={styles.buyNowText}
                        onPress={() => handleQty(productId, 1, item)}
                      />
                    )}
                  </View>
                </View>
              </View>
            </View>
          );
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  categoryContainer: {
    marginBottom: 12,
  },
  categoryScrollContent: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  cardWrapper: {
    width: '50%',
    alignSelf: 'flex-start',
  },
  productsCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 8,
    marginVertical: 6,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  columnWrapper: {
    paddingHorizontal: 8,
  },
  imageWrap: {
    width: '100%',
    height: 130,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    overflow: 'hidden',
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
    gap: 8,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  productDescription: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  productPrice: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '700',
  },
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  qtyButton: {
    backgroundColor: '#111827',
    width: 30,
    height: 30,
    minWidth: 30,
    minHeight: 30,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  qtyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  qtyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    minWidth: 20,
    textAlign: 'center',
  },
  buyNowBtn: {
    backgroundColor: theme.colors.button,
    width: '100%',
    height: 34,
    minHeight: 34,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  buyNowText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ProductCard;
