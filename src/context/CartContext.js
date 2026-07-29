import { createContext, useContext, useState, useEffect,useCallback } from 'react';
import { getCartApi } from '../api/cartApi/getCartApi';
import { addToCartApi } from '../api/cartApi/addToCartApi';
import { updateCartApi } from '../api/cartApi/updateCartApi';
import { removeCartItemApi } from '../api/cartApi/removeCartitemApi';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [qtyById, setQtyById] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await getCartApi();
      const items = response?.data;
      setCartItems(items);

      const newqty = {};
      items.forEach(item => {
        const pId = item.product_id ;
        const q = Number(item.quantity);
        if (pId) {
          newqty[pId] = q;
        }
      });
      setQtyById(newqty);
    } catch (error) {
      console.log('Error fetching initial cart in CartContext:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQty = async (productId, change) => { 
    try {
      const currentQty = qtyById[productId] || 0;
      const newQty = Math.max(-1, currentQty + change);

      if (currentQty === 0 && newQty > 0) {
        await addToCartApi({
          product_id: productId,
          quantity: newQty,
        });
      } else if (newQty <= 0) {
        await removeCartItemApi(productId);
      } else {
        const res = await updateCartApi(productId, newQty);
        console.log("updateCartApi response:", res);
      }

      setQtyById(prev => {
        if (newQty === 0) {
          const { [productId]: _, ...rest } = prev;
          return rest;
        }
        return { ...prev, [productId]: newQty };
      });

      setCartItems(prev => {
        if (newQty === 0) {
          return prev.filter(item => item.product_id !== productId);
        }
        return prev.map(item => {
          const pId = item.product_id;
          if (pId === productId) {
            return { ...item, quantity: newQty };
          }
          return item;
        });
      });

      await fetchCart();

    } catch (err) {
      console.error("Error updating cart qty:", err);
    }
  };

  const addToCart = item => {
    setCartItems(prev => {
      const idx = prev.findIndex(c => c.id === item.id);
      if (idx !== -1){
        return prev.map((c, i) => (i === idx ? { ...c, qty: item.qty } : c));
      }
      return [...prev, item];
    });
  };

  const removeFromCart =targetId => {
    setCartItems(prev =>
      prev.filter(item => item.product_id !== targetId)
    );
    setQtyById(prev => {
      const { [targetId]: x, ...rest } = prev;
      return rest;
    });
  };

  return (
    <CartContext.Provider
      value={{ cartItems, setCartItems, addToCart, qtyById, handleQty, removeFromCart, fetchCart, loading }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);