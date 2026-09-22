import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  PageView,
  AdminTab,
  Product,
  CartItem,
  Order,
  OrderStatus,
  StoreSettings
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_SETTINGS } from '../data/initialData';
import {
  seedFirestoreIfEmpty,
  subscribeToProducts,
  subscribeToOrders,
  subscribeToSettings,
  saveProductToFirestore,
  updateProductInFirestore,
  deleteProductFromFirestore,
  saveOrderToFirestore,
  updateOrderInFirestore,
  deleteOrderFromFirestore,
  saveSettingsToFirestore,
} from '../firebase/services';
import { isSessionAuthenticated, clearAdminSession } from '../utils/adminAuth';

interface StoreContextType {
  view: PageView;
  setView: (view: PageView) => void;
  selectedProductId: string | null;
  openProduct: (id: string) => void;
  activeOrderId: string | null;
  setActiveOrderId: (id: string | null) => void;
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, color?: string, size?: string) => void;
  quickBuy: (product: Product, quantity?: number, color?: string, size?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, color?: string, size?: string) => void;
  removeFromCart: (productId: string, color?: string, size?: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  orders: Order[];
  placeOrder: (orderData: {
    customer: Order['customer'];
    items: Order['items'];
    subtotal: number;
    deliveryCharge: number;
    deliveryZone: 'inside' | 'outside';
    discount: number;
    couponCode?: string;
    total: number;
    paymentMethod: 'cod' | 'bkash' | 'nagad';
    paymentTrxId?: string;
  }) => Promise<string>;
  updateOrderStatus: (orderId: string, status: OrderStatus, courierName?: string, trackingCode?: string) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (val: boolean) => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
  toast: string | null;
  showToast: (message: string) => void;
  trackingSearchParam: string;
  setTrackingSearchParam: (val: string) => void;
  isFirebaseConnected: boolean;
  customerUser: { name: string; phone?: string; email?: string; photoURL?: string } | null;
  loginCustomer: (userData: { name: string; phone?: string; email?: string; photoURL?: string }) => void;
  logoutCustomer: () => void;
  isCustomerModalOpen: boolean;
  setIsCustomerModalOpen: (open: boolean) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'ecommerce_products_v1',
  ORDERS: 'ecommerce_orders_v1',
  SETTINGS: 'ecommerce_settings_v1',
  CART: 'ecommerce_cart_v1',
  AUTH: 'ecommerce_admin_auth_v1',
  CUSTOMER: 'ecommerce_customer_auth_v1',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [view, setView] = useState<PageView>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [customerUser, setCustomerUser] = useState<{ name: string; phone?: string; email?: string; photoURL?: string } | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [trackingSearchParam, setTrackingSearchParam] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(false);

  const loginCustomer = (userData: { name: string; phone?: string; email?: string; photoURL?: string }) => {
    setCustomerUser(userData);
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOMER, JSON.stringify(userData));
    } catch (e) {
      console.warn('Failed saving customer user', e);
    }
    showToast(`স্বাগতম, ${userData.name}!`);
  };

  const logoutCustomer = () => {
    setCustomerUser(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.CUSTOMER);
    } catch (e) {
      console.warn('Failed removing customer user', e);
    }
    showToast('লগআউট সম্পন্ন হয়েছে');
  };

  // Load from local storage or defaults initially
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return stored ? JSON.parse(stored) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return stored ? JSON.parse(stored) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (
          !parsed.storeName ||
          parsed.storeName === 'NextStore Shop' ||
          parsed.storeName === 'NextStore' ||
          parsed.storeName === 'My Store'
        ) {
          parsed.storeName = 'UNICK';
        }
        return { ...INITIAL_SETTINGS, ...parsed };
      }
      return INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CART);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return isSessionAuthenticated();
  });

  // Sync to local storage for offline resilience
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.warn('Failed saving products to localStorage', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.warn('Failed saving orders to localStorage', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed saving settings to localStorage', e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed saving cart to localStorage', e);
    }
  }, [cart]);

  useEffect(() => {
    if (!isAdminLoggedIn) {
      clearAdminSession();
    }
  }, [isAdminLoggedIn]);

  // Connect Firebase Firestore and set up real-time sync
  useEffect(() => {
    let isMounted = true;

    async function initFirebase() {
      try {
        await seedFirestoreIfEmpty(INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_SETTINGS);
        if (isMounted) {
          setIsFirebaseConnected(true);
        }
      } catch (err) {
        console.warn('Firebase initial seed skipped/failed:', err);
      }
    }

    initFirebase();

    // Listen to real-time Products
    const unsubscribeProducts = subscribeToProducts(
      (remoteProducts) => {
        if (isMounted && remoteProducts.length > 0) {
          setProducts(remoteProducts);
          setIsFirebaseConnected(true);
        }
      },
      () => {
        // Fallback gracefully
      }
    );

    // Listen to real-time Orders
    const unsubscribeOrders = subscribeToOrders(
      (remoteOrders) => {
        if (isMounted) {
          setOrders(remoteOrders);
          setIsFirebaseConnected(true);
        }
      },
      () => {
        // Fallback gracefully
      }
    );

    // Listen to real-time Settings
    const unsubscribeSettings = subscribeToSettings(
      (remoteSettings) => {
        if (isMounted && remoteSettings) {
          setSettings(remoteSettings);
          setIsFirebaseConnected(true);
        }
      },
      () => {
        // Fallback gracefully
      }
    );

    return () => {
      isMounted = false;
      unsubscribeProducts();
      unsubscribeOrders();
      unsubscribeSettings();
    };
  }, []);

  // Toast notification
  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => {
      setToast((prev) => (prev === message ? null : prev));
    }, 3200);
  };

  // Open product details view
  const openProduct = (id: string) => {
    setSelectedProductId(id);
    setView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart actions
  const addToCart = (product: Product, quantity = 1, color?: string, size?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === color &&
          item.selectedSize === size
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, quantity, selectedColor: color, selectedSize: size }];
      }
    });

    showToast(`"${product.name}" যোগ করা হয়েছে!`);
  };

  const quickBuy = (product: Product, quantity = 1, color?: string, size?: string) => {
    addToCart(product, quantity, color, size);
    setView('checkout');
    setIsCartOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateCartQuantity = (productId: string, quantity: number, color?: string, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, color, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (
          item.product.id === productId &&
          item.selectedColor === color &&
          item.selectedSize === size
        ) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string, color?: string, size?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedColor === color &&
            item.selectedSize === size
          )
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Orders
  const placeOrder = async (orderData: {
    customer: Order['customer'];
    items: Order['items'];
    subtotal: number;
    deliveryCharge: number;
    deliveryZone: 'inside' | 'outside';
    discount: number;
    couponCode?: string;
    total: number;
    paymentMethod: 'cod' | 'bkash' | 'nagad';
    paymentTrxId?: string;
  }): Promise<string> => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ORD-${Date.now().toString().slice(-4)}${randomNum.toString().slice(0, 2)}`;
    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}`;

    const newOrder: Order = {
      id: orderId,
      createdAt: formattedDate,
      ...orderData,
      status: 'pending',
      courierName: orderData.deliveryZone === 'inside' ? 'Steadfast Express' : 'Pathao Logistics'
    };

    // Optimistic local state update
    setOrders((prev) => [newOrder, ...prev]);

    // Save to Firestore in real-time
    try {
      await saveOrderToFirestore(newOrder);
    } catch (err) {
      console.warn('Firebase order save error:', err);
    }

    // Deduct stock for items in local state and Firestore
    setProducts((prev) =>
      prev.map((p) => {
        const ordered = orderData.items.find((it) => it.productId === p.id);
        if (ordered) {
          const newStock = Math.max(0, p.stock - ordered.quantity);
          updateProductInFirestore(p.id, { stock: newStock }).catch((e) =>
            console.warn('Firestore stock update warning:', e)
          );
          return { ...p, stock: newStock };
        }
        return p;
      })
    );

    clearCart();
    setActiveOrderId(orderId);
    setView('order-success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast(`অর্ডার #${orderId} সফলভাবে সম্পন্ন হয়েছে!`);
    return orderId;
  };

  const updateOrderStatus = async (
    orderId: string,
    status: OrderStatus,
    courierName?: string,
    trackingCode?: string
  ) => {
    const updates: Partial<Order> = {
      status,
      ...(courierName ? { courierName } : {}),
      ...(trackingCode ? { courierTrackingCode: trackingCode } : {}),
    };

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            ...updates,
          };
        }
        return ord;
      })
    );

    try {
      await updateOrderInFirestore(orderId, updates);
    } catch (err) {
      console.warn('Firebase order status update warning:', err);
    }

    showToast(`অর্ডার #${orderId} স্ট্যাটাস আপডেট: ${status.toUpperCase()}`);
  };

  const deleteOrder = async (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    try {
      await deleteOrderFromFirestore(orderId);
    } catch (err) {
      console.warn('Firebase order delete warning:', err);
    }
    showToast(`অর্ডার #${orderId} ডিলিট করা হয়েছে`);
  };

  // Products CRUD
  const addProduct = async (productData: Omit<Product, 'id'>) => {
    const id = `prod-${Date.now()}`;
    const newProduct: Product = {
      ...productData,
      id,
    };
    setProducts((prev) => [newProduct, ...prev]);

    try {
      await saveProductToFirestore(newProduct);
    } catch (err) {
      console.warn('Firebase product add warning:', err);
    }

    showToast(`পণ্য "${newProduct.name}" সফলভাবে যুক্ত হয়েছে!`);
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );

    try {
      await updateProductInFirestore(id, updates);
    } catch (err) {
      console.warn('Firebase product update warning:', err);
    }

    showToast(`পণ্য আপডেট সফল হয়েছে!`);
  };

  const deleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));

    try {
      await deleteProductFromFirestore(id);
    } catch (err) {
      console.warn('Firebase product delete warning:', err);
    }

    showToast(`পণ্য মুছে ফেলা হয়েছে`);
  };

  const updateSettings = async (newSettings: Partial<StoreSettings>) => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);

    try {
      await saveSettingsToFirestore(merged);
    } catch (err) {
      console.warn('Firebase settings update warning:', err);
    }

    showToast(`স্টোর সেটিংস সেভ করা হয়েছে!`);
  };

  const resetToDefaults = async () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setSettings(INITIAL_SETTINGS);
    setCart([]);

    try {
      await seedFirestoreIfEmpty(INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_SETTINGS);
      for (const p of INITIAL_PRODUCTS) {
        await saveProductToFirestore(p);
      }
      await saveSettingsToFirestore(INITIAL_SETTINGS);
    } catch (err) {
      console.warn('Firebase reset error:', err);
    }

    showToast(`সব ডেটা ডিফল্ট অবস্থায় রিস্টোর করা হয়েছে`);
  };

  return (
    <StoreContext.Provider
      value={{
        view,
        setView,
        selectedProductId,
        openProduct,
        activeOrderId,
        setActiveOrderId,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        cart,
        addToCart,
        quickBuy,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartItemCount,
        isCartOpen,
        setIsCartOpen,
        orders,
        placeOrder,
        updateOrderStatus,
        deleteOrder,
        settings,
        updateSettings,
        resetToDefaults,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        isAdminLoggedIn,
        setIsAdminLoggedIn,
        adminTab,
        setAdminTab,
        toast,
        showToast,
        trackingSearchParam,
        setTrackingSearchParam,
        isFirebaseConnected,
        customerUser,
        loginCustomer,
        logoutCustomer,
        isCustomerModalOpen,
        setIsCustomerModalOpen,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
