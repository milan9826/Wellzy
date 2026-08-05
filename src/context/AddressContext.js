import { createContext, useContext, useState, useEffect } from 'react';
import { getAddressApi } from '../api/addressApi/getAddressApi';


const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
  const [address, setAddress] = useState(null);

  const fetchAddress = async () => {
    try {
      const response = await getAddressApi();
      setAddress(response.data);
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  useEffect(() => {
    fetchAddress();
  }, []);

  const value = { address, fetchAddress };

  return (
    <AddressContext.Provider value={value}>
      {children}
    </AddressContext.Provider>
  );

}

export const useAddress = () => useContext(AddressContext);


