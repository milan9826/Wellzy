import React,{useState,useEffect} from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar } from 'react-native';
import Header from '../component/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import CardWrapper from '../component/CardWrapper';
import { getAllCategories } from '../api/categoriesApi/getAllCategories';


const BrowseScreen = ({ navigation }) => {
  const parent = navigation.getParent()?.getState?.()?.type;
  const isInDrawer = parent === 'drawer';
  const [data, setData] = useState([]);
  // const data = [
  //   'Personal Care',
  //   'Skin & cosmetics',
  //   'Mom & baby',
  //   'Ayurveda&Wellness',
  //   'Nutrition',
  //   'Surgical & first aid',
  // ];
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await getAllCategories();
        setData(categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);
 console.log('Fetched categories:', data);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff',transparent: true }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {isInDrawer ? (
        <Header
          title="Categories"
          navigation={navigation}
          // icon="menu"
          // lefticon={() => navigation.openDrawer()}
        />
      ) : (
        <Header
          title="Categories"
          navigation={navigation}
          icon="arrow-back"
          lefticon={() => navigation.goBack()}
        />
      )}

      {/* <Text style={{ fontSize: 24, marginLeft: 20, paddingVertical: 8 }}>
        Categories
      </Text> */}
      <View
        style={{ flex: 1, width: '90%', alignSelf: 'center', marginTop: -4 }}
      >
        <CardWrapper
          title="Medicines & otc"
          des={true}
          content="Scan or speak to order"
          backgroundColor="#E6F4EA"
          borderColor="#D1E8D3"
        />
        <View style={{ height: 8 }} />
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          verticalScrollIndicator={false}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item }) => (
            <View style={styles.gridItem}>
              <CardWrapper
                title={item.name}
                des={false}
                cardStyle={styles.categoryCard}
                // stutus={true}
                cardTitleStyle={styles.categoryCardTitle}
              />
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  columnWrapper: {
    gap: 8,
    marginBottom: 0,
  },
  listContent: {
    paddingBottom: 20,
    gap: 8,
  },
  gridItem: {
    flex: 1/2,
  },
  categoryCard: {
    width: '100%',
    marginTop: 0,
    marginHorizontal: 0,
    minHeight: 86,
    justifyContent: 'center',
  },
  categoryCardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
  },
});

export default BrowseScreen;
