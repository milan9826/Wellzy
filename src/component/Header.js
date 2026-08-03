import React, { useEffect,useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../theme';
import { getProfile } from '../api/getProfile';

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
  secondBtnBadge,
  textValue,
  titleStyle,
}) => {
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchName = async () => {
      try {
        const storedName = await getProfile();
        console.log('storedName in header:', storedName);
        if (storedName) {
          setName(storedName.first_name);
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
              <Text style={{fontSize:24,alignSelf:"center"}}>🛒</Text> 
            {secondBtnBadge > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{secondBtnBadge}</Text>
              </View>
            )}
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
    borderRadius: 18,
    backgroundColor: '#0c0d0e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  seconDBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#dedfe0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: theme.colors.button,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#ffffff',
    zIndex: 10,
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30,
  },
  profileButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignContent: 'center',
  },
  headerTextValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default Header;
