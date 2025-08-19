export interface Store {
  id: string;
  name: string;
  logo: string;
  rating: number;
  category: string;
  description: string;
  features: string[];
  baseUrl: string;
  searchUrl: string;
  isSupported: boolean;
}

export const storeCategories = {
  'E-commerce': [
    {
      id: 'amazon',
      name: 'Amazon India',
      logo: 'https://logoeps.com/wp-content/uploads/2013/03/amazon-vector-logo.png',
      rating: 4.5,
      category: 'E-commerce',
      description: 'Extensive product range with fast delivery',
      features: ['Fast delivery with Amazon Prime', 'Robust customer service', 'Advanced search and recommendation system'],
      baseUrl: 'https://www.amazon.in',
      searchUrl: 'https://www.amazon.in/s?k=',
      isSupported: true
    },
    {
      id: 'flipkart',
      name: 'Flipkart',
      logo: 'https://logos-world.net/wp-content/uploads/2020/11/Flipkart-Logo.png',
      rating: 4.4,
      category: 'E-commerce',
      description: 'Wide variety with exclusive deals',
      features: ['Exclusive deals and sales events', 'Reliable delivery network', 'User-friendly app'],
      baseUrl: 'https://www.flipkart.com',
      searchUrl: 'https://www.flipkart.com/search?q=',
      isSupported: true
    },
    {
      id: 'meesho',
      name: 'Meesho',
      logo: 'https://static.meesho.com/web/images/logos/meesho.svg',
      rating: 4.1,
      category: 'E-commerce',
      description: 'Budget-friendly marketplace',
      features: ['Affordable pricing', 'Wide seller network', 'Social commerce'],
      baseUrl: 'https://www.meesho.com',
      searchUrl: 'https://www.meesho.com/search?q=',
      isSupported: true
    },
    {
      id: 'snapdeal',
      name: 'Snapdeal',
      logo: 'https://logos-world.net/wp-content/uploads/2020/11/Snapdeal-Logo.png',
      rating: 3.8,
      category: 'E-commerce',
      description: 'Diverse categories with competitive pricing',
      features: ['Competitive pricing and discounts', 'Regular flash sales', 'Seller-friendly platform'],
      baseUrl: 'https://www.snapdeal.com',
      searchUrl: 'https://www.snapdeal.com/search?keyword=',
      isSupported: true
    },
    {
      id: 'paytm',
      name: 'Paytm Mall',
      logo: 'https://logos-world.net/wp-content/uploads/2020/11/Paytm-Logo.png',
      rating: 4.0,
      category: 'E-commerce',
      description: 'Digital payments with shopping',
      features: ['Cashback offers', 'Digital wallet integration', 'Mobile recharges'],
      baseUrl: 'https://paytmmall.com',
      searchUrl: 'https://paytmmall.com/shop/search?q=',
      isSupported: true
    }
  ],

  'LifeStyle': [
    {
      id: 'myntra',
      name: 'Myntra',
      logo: 'https://logos-world.net/wp-content/uploads/2020/11/Myntra-Logo.png',
      rating: 4.5,
      category: 'LifeStyle',
      description: 'Leading fashion eCommerce platform',
      features: ['Wide selection of clothing', 'Exclusive brand partnerships', 'Personalized recommendations'],
      baseUrl: 'https://www.myntra.com',
      searchUrl: 'https://www.myntra.com/shop/search?q=',
      isSupported: true
    },
    {
      id: 'ajio',
      name: 'AJIO',
      logo: 'https://logos-world.net/wp-content/uploads/2020/11/Ajio-Logo.png',
      rating: 4.4,
      category: 'LifeStyle',
      description: 'Trendy fashion and apparel',
      features: ['Exclusive brands and designer collaborations', 'Easy returns and exchanges', 'Personalized shopping'],
      baseUrl: 'https://www.ajio.com',
      searchUrl: 'https://www.ajio.com/search/?text=',
      isSupported: true
    },
    {
      id: 'nykaa',
      name: 'Nykaa',
      logo: 'https://logos-world.net/wp-content/uploads/2020/11/Nykaa-Logo.png',
      rating: 4.6,
      category: 'LifeStyle',
      description: 'Beauty and cosmetics specialist',
      features: ['Authentic products guarantee', 'Expert reviews and tutorials', 'Exclusive brands'],
      baseUrl: 'https://www.nykaa.com',
      searchUrl: 'https://www.nykaa.com/search/result/?q=',
      isSupported: true
    },
    {
      id: 'nykaa-fashion',
      name: 'Nykaa Fashion',
      logo: 'https://logos-world.net/wp-content/uploads/2020/11/Nykaa-Logo.png',
      rating: 4.5,
      category: 'LifeStyle',
      description: 'Fashion arm of Nykaa',
      features: ['Curated fashion collections', 'Beauty-fashion combinations', 'Style consultations'],
      baseUrl: 'https://www.nykaafashion.com',
      searchUrl: 'https://www.nykaafashion.com/search?q=',
      isSupported: true
    },
    {
      id: 'tatacliq',
      name: 'TataCLiQ',
      logo: 'https://logos-world.net/wp-content/uploads/2020/11/Tata-CLiQ-Logo.png',
      rating: 4.3,
      category: 'LifeStyle',
      description: 'Premium lifestyle products',
      features: ['Curated premium brands', 'Luxury collections', 'Tata group reliability'],
      baseUrl: 'https://www.tatacliq.com',
      searchUrl: 'https://www.tatacliq.com/search/?text=',
      isSupported: true
    },
    {
      id: 'zara',
      name: 'Zara',
      logo: 'https://logos-world.net/wp-content/uploads/2020/11/Zara-Logo.png',
      rating: 4.7,
      category: 'LifeStyle',
      description: 'International fashion brand',
      features: ['Latest fashion trends', 'Premium quality', 'Global brand presence'],
      baseUrl: 'https://www.zara.com/in',
      searchUrl: 'https://www.zara.com/in/en/search?searchTerm=',
      isSupported: true
    },
    {
      id: 'nike',
      name: 'Nike',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Nike-Logo.png',
      rating: 4.6,
      category: 'LifeStyle',
      description: 'Sports and lifestyle brand',
      features: ['Athletic wear', 'Sports equipment', 'Innovative designs'],
      baseUrl: 'https://www.nike.com/in',
      searchUrl: 'https://www.nike.com/in/w?q=',
      isSupported: true
    },
    {
      id: 'adidas',
      name: 'Adidas',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Adidas-Logo.png',
      rating: 4.5,
      category: 'LifeStyle',
      description: 'Sports and lifestyle brand',
      features: ['Sports apparel', 'Performance gear', 'Iconic three stripes'],
      baseUrl: 'https://www.adidas.co.in',
      searchUrl: 'https://www.adidas.co.in/search?q=',
      isSupported: true
    },
    {
      id: 'lenskart',
      name: 'Lenskart',
      logo: 'https://static.lenskart.com/media/desktop/img/site-images/main_logo.svg',
      rating: 4.4,
      category: 'LifeStyle',
      description: 'Eyewear specialist',
      features: ['Virtual try-on', 'Home eye checkup', 'Wide frame selection'],
      baseUrl: 'https://www.lenskart.com',
      searchUrl: 'https://www.lenskart.com/search?q=',
      isSupported: true
    },
    {
      id: 'decathlon',
      name: 'Decathlon',
      logo: 'https://logos-world.net/wp-content/uploads/2020/11/Decathlon-Logo.png',
      rating: 4.4,
      category: 'LifeStyle',
      description: 'Sports equipment and apparel',
      features: ['Affordable sports gear', 'Wide range of sports', 'Quality equipment'],
      baseUrl: 'https://www.decathlon.in',
      searchUrl: 'https://www.decathlon.in/search?q=',
      isSupported: true
    }
  ],

  'Groceries': [
    {
      id: 'bigbasket',
      name: 'BigBasket',
      logo: 'https://logos-world.net/wp-content/uploads/2020/11/BigBasket-Logo.png',
      rating: 4.3,
      category: 'Groceries',
      description: 'Online grocery delivery',
      features: ['Fresh groceries', 'Scheduled delivery', 'Wide product range'],
      baseUrl: 'https://www.bigbasket.com',
      searchUrl: 'https://www.bigbasket.com/ps/?q=',
      isSupported: true
    },
    {
      id: 'blinkit',
      name: 'Blinkit',
      logo: 'https://logos-world.net/wp-content/uploads/2021/11/Blinkit-Logo.png',
      rating: 4.2,
      category: 'Groceries',
      description: 'Quick grocery delivery',
      features: ['10-minute delivery', 'Fresh products', 'Daily essentials'],
      baseUrl: 'https://blinkit.com',
      searchUrl: 'https://blinkit.com/search?q=',
      isSupported: true
    },
    {
      id: 'zepto',
      name: 'Zepto',
      logo: 'https://d2z0k43lzfi12d.cloudfront.net/web_app/logo.svg',
      rating: 4.1,
      category: 'Groceries',
      description: 'Ultra-fast grocery delivery',
      features: ['10-minute delivery', 'Fresh groceries', 'Quality assurance'],
      baseUrl: 'https://www.zeptonow.com',
      searchUrl: 'https://www.zeptonow.com/search?q=',
      isSupported: true
    },
    {
      id: 'jiomart',
      name: 'JioMart',
      logo: 'https://logos-world.net/wp-content/uploads/2020/11/JioMart-Logo.png',
      rating: 4.0,
      category: 'Groceries',
      description: 'Reliance grocery platform',
      features: ['Competitive pricing', 'Wide coverage', 'Digital integration'],
      baseUrl: 'https://www.jiomart.com',
      searchUrl: 'https://www.jiomart.com/search/',
      isSupported: true
    },
    {
      id: 'dmart',
      name: 'DMart Ready',
      logo: 'https://logos-world.net/wp-content/uploads/2020/11/DMart-Logo.png',
      rating: 4.2,
      category: 'Groceries',
      description: 'DMart online grocery',
      features: ['DMart pricing', 'Quality products', 'Reliable delivery'],
      baseUrl: 'https://www.dmartready.com',
      searchUrl: 'https://www.dmartready.com/search?q=',
      isSupported: true
    }
  ],

  'Food & Drink': [
    {
      id: 'zomato',
      name: 'Zomato',
      logo: 'https://logos-world.net/wp-content/uploads/2020/11/Zomato-Logo.png',
      rating: 4.3,
      category: 'Food & Drink',
      description: 'Food delivery and dining',
      features: ['Restaurant discovery', 'Food delivery', 'Reviews and ratings'],
      baseUrl: 'https://www.zomato.com',
      searchUrl: 'https://www.zomato.com/search?q=',
      isSupported: true
    },
    {
      id: 'swiggy',
      name: 'Swiggy',
      logo: 'https://logos-world.net/wp-content/uploads/2020/11/Swiggy-Logo.png',
      rating: 4.4,
      category: 'Food & Drink',
      description: 'Food delivery platform',
      features: ['Fast delivery', 'Wide restaurant network', 'Live tracking'],
      baseUrl: 'https://www.swiggy.com',
      searchUrl: 'https://www.swiggy.com/search?q=',
      isSupported: true
    },
    {
      id: 'dominos',
      name: "Domino's Pizza",
      logo: 'https://logos-world.net/wp-content/uploads/2020/11/Dominos-Logo.png',
      rating: 4.2,
      category: 'Food & Drink',
      description: 'Pizza delivery chain',
      features: ['30-minute delivery', 'Pizza customization', 'Online ordering'],
      baseUrl: 'https://www.dominos.co.in',
      searchUrl: 'https://www.dominos.co.in/search?q=',
      isSupported: true
    },
    {
      id: 'mcdonalds',
      name: "McDonald's",
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/McDonalds-Logo.png',
      rating: 4.1,
      category: 'Food & Drink',
      description: 'Fast food chain',
      features: ['Quick service', 'Consistent quality', 'Global menu'],
      baseUrl: 'https://www.mcdonalds.com/in',
      searchUrl: 'https://www.mcdonalds.com/in/en-in/search?q=',
      isSupported: true
    },
    {
      id: 'starbucks',
      name: 'Starbucks',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Starbucks-Logo.png',
      rating: 4.5,
      category: 'Food & Drink',
      description: 'Coffee chain',
      features: ['Premium coffee', 'Cozy ambiance', 'Mobile ordering'],
      baseUrl: 'https://www.starbucks.in',
      searchUrl: 'https://www.starbucks.in/search?q=',
      isSupported: true
    },
    {
      id: 'eatsure',
      name: 'EatSure',
      logo: 'https://static.eatsure.com/images/web/eatsure_logo.svg',
      rating: 4.0,
      category: 'Food & Drink',
      description: 'Multi-brand food delivery',
      features: ['Multiple restaurant brands', 'Quality assurance', 'Cloud kitchens'],
      baseUrl: 'https://www.eatsure.com',
      searchUrl: 'https://www.eatsure.com/search?q=',
      isSupported: true
    }
  ],

  'Travel': [
    {
      id: 'makemytrip',
      name: 'MakeMyTrip',
      logo: 'https://logos-world.net/wp-content/uploads/2020/11/MakeMyTrip-Logo.png',
      rating: 4.2,
      category: 'Travel',
      description: 'Complete travel booking',
      features: ['Flight and hotel booking', 'Holiday packages', 'Travel insurance'],
      baseUrl: 'https://www.makemytrip.com',
      searchUrl: 'https://www.makemytrip.com/search?q=',
      isSupported: true
    },
    {
      id: 'goibibo',
      name: 'Goibibo',
      logo: 'https://logos-world.net/wp-content/uploads/2020/11/Goibibo-Logo.png',
      rating: 4.1,
      category: 'Travel',
      description: 'Travel booking platform',
      features: ['Competitive pricing', 'Easy booking', 'Travel deals'],
      baseUrl: 'https://www.goibibo.com',
      searchUrl: 'https://www.goibibo.com/search?q=',
      isSupported: true
    },
    {
      id: 'cleartrip',
      name: 'Cleartrip',
      logo: 'https://logos-world.net/wp-content/uploads/2020/11/Cleartrip-Logo.png',
      rating: 4.3,
      category: 'Travel',
      description: 'Simple travel booking',
      features: ['User-friendly interface', 'Transparent pricing', 'Quick booking'],
      baseUrl: 'https://www.cleartrip.com',
      searchUrl: 'https://www.cleartrip.com/search?q=',
      isSupported: true
    },
    {
      id: 'redbus',
      name: 'RedBus',
      logo: 'https://logos-world.net/wp-content/uploads/2020/11/RedBus-Logo.png',
      rating: 4.4,
      category: 'Travel',
      description: 'Bus booking platform',
      features: ['Extensive bus network', 'Seat selection', 'Live tracking'],
      baseUrl: 'https://www.redbus.in',
      searchUrl: 'https://www.redbus.in/search?q=',
      isSupported: true
    },
    {
      id: 'airbnb',
      name: 'Airbnb',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Airbnb-Logo.png',
      rating: 4.5,
      category: 'Travel',
      description: 'Home stays and experiences',
      features: ['Unique accommodations', 'Local experiences', 'Host community'],
      baseUrl: 'https://www.airbnb.co.in',
      searchUrl: 'https://www.airbnb.co.in/s/',
      isSupported: true
    },
    {
      id: 'booking',
      name: 'Booking.com',
      logo: 'https://logos-world.net/wp-content/uploads/2020/11/Booking.com-Logo.png',
      rating: 4.4,
      category: 'Travel',
      description: 'Global hotel booking',
      features: ['Worldwide hotels', 'Free cancellation', 'Best price guarantee'],
      baseUrl: 'https://www.booking.com',
      searchUrl: 'https://www.booking.com/searchresults.html?ss=',
      isSupported: true
    },
    {
      id: 'ola',
      name: 'Ola',
      logo: 'https://logos-world.net/wp-content/uploads/2020/11/Ola-Logo.png',
      rating: 4.0,
      category: 'Travel',
      description: 'Ride-hailing service',
      features: ['Multiple ride options', 'Safety features', 'Cashless payments'],
      baseUrl: 'https://www.olacabs.com',
      searchUrl: 'https://www.olacabs.com/search?q=',
      isSupported: true
    },
    {
      id: 'uber',
      name: 'Uber',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Uber-Logo.png',
      rating: 4.2,
      category: 'Travel',
      description: 'Global ride-sharing',
      features: ['Reliable rides', 'Multiple categories', 'Real-time tracking'],
      baseUrl: 'https://www.uber.com/in',
      searchUrl: 'https://www.uber.com/in/en/search/?q=',
      isSupported: true
    },
    {
      id: 'rapido',
      name: 'Rapido',
      logo: 'https://logos-world.net/wp-content/uploads/2020/11/Rapido-Logo.png',
      rating: 3.9,
      category: 'Travel',
      description: 'Bike taxi service',
      features: ['Quick bike rides', 'Affordable pricing', 'Traffic beating'],
      baseUrl: 'https://rapido.bike',
      searchUrl: 'https://rapido.bike/search?q=',
      isSupported: true
    }
  ],

  'Entertainment': [
    {
      id: 'bookmyshow',
      name: 'BookMyShow',
      logo: 'https://logos-world.net/wp-content/uploads/2020/11/BookMyShow-Logo.png',
      rating: 4.3,
      category: 'Entertainment',
      description: 'Movie and event booking',
      features: ['Movie tickets', 'Event bookings', 'Live shows'],
      baseUrl: 'https://in.bookmyshow.com',
      searchUrl: 'https://in.bookmyshow.com/explore/search?q=',
      isSupported: true
    },
    {
      id: 'netflix',
      name: 'Netflix',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Netflix-Logo.png',
      rating: 4.6,
      category: 'Entertainment',
      description: 'Video streaming service',
      features: ['Original content', 'Global shows', 'Offline viewing'],
      baseUrl: 'https://www.netflix.com/in',
      searchUrl: 'https://www.netflix.com/in/search?q=',
      isSupported: true
    }
  ],

  'Health & Pharmacy': [
    {
      id: 'netmeds',
      name: 'Netmeds',
      logo: 'https://logos-world.net/wp-content/uploads/2020/11/Netmeds-Logo.png',
      rating: 4.2,
      category: 'Health & Pharmacy',
      description: 'Online pharmacy',
      features: ['Prescription medicines', 'Health products', 'Doctor consultations'],
      baseUrl: 'https://www.netmeds.com',
      searchUrl: 'https://www.netmeds.com/catalogsearch/result/?q=',
      isSupported: true
    },
    {
      id: '1mg',
      name: '1mg',
      logo: 'https://logos-world.net/wp-content/uploads/2020/11/1mg-Logo.png',
      rating: 4.4,
      category: 'Health & Pharmacy',
      description: 'Healthcare platform',
      features: ['Medicine delivery', 'Lab tests', 'Doctor consultations'],
      baseUrl: 'https://www.1mg.com',
      searchUrl: 'https://www.1mg.com/search/all?name=',
      isSupported: true
    },
    {
      id: 'apollo-pharmacy',
      name: 'Apollo Pharmacy',
      logo: 'https://logos-world.net/wp-content/uploads/2020/11/Apollo-Pharmacy-Logo.png',
      rating: 4.3,
      category: 'Health & Pharmacy',
      description: 'Trusted pharmacy chain',
      features: ['Prescription medicines', 'Health checkups', 'Apollo network'],
      baseUrl: 'https://www.apollopharmacy.in',
      searchUrl: 'https://www.apollopharmacy.in/search-medicines/',
      isSupported: true
    },
    {
      id: 'healthkart',
      name: 'HealthKart',
      logo: 'https://logos-world.net/wp-content/uploads/2020/11/HealthKart-Logo.png',
      rating: 4.1,
      category: 'Health & Pharmacy',
      description: 'Health and nutrition products',
      features: ['Supplements', 'Fitness products', 'Nutrition advice'],
      baseUrl: 'https://www.healthkart.com',
      searchUrl: 'https://www.healthkart.com/search?navKey=',
      isSupported: true
    }
  ],

  'Electronics': [
    {
      id: 'samsung',
      name: 'Samsung',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Samsung-Logo.png',
      rating: 4.4,
      category: 'Electronics',
      description: 'Electronics and appliances',
      features: ['Smartphones', 'Home appliances', 'Official warranty'],
      baseUrl: 'https://www.samsung.com/in',
      searchUrl: 'https://www.samsung.com/in/search/?searchvalue=',
      isSupported: true
    },
    {
      id: 'oneplus',
      name: 'OnePlus',
      logo: 'https://logos-world.net/wp-content/uploads/2020/11/OnePlus-Logo.png',
      rating: 4.5,
      category: 'Electronics',
      description: 'Premium smartphones',
      features: ['Flagship smartphones', 'Fast charging', 'OxygenOS'],
      baseUrl: 'https://www.oneplus.in',
      searchUrl: 'https://www.oneplus.in/search?q=',
      isSupported: true
    },
    {
      id: 'xiaomi',
      name: 'Mi',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Xiaomi-Logo.png',
      rating: 4.3,
      category: 'Electronics',
      description: 'Xiaomi products',
      features: ['Value for money', 'Ecosystem products', 'MIUI'],
      baseUrl: 'https://www.mi.com/in',
      searchUrl: 'https://www.mi.com/in/search/?keyword=',
      isSupported: true
    },
    {
      id: 'apple',
      name: 'Apple',
      logo: 'https://logos-world.net/wp-content/uploads/2020/04/Apple-Logo.png',
      rating: 4.7,
      category: 'Electronics',
      description: 'Premium Apple products',
      features: ['iPhone', 'Mac', 'iPad', 'Premium ecosystem'],
      baseUrl: 'https://www.apple.com/in',
      searchUrl: 'https://www.apple.com/in/search/',
      isSupported: true
    }
  ],

  'Baby & Kids': [
    {
      id: 'firstcry',
      name: 'FirstCry',
      logo: 'https://logos-world.net/wp-content/uploads/2020/11/FirstCry-Logo.png',
      rating: 4.5,
      category: 'Baby & Kids',
      description: 'Baby and kids products',
      features: ['Baby essentials', 'Toys and games', 'Parenting resources'],
      baseUrl: 'https://www.firstcry.com',
      searchUrl: 'https://www.firstcry.com/search?q=',
      isSupported: true
    }
  ],

  'Gifts & Flowers': [
    {
      id: 'igp',
      name: 'IGP.com',
      logo: 'https://logos-world.net/wp-content/uploads/2020/11/IGP-Logo.png',
      rating: 4.2,
      category: 'Gifts & Flowers',
      description: 'Gifts and flowers delivery',
      features: ['Same day delivery', 'Personalized gifts', 'Occasion-based'],
      baseUrl: 'https://www.igp.com',
      searchUrl: 'https://www.igp.com/search?q=',
      isSupported: true
    },
    {
      id: 'fnp',
      name: 'Ferns N Petals',
      logo: 'https://logos-world.net/wp-content/uploads/2020/11/Ferns-N-Petals-Logo.png',
      rating: 4.3,
      category: 'Gifts & Flowers',
      description: 'Flowers and gifts',
      features: ['Fresh flowers', 'Gift combos', 'Express delivery'],
      baseUrl: 'https://www.fnp.com',
      searchUrl: 'https://www.fnp.com/search?q=',
      isSupported: true
    }
  ],

  'Services': [
    {
      id: 'urban-company',
      name: 'Urban Company',
      logo: 'https://logos-world.net/wp-content/uploads/2020/11/Urban-Company-Logo.png',
      rating: 4.3,
      category: 'Services',
      description: 'Home services platform',
      features: ['Home cleaning', 'Beauty services', 'Repair services'],
      baseUrl: 'https://www.urbancompany.com',
      searchUrl: 'https://www.urbancompany.com/search?q=',
      isSupported: true
    }
  ]
};

export const getAllStores = (): Store[] => {
  const allStores: Store[] = [];
  Object.values(storeCategories).forEach(categoryStores => {
    allStores.push(...categoryStores);
  });
  return allStores;
};

export const getStoresByCategory = (category: string): Store[] => {
  return (storeCategories as any)[category] || [];
};

export const getCategoryNames = (): string[] => {
  return Object.keys(storeCategories);
};
