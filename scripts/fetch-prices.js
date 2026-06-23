/**
 * fetch-prices.js
 * جلب أسعار الذهب من API مجانية موثوقة
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// قائمة APIs مجانية موثوقة للأسعار
const GOLD_APIs = [
  {
    name: 'metals.live',
    url: 'https://api.metals.live/v1/spot/gold',
    parser: (data) => ({
      usd: data.gold,
      gbp: data.gold,
      eur: data.gold,
      timestamp: new Date().toISOString()
    })
  },
  {
    name: 'ApiMetals',
    url: 'https://www.goldapi.io/api/XAU/USD',
    parser: (data) => ({
      usd: data.price,
      timestamp: data.timestamp
    })
  },
  {
    name: 'Alternative Metals',
    url: 'https://prices.metals.live/v1/spot/gold',
    parser: (data) => ({
      usd: data.gold,
      timestamp: new Date().toISOString()
    })
  }
];

// الدول والعملات الرئيسية
const COUNTRIES = {
  US: { currency: 'USD', code: 'US', name: 'United States' },
  UK: { currency: 'GBP', code: 'UK', name: 'United Kingdom' },
  EU: { currency: 'EUR', code: 'EU', name: 'Europe' },
  AE: { currency: 'AED', code: 'AE', name: 'United Arab Emirates' },
  SA: { currency: 'SAR', code: 'SA', name: 'Saudi Arabia' },
  EG: { currency: 'EGP', code: 'EG', name: 'Egypt' },
  IN: { currency: 'INR', code: 'IN', name: 'India' },
  CN: { currency: 'CNY', code: 'CN', name: 'China' },
  JP: { currency: 'JPY', code: 'JP', name: 'Japan' },
  AU: { currency: 'AUD', code: 'AU', name: 'Australia' },
  CA: { currency: 'CAD', code: 'CA', name: 'Canada' },
  CH: { currency: 'CHF', code: 'CH', name: 'Switzerland' },
  SG: { currency: 'SGD', code: 'SG', name: 'Singapore' },
  HK: { currency: 'HKD', code: 'HK', name: 'Hong Kong' },
  BR: { currency: 'BRL', code: 'BR', name: 'Brazil' },
  MX: { currency: 'MXN', code: 'MX', name: 'Mexico' },
  ZA: { currency: 'ZAR', code: 'ZA', name: 'South Africa' },
  IN: { currency: 'INR', code: 'IN', name: 'India' },
};

// دوال تحويل العملات (سنستخدم معدلات ثابتة تقريباً)
const EXCHANGE_RATES = {
  'USD': 1,
  'GBP': 0.79,
  'EUR': 0.92,
  'AED': 3.67,
  'SAR': 3.75,
  'EGP': 49.0,
  'INR': 83.0,
  'CNY': 7.24,
  'JPY': 149.50,
  'AUD': 1.53,
  'CAD': 1.36,
  'CHF': 0.88,
  'SGD': 1.34,
  'HKD': 7.81,
  'BRL': 4.97,
  'MXN': 17.0,
  'ZAR': 18.5,
};

async function fetchGoldPrice() {
  console.log('🔄 جاري جلب أسعار الذهب...');
  
  let priceData = null;
  
  // محاولة جلب البيانات من عدة مصادر
  for (const api of GOLD_APIs) {
    try {
      console.log(`📡 محاولة من ${api.name}...`);
      const response = await axios.get(api.url, {
        timeout: 5000,
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      });
      
      priceData = api.parser(response.data);
      console.log(`✅ تم الحصول على البيانات من ${api.name}`);
      break;
    } catch (error) {
      console.log(`❌ فشل من ${api.name}: ${error.message}`);
      continue;
    }
  }
  
  if (!priceData) {
    console.error('❌ فشل جلب أسعار الذهب من جميع المصادر');
    return null;
  }
  
  return priceData;
}

async function convertCurrency(usdPrice, targetCurrency) {
  const rate = EXCHANGE_RATES[targetCurrency] || 1;
  return (usdPrice * rate).toFixed(2);
}

async function getPricesForAllCountries(usdPrice) {
  console.log('🌍 حساب الأسعار لجميع الدول...');
  
  const prices = {};
  
  for (const [code, country] of Object.entries(COUNTRIES)) {
    try {
      const price = await convertCurrency(usdPrice, country.currency);
      prices[code] = {
        country: country.name,
        currency: country.currency,
        price: parseFloat(price),
        usdPrice: usdPrice,
        timestamp: new Date().toISOString(),
        pricePerGram: (parseFloat(price) / 31.1035).toFixed(2), // 1 troy ounce = 31.1035 grams
        change: (Math.random() * 2 - 1).toFixed(2), // نسبة التغيير (للتجريب)
      };
    } catch (error) {
      console.error(`❌ خطأ في تحويل العملة ${country.currency}:`, error.message);
    }
  }
  
  return prices;
}

async function saveToFile(prices) {
  const dataDir = path.join(__dirname, '../data');
  
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  const filename = path.join(dataDir, `prices-${new Date().toISOString().split('T')[0]}.json`);
  const latestFile = path.join(dataDir, 'latest-prices.json');
  
  const pricesData = {
    fetchedAt: new Date().toISOString(),
    prices: prices,
  };
  
  fs.writeFileSync(filename, JSON.stringify(pricesData, null, 2));
  fs.writeFileSync(latestFile, JSON.stringify(pricesData, null, 2));
  
  console.log(`✅ تم حفظ البيانات في ${filename}`);
  return pricesData;
}

async function main() {
  try {
    // جلب سعر الذهب بالدولار
    const priceData = await fetchGoldPrice();
    
    if (!priceData) {
      process.exit(1);
    }
    
    const usdPrice = priceData.usd;
    console.log(`💰 سعر الذهب الحالي: $${usdPrice} للأونصة`);
    
    // حساب الأسعار لجميع الدول
    const allPrices = await getPricesForAllCountries(usdPrice);
    
    // حفظ البيانات
    const savedData = await saveToFile(allPrices);
    
    console.log(`\n✨ تم جلب وحفظ أسعار الذهب لـ ${Object.keys(allPrices).length} دول بنجاح!`);
    
    return savedData;
    
  } catch (error) {
    console.error('❌ خطأ في جلب الأسعار:', error.message);
    process.exit(1);
  }
}

// تشغيل البرنامج
main().then(data => {
  console.log('\n📊 ملخص البيانات:');
  console.log(JSON.stringify(data, null, 2));
}).catch(error => {
  console.error('❌ خطأ:', error);
  process.exit(1);
});

module.exports = { fetchGoldPrice, getPricesForAllCountries, COUNTRIES };
