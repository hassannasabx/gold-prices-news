import Head from 'next/head';
import { useState, useEffect } from 'react';

export default function Home() {
  const [prices, setPrices] = useState({});
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrices();
    // تحديث الأسعار كل 30 دقيقة
    const interval = setInterval(fetchPrices, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchPrices = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/prices');
      const data = await response.json();
      setPrices(data.prices || {});
    } catch (error) {
      console.error('❌ Error fetching prices:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentPrice = prices[selectedCountry];

  const languages = {
    en: 'English',
    ar: 'العربية',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch',
    it: 'Italiano',
    pt: 'Português',
    ru: 'Русский',
    ja: '日本語',
    zh: '中文',
    ko: '한국어',
    hi: 'हिन्दी',
    tr: 'Türkçe',
    pl: 'Polski',
    nl: 'Nederlands',
  };

  const countries = Object.keys(prices);

  return (
    <>
      <Head>
        <title>Gold Prices Worldwide - أسعار الذهب العالمية</title>
        <meta name="description" content="Live gold prices updated every 30 minutes for all countries and languages" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Gold Prices News" />
        <meta property="og:description" content="Get live gold prices worldwide in multiple languages" />
        <meta name="keywords" content="gold prices, سعر الذهب, preço do ouro, prix de l'or" />
      </Head>

      <div className={`min-h-screen ${language === 'ar' ? 'rtl' : 'ltr'}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
        {/* Header */}
        <header className="bg-gradient-to-r from-gold-600 to-gold-800 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-4xl font-bold">💰 {language === 'ar' ? 'أسعار الذهب العالمية' : 'Gold Prices Worldwide'}</h1>
            <p className="text-gold-200 mt-2">
              {language === 'ar' ? 'تحديث مباشر لأسعار الذهب في جميع ��لدول واللغات' : 'Live prices updated every 30 minutes'}
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Language Selector */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                {language === 'ar' ? 'اللغة' : 'Language'}
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-2 border border-gold-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                {Object.entries(languages).map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Country Selector */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                {language === 'ar' ? 'الدولة' : 'Country'}
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-4 py-2 border border-gold-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {prices[country]?.country || country}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price Display */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin">⏳</div>
              <p className="mt-4">{language === 'ar' ? 'جاري تحميل الأسعار...' : 'Loading prices...'}</p>
            </div>
          ) : currentPrice ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Price Card */}
              <div className="bg-gradient-to-br from-gold-50 to-gold-100 rounded-lg shadow-lg p-6 border-2 border-gold-300">
                <h3 className="text-sm text-gray-600 mb-2">{language === 'ar' ? 'السعر بالأونصة' : 'Price per Ounce'}</h3>
                <p className="text-3xl font-bold text-gold-700">
                  {currentPrice.price} {currentPrice.currency}
                </p>
              </div>

              {/* Price per Gram */}
              <div className="bg-gradient-to-br from-gold-50 to-gold-100 rounded-lg shadow-lg p-6 border-2 border-gold-300">
                <h3 className="text-sm text-gray-600 mb-2">{language === 'ar' ? 'السعر بالجرام' : 'Price per Gram'}</h3>
                <p className="text-3xl font-bold text-gold-700">
                  {currentPrice.pricePerGram} {currentPrice.currency}
                </p>
              </div>

              {/* Change */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg p-6 border-2 border-blue-300">
                <h3 className="text-sm text-gray-600 mb-2">{language === 'ar' ? 'التغيير' : 'Change'}</h3>
                <p className={`text-3xl font-bold ${parseFloat(currentPrice.change) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {parseFloat(currentPrice.change) > 0 ? '📈' : '📉'} {currentPrice.change}%
                </p>
              </div>

              {/* Timestamp */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg shadow-lg p-6 border-2 border-gray-300">
                <h3 className="text-sm text-gray-600 mb-2">{language === 'ar' ? 'آخر تحديث' : 'Last Update'}</h3>
                <p className="text-lg font-semibold text-gray-700">
                  {new Date(currentPrice.timestamp).toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US')}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-12">
              {language === 'ar' ? 'لا توجد بيانات متاحة' : 'No data available'}
            </div>
          )}

          {/* Latest Articles */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6">{language === 'ar' ? 'آخر المقالات' : 'Latest Articles'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Article cards will be rendered here */}
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-gold-500">
                <h3 className="text-lg font-semibold mb-2">
                  {language === 'ar' ? 'المقالات قريباً' : 'Articles Coming Soon'}
                </h3>
                <p className="text-gray-600">
                  {language === 'ar' ? 'سيتم نشر المقالات تلقائياً هنا' : 'Articles will be published automatically here'}
                </p>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white mt-12 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-gray-400">
              {language === 'ar' ? '© 2024 أسعار الذهب العالمية. جميع الحقوق محفوظة' : '© 2024 Gold Prices Worldwide. All rights reserved'}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              {language === 'ar' ? 'تحديث تلقائي كل 30 دقيقة' : 'Updated automatically every 30 minutes'}
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
