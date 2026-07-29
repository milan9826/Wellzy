
import React from 'react';
import { View, Text, FlatList,StyleSheet } from 'react-native';
import Header from '../component/Header';
import ButtonWrapper from '../component/Button';
const YourOrderScreen = ({ navigation }) => {
    const orders = [
        {
            id: 1,
            date: "12 Jun 2026",
            medicines: [
                "Crocin Advance",
                "Telmisartan 40",
                "Vitamin D3"
            ],
            totalAmount: 162,
            status: "Delivered",
        },
        {
            id: 2,
            date: "28 May 2026",
            medicines: [
                "Vitamin D3",
                "Metformin 500"
            ],
            totalAmount: 60,
            status: "Delivered",
        },
        {
            id: 3,
            date: "14 May 2026",
            medicines: [
                "Crocin Advance",
                "Vitamin D3"
            ],
            totalAmount: 56,
            status: "Delivered",
        }
    ];
    return (
        <View>
            <Header title="Your Order" lefticon={() => navigation.goBack()} navigation={navigation} icon="arrow-back" />
            <FlatList
                data={orders}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={{ backgroundColor: '#FFFFFF', borderColor: '#e0e0e0', borderWidth: 1, borderRadius: 16, padding: 16, marginHorizontal: 16, marginTop: 12 }}>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontSize: 16, fontWeight: '600', color: '#8d8d8e' }}> {item.date}</Text>
                            <View style={{backgroundColor:"#d9f7e5",width:80,height:30,justifyContent:"center",alignItems:"center",borderRadius:6}}>
                                <Text style={{ fontSize: 16, fontWeight: '600', color: '#0df055', borderRadius: 6 }}>{item.status}</Text>
                            </View>
                        </View>
                            <View  style={{ flexDirection: 'row', marginTop: 8, }}>

                        {item.medicines.map((medicine, index) => (
                                <Text key={index} style={{ fontSize: 14, color: '#111827', marginLeft: 4 }}>{medicine},</Text>
                            
                        ))}
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginTop: 8 }}> ₹{item.totalAmount}</Text>
                        <ButtonWrapper title="Reorder" onPress={() => navigation.navigate('Cart',{item})} style={styles.reorderBtn} textStyle={styles.reorderText} />
                            </View>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#8d8d8e', marginTop: 8 }}>Report an issue</Text>
                    </View>
                )}
            />
        </View>
    )
}


const styles = StyleSheet.create({

    reorderBtn: {
  width: 110,
  height: 38,
  borderWidth: 1,
  borderColor: '#D9D9D9',
  borderRadius: 14,
  backgroundColor: '#FFFFFF',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 8,
},

reorderText: {
  fontSize: 18,
  fontWeight: '500',
  color: '#222222',
},
})
export default YourOrderScreen;