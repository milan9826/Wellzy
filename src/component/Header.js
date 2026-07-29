import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Header = ({
  title,
  navigation,
  onPress,
  icon,
  lefticon,
  righticon,
  righticonname,
  secondBtn,
  secondBtnPress,
  secondBtnicon,
  textValue,
  titleStyle,
}) => {
  const [name, setName] = React.useState('');

  useEffect(() => {
    const fetchName = async () => {
      try {
        const storedName = await AsyncStorage.getItem('name');
        if (storedName) {
          setName(storedName);
        }
      } catch (error) {
        console.log('Error retrieving name from AsyncStorage:', error);
      }
    };
    fetchName();
  }, []);
  //console.log('name in header:', name);

  return (
    <View style={[styles.headerContainer]}>
      <TouchableOpacity style={styles.drawerButton} onPress={lefticon}>
        <Ionicons name={icon} size={24} color="#141212" />
      </TouchableOpacity>
      {lefticon ?(      <Text style={[styles.headerTitle, titleStyle]}>{title}</Text>
      ) : (
        <Text style={[styles.headerTitle,styles.marginLeft,titleStyle]}>{title}</Text>
      )}
      <View style={styles.headerActions}>
        {secondBtn ? (
          <TouchableOpacity style={styles.seconDBtn} onPress={secondBtnPress}>
            <Ionicons name={secondBtnicon} size={24} color="#fff" />
          </TouchableOpacity>
        ) : null}

        {righticon ? (
          <TouchableOpacity style={styles.profileButton} onPress={onPress}>
            {righticonname ? (
              <Ionicons name={righticonname} size={24} color="#fff" />
            ) : (
              <Text style={styles.profileButtonText}>
                {name ? name[0] : 'M'}
              </Text>
            )}
          </TouchableOpacity>
        ) : null}

        {textValue ? (
          <Text style={styles.headerTextValue}>{textValue}</Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    transparent: true,
    height: 60,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    gap: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#151212',
    flex: 1,
  },
  marginLeft: {
    marginLeft:-30,
  },
  drawerButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    left: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 15,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  seconDBtn: {
    width: 35,
    height: 35,
    borderRadius: 15,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30,
  },
  profileButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 3,
    fontWeight: 'bold',
  },
  headerTextValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Header;
