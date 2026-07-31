import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

import TextInputWraper from '../component/TextInput';
import React, { useEffect, useState } from 'react';
import Header from '../component/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getProduct } from '../api/productApi/getProductApi';

import ProductCard from '../component/ProductCard';
import { useCart } from '../context/CartContext';
import { StatusBar } from 'react-native';
import { getAllCategories } from '../api/categoriesApi/getAllCategories';
import { FlatList } from 'react-native-gesture-handler';

const OrderScreen = ({ navigation }) => {
  const parent = navigation.getParent()?.getState?.()?.type;
  const isInDrawer = parent === 'drawer';

  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [cartLength, setCartLength] = useState(0);
  const { cartItems, setCartItems, qtyById, setQtyById } = useCart();
  const [productCategories, setProductCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');

  console.log("Selected category ID:", selectedCategoryId);



  const totalItems = cartItems?.length > 0 
    ? cartItems.length 
    : Object.values(qtyById).filter(qty => qty > 0).length;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const getProducts = await getProduct();

        console.log('Response data:', getProducts);

        setData(getProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);


  const fetchCategories = async () => {
    try {
      const categories = await getAllCategories();
     
      setProductCategories(categories);
      console.log('Fetched categories:', categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCartPress = () => {
    navigation.navigate('Cart');
  };


  const filteredProducts = data.filter(item => {
  const matchesSearch =
    searchText === '' ||
    item.name.toLowerCase().includes(searchText.toLowerCase());

  const matchesCategory =
    selectedCategoryId === 'all' ||
    item.category_id == selectedCategoryId;
    console.log('Filtering product:', item.name, 'Category ID:', item.category_id, 'Selected Category ID:', selectedCategoryId, 'Matches Category:', matchesCategory);

  return matchesSearch && matchesCategory;
});


 
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {isInDrawer ? (
        <>
          <View style={{ position: 'relative' }}>
            <Header
              title="Orders"
              navigation={navigation}
              onPress={() => {}}
              // icon="menu"
              // lefticon={() => navigation.openDrawer()}
              // righticon={true}
              // righticonname="add-circle-outline"
              secondBtn={true}
              secondBtnicon="cart-outline"
              secondBtnPress={handleCartPress}
              secondBtnBadge={totalItems}
            />
          </View>
          <View style={styles.searchInputContainer}>
            <TextInputWraper
              placeholder="Search Product"
              onChangeText={setSearchText}
              value={searchText}
              icon="search-outline"
              style={styles.searchInputField}
            />
          </View>
        </>
      ) : (
        <>
          <View style={{ position: 'relative' }}>
            <Header
              title="Orders"
              navigation={navigation}
              icon="arrow-back"
              onPress={() => navigation.navigate('AddUpdate')}
              lefticon={() => navigation.goBack()}
              // righticon={true}
              // righticonname="add-circle-outline"
              secondBtn={true}
              secondBtnicon="cart-outline"
              secondBtnPress={handleCartPress}
              secondBtnBadge={totalItems}
            />
          </View>
          <View style={styles.searchInputContainer}>
            <TextInputWraper
              placeholder="Search Product"
              onChangeText={setSearchText}
              value={searchText}
              icon="search-outline"
              style={styles.searchInputField}
              hideErrorSpace={true}
            />
          </View>
        </>
      )}

      

      <ProductCard
        data={filteredProducts}
        navigation={navigation}
        totalItems={totalItems}
        productCategories={productCategories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
      />


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    transparent: true,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
  },
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
  container: {
    flex: 1,
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
  productPrice: {
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '600',
  },

  footer: {
    width: '90%',
    paddingVertical: 20,
    marginTop: 8,
    alignItems: 'center',
  },
  productDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  footerText: {
    fontSize: 16,
    color: '#888',
  },
  searchInputContainer: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  searchInputField: {
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111827',
    paddingRight: 40,
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

export default OrderScreen;
