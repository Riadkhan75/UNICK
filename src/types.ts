export type PageView =
  | 'home'
  | 'product'
  | 'checkout'
  | 'order-success'
  | 'track-order'
  | 'all-products'
  | 'admin';

export type AdminTab = 'dashboard' | 'products' | 'orders' | 'settings';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Product {
  id: string;
  name: string;
  nameBn?: string;
  slug: string;
  category: string;
  price: number;
  originalPrice: number;
  stock: number;
  image: string;
  additionalImages?: string[];
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  isHot?: boolean;
  isNew?: boolean;
  shortDescription: string;
  description: string;
  specifications: Record<string, string>;
  colors?: string[];
  sizes?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selectedColor?: string;
  selectedSize?: string;
}

export interface OrderCustomer {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  district?: string;
  notes?: string;
}

export interface Order {
  id: string; // e.g. ORD-1001
  createdAt: string;
  customer: OrderCustomer;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  deliveryZone: 'inside' | 'outside';
  discount: number;
  couponCode?: string;
  total: number;
  paymentMethod: 'cod' | 'bkash' | 'nagad';
  paymentTrxId?: string;
  status: OrderStatus;
  courierName?: string;
  courierTrackingCode?: string;
}

export interface StoreSettings {
  storeName: string;
  storeTagline: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  currencySymbol: string;
  currencyCode: string;
  deliveryChargeInside: number;
  deliveryChargeOutside: number;
  freeDeliveryThreshold: number;
  noticeBarText: string;
  noticeBarActive: boolean;
  bkashNumber: string;
  nagadNumber: string;
  adminPin?: string;
  discountOfferActive?: boolean;
  discountOfferTitle?: string;
  discountOfferSubtitle?: string;
  discountOfferCoupon?: string;
  discountOfferAmount?: number;
}
