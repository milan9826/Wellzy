import React from 'react';
import { View, Text, StyleSheet, FlatList, StatusBar } from 'react-native';
import Header from '../component/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import CardWrapper from '../component/CardWrapper';


const BrowseScreen = ({ navigation }) => {
  const parent = navigation.getParent()?.getState?.()?.type;
  const isInDrawer = parent === 'drawer';
  const data = [
    'Personal Care',
    'Skin & cosmetics',
    'Mom & baby',
    'Ayurved&Wellness',
    'Nutrition',
    'Surgical & first aid',
  ];

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

        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          columnWrapperStyle={{
            gap: 8,
            alignItems: 'stretch',
            marginBottom: 0,
          }}
          renderItem={({ item }) => (
            <CardWrapper
              title={item}
              des={false}
              cardStyle={{ flex: 1, marginHorizontal: 0 }}
              stutus={true}
            />
          )}
          contentContainerStyle={{ paddingBottom: 20, gap: 8 }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 40,
  },
});

export default BrowseScreen;
