import React from 'react';
import { View, Text,StyleSheet } from 'react-native';
import Header from '../component/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';
const OrderTracking = () => {

    return(
        <SafeAreaView style={styles.container}>
            <Header title="Order Tracking" lefticon={() => navigation.goBack()} icon="arrow-back" />
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <Text style={styles.label} >Order #12345 </Text>
            </View>
        </SafeAreaView>
    )


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 20,
        color:theme.colors.label,
    }
});

export default OrderTracking;