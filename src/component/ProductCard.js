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



const ProductCard = ({
  data = [],
  navigation,
  totalItems,
  productCategories = [],
  selectedCategoryId,
  onSelectCategory,
}) => {
  const { qtyById, handleQty } = useCart();

  const [dummyQtyById, setDummyQtyById] = React.useState({});
  

  const handleCategoryPress = (categoryId) => {
    if (onSelectCategory) {
      onSelectCategory(categoryId);
    } 
   };
   

  const categoriesWithAll = productCategories.length > 0
    ? [{ id: 'all', name: 'All' }, ...productCategories]
    : [];

    const dummyMedicines = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    price: 30,
  },
  {
    id: 2,
    name: "Ibuprofen 400mg",
    price: 45,
  },
  {
    id: 3,
    name: "Amoxicillin 500mg",
    price: 120,
  },
  {
    id: 4,
    name: "Cetirizine 10mg",
    price: 35,
  },
  {
    id: 5,
    name: "Pantoprazole 40mg",
    price: 90,
  },
  {
    id: 6,
    name: "Azithromycin 500mg",
    price: 150,
  },
];

const handleDummyQty = (productId, change, item) => {
  const currentQty = dummyQtyById[productId] || 0;
  const newQty = currentQty + change;

  setDummyQtyById(prev => ({
    ...prev,
    [productId]: newQty
  }));
};


  return (
    <>
      {categoriesWithAll.length > 0 && (
        <View style={styles.categoryContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScrollContent}
          >
            {categoriesWithAll.map(category => {
              const isActive = String(selectedCategoryId) === String(category.id);
              return (
                <TouchableOpacity
                  key={String(category.id)}
                  activeOpacity={0.8}
                  onPress={() => handleCategoryPress(category.id)}
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
        data={data}
        keyExtractor={item => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        numColumns={2}
        removeClippedSubviews={false}
        ListHeaderComponent={
          <View style={styles.dummyContainer}>
            <FlatList
              data={dummyMedicines}
              keyExtractor={item => String(item.id)}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dummyListContent}
              renderItem={({ item }) => (
                <View style={styles.dummyCardWrapper}>
                  <View style={styles.productsCard}>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => navigation.navigate('ProductDetail', { item })}
                    >
                      <View style={styles.imageWrap}>
                        <Image
                          source={require('../images/medicine.jpg')}
                          style={styles.productImage}
                        />
                      </View>
                    </TouchableOpacity>
                    <View style={styles.cardBody}>
                      <Text style={styles.productName} numberOfLines={1}>
                        {item.name || item.title}
                      </Text>
                      <Text style={styles.productPrice}>₹{item.price}</Text>
                      <View style={styles.qtyRow}>
                        {dummyQtyById[item.id] > 0 ? (
                          <>
                            <ButtonWrapper
                              title="-"
                              style={styles.qtyButton}
                              textStyle={styles.qtyButtonText}
                              onPress={() => handleDummyQty(item.id, -1, item)}
                            />
                            <Text style={styles.qtyText}>{dummyQtyById[item.id]}</Text>
                            <ButtonWrapper
                              title="+"
                              style={styles.qtyButton}
                              textStyle={styles.qtyButtonText}
                              onPress={() => handleDummyQty(item.id, 1, item)}
                            />
                          </>
                        ) : (
                          <ButtonWrapper
                            title="Add"
                            style={styles.buyNowBtn}
                            textStyle={styles.buyNowText}
                            onPress={() => handleDummyQty(item.id, 1, item)}
                          />
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              )}
            />
          </View>
        }
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
    {totalItems > 0 && (
      
        <View style={{position:'absolute',bottom:14,width:'90%',alignSelf:'center'}}>
      <ButtonWrapper title={`View Cart (${totalItems})`} style={{backgroundColor:theme.colors.button}}  onPress={() => navigation.navigate('Cart')} />
        </View>)}
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
  dummyContainer: {
    marginBottom: 8,
  },
  dummyListContent: {
    paddingHorizontal: 8,
  },
  dummyCardWrapper: {
    width: 160,
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
    backgroundColor: '#FFFFFF',
    width: 32,
    height: 32,
    minWidth: 32,
    minHeight: 32,
    maxHeight: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  qtyButtonText: {
    color: '#374151',
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 20,
  },
  qtyText: {
    fontSize: 15,
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
