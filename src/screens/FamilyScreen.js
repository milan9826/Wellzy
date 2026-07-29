import { View, StyleSheet, Text, FlatList } from 'react-native';
import Header from '../component/Header';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import ButtonWrapper from '../component/Button';
import FamilyCard from '../component/FamilyCard';

const FamilyScreen = ({ navigation, route }) => {
  const parent = navigation.getParent()?.getState?.()?.type;
  const isInDrawer = parent === 'drawer';
  const [activeButton, setActiveButton] = React.useState('Baskets');

  const reminders = [
    { name: "Dad's BP medicine", due: 'Due in 3 days -Telma 40' },
    {
      name: 'Your vitamin D3',
      due: 'Due tomorrow',
    },
    {
      name: "Mom's thyroid tablets",
      due: 'Due in 8 days',
    },
    { name: "Dad's BP medicine", due: 'Due in 3 days -Telma 40' },
    {
      name: 'Your vitamin D3',
      due: 'Due tomorrow',
    },
    {
      name: "Mom's thyroid tablets",
      due: 'Due in 8 days',
    },
  ];

  const basket = [
    {
      name: 'Dad',
      items: '2 items in basket',
      des: 'Telma 40,Aspirin 75mg',
      subdes: 'Penicillin allergy - Hypertension',
      due: 'Due in 5 days',
      color: '#E6F4EA',
    },
    {
      name: 'Mom',
      items: '3 items in basket',
      des: 'Thyronorm 50,Calcium + D3',
      subdes: 'Hypothyroid - No known allergies',
      due: 'Due in 12 days',
      color: '#f7f5da',
    },
    {
      name: 'Sister',
      items: '2 item in basket',
      des: 'Vitamin C,Iron tablets',
      subdes: 'No known allergies',
      due: 'Due in 20 days',
      color: '#d8c8eb',
    },
  ];

  const footer = () => {
    return (
      <View
        style={{
          marginTop: 20,
          alignItems: 'flex-start',
          paddingHorizontal: 8,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: '#888',
            textAlign: 'flex-start',
            marginBottom: 100,
            marginLeft: 20,
          }}
        >
          Remind me 3 days before each due
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {isInDrawer ? (
        <Header
          title="Family"
          navigation={navigation}
          icon="menu"
          lefticon={() => navigation.openDrawer()}
        />
      ) : (
        <Header
          title="Family"
          navigation={navigation}
          icon="arrow-back"
          lefticon={() => navigation.goBack()}
        />
      )}

      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          marginVertical: 12,
          marginLeft: 18,
        }}
      >
        Family
      </Text>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 30,
          marginVertical: 8,
          gap: 10,
        }}
      >
        {activeButton === 'Baskets' ? (
          <ButtonWrapper
            title="Baskets"
            textStyle={styles.btntextActive}
            style={[styles.btn, { backgroundColor: '#0a7513' }]}
            onPress={() => setActiveButton('Baskets')}
          />
        ) : (
          <ButtonWrapper
            title="Baskets"
            textStyle={styles.btntext}
            style={styles.btn}
            onPress={() => setActiveButton('Baskets')}
          />
        )}
        {activeButton === 'Reminders' ? (
          <ButtonWrapper
            title="Reminders"
            textStyle={styles.btntextActive}
            style={[styles.btn, { backgroundColor: '#0a7513' }]}
            onPress={() => setActiveButton('Reminders')}
          />
        ) : (
          <ButtonWrapper
            title="Reminders"
            textStyle={styles.btntext}
            style={styles.btn}
            onPress={() => setActiveButton('Reminders')}
          />
        )}
      </View>

      {activeButton === 'Baskets' ? (
        <View style={{ flex: 1, width: '100%' }}>
          <FlatList
            data={basket}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <FamilyCard
                name={item.name}
                due={item.due}
                items={item.items}
                des={item.des}
                color={item.color}
                subdes={item.subdes}
                basket={true}
              />
            )}
            contentContainerStyle={{ paddingTop: 8, paddingBottom: 20 }}
          />
        </View>
      ) : (
        <>
          <View style={{ flex: 1, width: '100%' }}>
            <FlatList
              data={reminders}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <FamilyCard name={item.name} due={item.due} />
              )}
              contentContainerStyle={{ paddingTop: 8, paddingBottom: 20 }}
              ListFooterComponent={footer}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    transparent: true,
  },
  btn: {
    backgroundColor: '#d6ded8',
    borderColor: '#D1E8D3',
    borderWidth: 1,
    paddingVertical: 3,
    borderRadius: 8,
    width: '46%',
    alignSelf: 'center',
  },
  btntext: {
    color: '#0f1210',
    fontWeight: '600',
  },
  btntextActive: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default FamilyScreen;
