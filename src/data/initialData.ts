import { Product, Order, StoreSettings } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Smart Fitness Tracker Pro Watch',
    nameBn: 'স্মার্ট ফিটনেস ট্র্যাকার প্রো ওয়াচ',
    slug: 'smart-fitness-tracker-pro-watch',
    category: 'Gadgets',
    price: 1850,
    originalPrice: 2450,
    stock: 25,
    image: '/assets/images/sample-watch.svg',
    rating: 4.8,
    reviewCount: 142,
    isFeatured: true,
    isHot: true,
    isNew: true,
    shortDescription: '1.4 inch HD Curved Screen, Real-time Heart Rate, SpO2, Sleep Tracker, 10 Days Battery Backup, IP68 Waterproof.',
    description: 'This Premium Smart Fitness Tracker Watch is designed for your healthy everyday lifestyle. Features full-touch color display, dynamic heart rate monitoring, multiple sports modes, incoming call notifications, message alerts, and magnetic fast charging.',
    specifications: {
      'Display': '1.4" HD AMOLED Touch Display',
      'Battery Life': 'Up to 10-14 Days Normal Usage',
      'Water Resistance': 'IP68 Waterproof & Sweatproof',
      'Sensors': 'Optical Heart Rate, SpO2, Pedometer',
      'Compatibility': 'Android 6.0+ & iOS 10.0+',
      'Warranty': '6 Months Replacement Warranty'
    },
    colors: ['Midnight Black', 'Slate Gray', 'Navy Blue']
  },
  {
    id: 'prod-2',
    name: 'True Wireless Noise Cancelling Earbuds',
    nameBn: 'ট্রু ওয়্যারলেস নয়েজ ক্যানসেলিং ইয়ারবাডস',
    slug: 'true-wireless-noise-cancelling-earbuds',
    category: 'Electronics',
    price: 1350,
    originalPrice: 1950,
    stock: 30,
    image: '/assets/images/sample-earbuds.svg',
    rating: 4.7,
    reviewCount: 98,
    isFeatured: true,
    isHot: true,
    shortDescription: 'Deep Bass Sound, ENC Noise Reduction Mic, Bluetooth 5.3, 30 Hours Total Playtime with Fast Type-C Case.',
    description: 'Experience crystal clear calls and immersive high-fidelity sound. Low-latency gaming mode ensures zero lag during battle royale gameplay, while touch controls let you control music and calls effortlessly.',
    specifications: {
      'Bluetooth': 'v5.3 Ultra-stable connection',
      'Playtime': '6 Hours single charge (30 Hours with case)',
      'Charging Port': 'USB Type-C Fast Charge',
      'Driver Size': '13mm Titanium Dynamic Drivers',
      'Microphone': 'Dual MEMS with ENC Quad-Mic',
      'Latency': '45ms Ultra Low Latency Gaming Mode'
    },
    colors: ['Pearl White', 'Matte Black']
  },
  {
    id: 'prod-3',
    name: 'Anti-Theft Waterproof Travel Laptop Backpack',
    nameBn: 'অ্যান্টি-থেফট ওয়াটারপ্রুফ ট্রাভেল ল্যাপটপ ব্যাকপ্যাক',
    slug: 'anti-theft-waterproof-travel-laptop-backpack',
    category: 'Bags',
    price: 1450,
    originalPrice: 2100,
    stock: 18,
    image: '/assets/images/sample-backpack.svg',
    rating: 4.9,
    reviewCount: 210,
    isFeatured: true,
    isNew: true,
    shortDescription: 'Accommodates up to 15.6" Laptop, External USB Charging Port, Hidden Anti-Theft Back Pocket, Water-Repellent Oxford Fabric.',
    description: 'The ultimate commuter and travel backpack built with high-density waterproof oxford cloth. Features reinforced ergonomic shoulder straps, multi-layer organized compartments, luggage strap, and hidden security zippers.',
    specifications: {
      'Capacity': '25-30 Liters Spacious Storage',
      'Laptop Compartment': 'Padded for up to 15.6" Laptops',
      'Material': 'Water-Repellent 900D Oxford Fabric',
      'Weight': '0.75 KG Lightweight Design',
      'Features': 'Integrated External USB Charging Port, Anti-theft Pocket'
    },
    colors: ['Charcoal Gray', 'Classic Black', 'Navy Indigo']
  },
  {
    id: 'prod-4',
    name: 'Ultra-Comfort Sport Running Sneakers',
    nameBn: 'আল্ট্রা-কমফোর্ট স্পোর্ট রানিং স্নিকার্স',
    slug: 'ultra-comfort-sport-running-sneakers',
    category: 'Footwear',
    price: 1650,
    originalPrice: 2200,
    stock: 14,
    image: '/assets/images/sample-shoes.svg',
    rating: 4.6,
    reviewCount: 84,
    isFeatured: true,
    shortDescription: 'Shock Absorbing Air-Cushioned Sole, Breathable Flyknit Mesh Upper, Non-Slip Rubber Grip for Gym & Daily Run.',
    description: 'Designed for peak athletic performance and everyday street fashion. Breathable mesh construction keeps feet dry and odor-free, while the contoured responsive foam midsole absorbs impacts smoothly.',
    specifications: {
      'Upper Material': 'Engineered Breathable Flyknit Mesh',
      'Sole Material': 'Shock-Absorbing EVA & Non-slip Rubber',
      'Closure': 'Lace-Up Athletic Fit',
      'Insole': 'Memory Foam Comfort Insole',
      'Recommended Use': 'Running, Gym, Walking, Casual Wear'
    },
    sizes: ['40', '41', '42', '43', '44'],
    colors: ['Flame Orange', 'Triple Black', 'Cool Gray']
  },
  {
    id: 'prod-5',
    name: 'Premium Cotton Casual Button-Down Shirt',
    nameBn: 'প্রিমিয়াম সুতি ক্যাজুয়াল শার্ট',
    slug: 'premium-cotton-casual-button-down-shirt',
    category: 'Fashion',
    price: 890,
    originalPrice: 1250,
    stock: 40,
    image: '/assets/images/sample-shirt.svg',
    rating: 4.7,
    reviewCount: 65,
    isFeatured: false,
    isNew: true,
    shortDescription: '100% Combed Compact Cotton, Soft Hand-feel, Slim & Regular Fit Tailoring, Perfect for Office & Casual Gatherings.',
    description: 'Tailored from breathable 100% fine combed cotton yarn for ultimate comfort in any climate. Pre-washed to prevent shrinkage and color fade. Features neat button placket and reinforced stitching.',
    specifications: {
      'Fabric': '100% Combed Fine Cotton',
      'Fit': 'Slim Fit / Semi-Casual',
      'Pattern': 'Solid Soft Texture',
      'Care': 'Machine Wash Cold, Warm Iron',
      'Origin': 'Made in Bangladesh'
    },
    sizes: ['M (Chest 38)', 'L (Chest 40)', 'XL (Chest 42)', 'XXL (Chest 44)'],
    colors: ['Sky Blue', 'Pure White', 'Navy Blue']
  },
  {
    id: 'prod-6',
    name: 'Flagship Smartphone (128GB / 8GB RAM)',
    nameBn: 'ফ্ল্যাগশিপ স্মার্টফোন (১২৮জিবি / ৮জিবি র‍্যাম)',
    slug: 'flagship-smartphone-128gb-8gb',
    category: 'Electronics',
    price: 24500,
    originalPrice: 28000,
    stock: 8,
    image: '/assets/images/sample-iphone.svg',
    rating: 4.9,
    reviewCount: 175,
    isFeatured: true,
    isHot: true,
    shortDescription: 'Super Retina OLED Display, 50MP AI Triple Camera System, Octa-Core High Performance Chipset, 5000mAh Battery.',
    description: 'Experience cutting-edge smartphone technology with vivid high-refresh rate display, studio-quality HDR cameras, 67W Turbo Flash Charging, and all-day endurance for uninterrupted gaming and entertainment.',
    specifications: {
      'Display': '6.7" Super AMOLED 120Hz FHD+',
      'Processor': 'Octa-Core 5G Gaming Chipset',
      'Rear Camera': '50MP OIS Main + 8MP Ultra-wide + 2MP Macro',
      'Front Camera': '32MP AI Portrait Selfie',
      'Battery': '5000mAh with 67W Fast Charger Included',
      'Warranty': '1 Year Official Brand Warranty'
    },
    colors: ['Deep Purple', 'Space Gray', 'Starlight Silver']
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-1001',
    createdAt: '2026-09-21 14:32',
    customer: {
      fullName: 'Tanvir Ahmed',
      phone: '01712345678',
      address: 'House 42, Road 11, Banani',
      city: 'Dhaka',
      district: 'Dhaka',
      notes: 'Please call before delivery'
    },
    items: [
      {
        productId: 'prod-1',
        name: 'Smart Fitness Tracker Pro Watch',
        price: 1850,
        quantity: 1,
        image: '/assets/images/sample-watch.svg',
        selectedColor: 'Midnight Black'
      }
    ],
    subtotal: 1850,
    deliveryCharge: 60,
    deliveryZone: 'inside',
    discount: 0,
    total: 1910,
    paymentMethod: 'cod',
    status: 'shipped',
    courierName: 'Steadfast Courier',
    courierTrackingCode: 'ST-928371'
  },
  {
    id: 'ORD-1002',
    createdAt: '2026-09-21 17:15',
    customer: {
      fullName: 'Nusrat Jahan',
      phone: '01898765432',
      address: 'GEC Circle, Nasirabad',
      city: 'Chattogram',
      district: 'Chattogram'
    },
    items: [
      {
        productId: 'prod-2',
        name: 'True Wireless Noise Cancelling Earbuds',
        price: 1350,
        quantity: 1,
        image: '/assets/images/sample-earbuds.svg',
        selectedColor: 'Pearl White'
      },
      {
        productId: 'prod-5',
        name: 'Premium Cotton Casual Button-Down Shirt',
        price: 890,
        quantity: 1,
        image: '/assets/images/sample-shirt.svg',
        selectedSize: 'L (Chest 40)'
      }
    ],
    subtotal: 2240,
    deliveryCharge: 120,
    deliveryZone: 'outside',
    discount: 100,
    couponCode: 'SAVE100',
    total: 2260,
    paymentMethod: 'bkash',
    paymentTrxId: '9K28X91M2',
    status: 'processing',
    courierName: 'Pathao Courier',
    courierTrackingCode: 'PTH-55219'
  },
  {
    id: 'ORD-1003',
    createdAt: '2026-09-22 09:20',
    customer: {
      fullName: 'Mehedi Hasan',
      phone: '01655443322',
      address: 'Sector 7, Uttara',
      city: 'Dhaka',
      district: 'Dhaka'
    },
    items: [
      {
        productId: 'prod-3',
        name: 'Anti-Theft Waterproof Travel Laptop Backpack',
        price: 1450,
        quantity: 1,
        image: '/assets/images/sample-backpack.svg',
        selectedColor: 'Charcoal Gray'
      }
    ],
    subtotal: 1450,
    deliveryCharge: 60,
    deliveryZone: 'inside',
    discount: 0,
    total: 1510,
    paymentMethod: 'cod',
    status: 'pending'
  }
];

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: 'UNICK',
  storeTagline: 'Trusted & Genuine Online Shopping',
  phone: '01700-123456',
  whatsappNumber: '+8801700123456',
  email: 'support@unickshop.com',
  address: 'Level 4, Multiplan Centre, New Elephant Road, Dhaka-1205',
  currencySymbol: '৳',
  currencyCode: 'BDT',
  deliveryChargeInside: 60,
  deliveryChargeOutside: 120,
  freeDeliveryThreshold: 3000,
  noticeBarText: '🔥 ক্যাশ অন ডেলিভারি সুবিধা | দ্রুত সারা বাংলাদেশে হোম ডেলিভারি | যেকোনো তথ্যে কল করুন: 01700-123456',
  noticeBarActive: true,
  bkashNumber: '01700123456',
  nagadNumber: '01700123456',
  discountOfferActive: false,
  discountOfferTitle: 'স্পেশাল ডিসকাউন্ট অফার',
  discountOfferSubtitle: 'চেকআউটে কুপন কোড ব্যবহার করে তাৎক্ষণিক ১০০ টাকা অতিরিক্ত ছাড় পান।',
  discountOfferCoupon: 'SAVE100',
  discountOfferAmount: 100
};

export const CATEGORIES = [
  'All',
  'Electronics',
  'Gadgets',
  'Fashion',
  'Bags',
  'Footwear'
];
