/**
 * generate-articles.js
 * كتابة المقالات تلقائياً بـ AI وترجمتها لجميع اللغات
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

// اللغات المدعومة
const SUPPORTED_LANGUAGES = {
  en: { name: 'English', nativeName: 'English', code: 'en' },
  ar: { name: 'Arabic', nativeName: 'العربية', code: 'ar' },
  es: { name: 'Spanish', nativeName: 'Español', code: 'es' },
  fr: { name: 'French', nativeName: 'Français', code: 'fr' },
  de: { name: 'German', nativeName: 'Deutsch', code: 'de' },
  it: { name: 'Italian', nativeName: 'Italiano', code: 'it' },
  pt: { name: 'Portuguese', nativeName: 'Português', code: 'pt' },
  ru: { name: 'Russian', nativeName: 'Русский', code: 'ru' },
  ja: { name: 'Japanese', nativeName: '日本語', code: 'ja' },
  zh: { name: 'Chinese', nativeName: '中文', code: 'zh' },
  ko: { name: 'Korean', nativeName: '한국어', code: 'ko' },
  hi: { name: 'Hindi', nativeName: 'हिन्दी', code: 'hi' },
  tr: { name: 'Turkish', nativeName: 'Türkçe', code: 'tr' },
  pl: { name: 'Polish', nativeName: 'Polski', code: 'pl' },
  nl: { name: 'Dutch', nativeName: 'Nederlands', code: 'nl' },
};

// قوالب المقالات الذكية
const ARTICLE_TEMPLATES = {
  en: {
    increase: `
Gold Price Surge: {{country}} Sees {{percentage}}% Increase to {{price}} {{currency}}

{{date}} - Gold prices have experienced a significant increase in {{country}}, reaching {{price}} {{currency}} per ounce, representing a {{percentage}}% rise from previous levels.

This increase reflects global market dynamics and investor sentiment towards precious metals. Gold remains a popular hedge against inflation and economic uncertainty.

Key Points:
- Current Price: {{price}} {{currency}}
- Price per Gram: {{pricePerGram}} {{currency}}
- Change: {{percentage}}%
- Global Context: {{globalContext}}

Market Analysis:
The recent uptick in gold prices suggests growing investor confidence in precious metals as a safe haven asset. This trend is particularly notable in {{country}}, where demand for gold remains strong.

Outlook:
Market experts continue to monitor gold prices closely. Investors are advised to consider their investment strategy and risk tolerance when dealing with precious metals.
    `,
    decrease: `
Gold Price Decline: {{country}} Experiences {{percentage}}% Drop to {{price}} {{currency}}

{{date}} - Gold prices have declined in {{country}}, now trading at {{price}} {{currency}} per ounce, down {{percentage}}% from previous levels.

The decline reflects broader market trends and changing economic indicators. Despite the recent drop, gold remains an essential component of diversified investment portfolios.

Key Points:
- Current Price: {{price}} {{currency}}
- Price per Gram: {{pricePerGram}} {{currency}}
- Change: {{percentage}}%
- Global Context: {{globalContext}}

Market Analysis:
The recent price adjustment may present buying opportunities for investors looking to accumulate precious metals at lower prices. Market participants continue to assess the impact on investment strategies.

Outlook:
Experts remain optimistic about long-term gold market fundamentals. The current pricing may offer attractive entry points for new investors.
    `,
    stable: `
Gold Market Stability: {{country}} Maintains Steady Price at {{price}} {{currency}}

{{date}} - Gold prices in {{country}} have remained relatively stable, holding at {{price}} {{currency}} per ounce with minimal fluctuation.

The stability in gold prices demonstrates the market's confidence in the precious metal as a reliable store of value and investment asset.

Key Points:
- Current Price: {{price}} {{currency}}
- Price per Gram: {{pricePerGram}} {{currency}}
- Status: Stable
- Global Context: {{globalContext}}

Market Analysis:
Steady gold prices provide investors with a period of market equilibrium, allowing for strategic decision-making and portfolio adjustments without high volatility.

Outlook:
Market participants remain cautious yet optimistic. The stability provides a good opportunity for investors to evaluate their positions and make informed decisions.
    `
  },
  ar: {
    increase: `
ارتفاع أسعار الذهب: {{country}} تسجل ارتفاع {{percentage}}% إلى {{price}} {{currency}}

{{date}} - شهدت أسعار الذهب في {{country}} ارتفاعاً ملحوظاً، حيث وصلت إلى {{price}} {{currency}} للأونصة، بنسبة ارتفاع {{percentage}}%.

يعكس هذا الارتفاع ديناميكيات السوق العالمية ومشاعر المستثمرين تجاه المعادن الثمينة. يبقى الذهب أداة تحوط شهيرة ضد التضخم وعدم الاستقرار الاقتصادي.

النقاط الرئيسية:
- السعر الحالي: {{price}} {{currency}}
- السعر لكل جرام: {{pricePerGram}} {{currency}}
- نسبة التغيير: {{percentage}}%
- السياق العالمي: {{globalContext}}

تحليل السوق:
يشير الارتفاع الأخير في أسعار الذهب إلى ثقة متزايدة من المستثمرين في المعادن الثمينة كأصول آمنة. هذا الاتجاه ملحوظ بشكل خاص في {{country}} حيث يبقى الطلب على الذهب قوياً.

النظرة المستقبلية:
يواصل خبراء السوق مراقبة أسعار الذهب عن كثب. ينصح المستثمرون بمراعاة استراتيجيتهم الاستثمارية وتحملهم للمخاطر.
    `,
    decrease: `
انخفاض أسعار الذهب: {{country}} تسجل انخفاض {{percentage}}% إلى {{price}} {{currency}}

{{date}} - شهدت أسعار الذهب في {{country}} انخفاضاً، حيث تنخفض الآن إلى {{price}} {{currency}} للأونصة، بانخفاض {{percentage}}%.

يعكس الانخفاض الاتجاهات الأوسع في السوق والمؤشرات الاقتصادية المتغيرة. رغم الانخفاض الأخير، يبقى الذهب عنصراً أساسياً في المحافظ الاستثمارية المتنوعة.

النقاط الرئيسية:
- السعر الحالي: {{price}} {{currency}}
- السعر لكل جرام: {{pricePerGram}} {{currency}}
- نسبة التغيير: {{percentage}}%
- السياق العالمي: {{globalContext}}

تحليل السوق:
قد يمثل التعديل الأخير في الأسعار فرصاً استثمارية للمستثمرين الذين يسعون لتجميع المعادن الثمينة بأسعار أقل. يستمر المشاركون في السوق في تقييم التأثير على الاستراتيجيات الاستثمارية.

النظرة المستقبلية:
يبقى الخبراء متفائلين حول المبادئ الأساسية لسوق الذهب على المدى الطويل. قد توفر الأسعار الحالية نقاط دخول جذابة للمستثمرين الجدد.
    `,
    stable: `
استقرار سوق الذهب: {{country}} تحافظ على سعر مستقر {{price}} {{currency}}

{{date}} - حافظت أسعار الذهب في {{country}} على استقرار نسبي، محتفظة بسعر {{price}} {{currency}} للأونصة مع تذبذب طفيف.

يدل الاستقرار في أسعار الذهب على ثقة السوق في المعدن الثمين كمخزن قيمة وأصل استثماري موثوق.

النقاط الرئيسية:
- السعر الحالي: {{price}} {{currency}}
- السعر لكل جرام: {{pricePerGram}} {{currency}}
- الحالة: مستقرة
- السياق العالمي: {{globalContext}}

تحليل السوق:
توفر أسعار الذهب المستقرة للمستثمرين فترة من توازن السوق، مما يسمح باتخاذ قرارات استراتيجية وتعديل المحفظة بدون تقلبات عالية.

النظرة المستقبلية:
يبقى المشاركون في السوق حذرين لكن متفائلين. يوفر الاستقرار فرصة جيدة للمستثمرين لتقييم مراكزهم واتخاذ قرارات مستنيرة.
    `
  }
};

async function translateText(text, targetLanguage) {
  // استخدام Google Translate API (بدون مفتاح - يعمل محلياً)
  // هذا تطبيق مبسط - في الواقع يمكنك استخدام مكتبة translate-google
  console.log(`📝 ترجمة إلى ${SUPPORTED_LANGUAGES[targetLanguage].nativeName}...`);
  
  try {
    // يمكنك استخدام مكتبة translate-google للترجمة الفعلية
    // npm install translate-google
    // للآن سنعود النص الأصلي كمثال
    return text; // في التطبيق الحقيقي ستترجم هنا
  } catch (error) {
    console.error(`❌ خطأ في الترجمة: ${error.message}`);
    return text;
  }
}

function getArticleTemplate(language, priceChange) {
  const templates = ARTICLE_TEMPLATES[language] || ARTICLE_TEMPLATES.en;
  
  if (priceChange > 1) {
    return templates.increase;
  } else if (priceChange < -1) {
    return templates.decrease;
  } else {
    return templates.stable;
  }
}

function fillTemplate(template, data) {
  let article = template;
  
  for (const [key, value] of Object.entries(data)) {
    article = article.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }
  
  return article.trim();
}

async function generateArticle(priceData, country, language = 'en') {
  console.log(`\n📰 جاري كتابة مقالة عن أسعار الذهب في ${country.name}...`);
  
  const priceChange = parseFloat(priceData.change) || 0;
  const template = getArticleTemplate(language, priceChange);
  
  const articleData = {
    country: priceData.country,
    price: priceData.price,
    currency: priceData.currency,
    pricePerGram: priceData.pricePerGram,
    percentage: Math.abs(priceChange).toFixed(2),
    date: new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : language),
    globalContext: 'Gold prices continue to reflect global economic conditions and investor sentiment towards precious metals.',
  };
  
  let article = fillTemplate(template, articleData);
  
  // ترجمة إذا كانت اللغة ليست الإنجليزية
  if (language !== 'en') {
    article = await translateText(article, language);
  }
  
  return {
    title: `Gold Price Update: ${priceData.country} - ${new Date().toISOString().split('T')[0]}`,
    content: article,
    language: language,
    country: priceData.country,
    price: priceData.price,
    currency: priceData.currency,
    timestamp: new Date().toISOString(),
    slug: `gold-prices-${priceData.country.toLowerCase()}-${new Date().toISOString().split('T')[0]}`,
    tags: ['gold', 'prices', 'precious-metals', priceData.country.toLowerCase(), language],
    seo: {
      description: `Latest gold prices in ${priceData.country}: ${priceData.price} ${priceData.currency}`,
      keywords: `gold prices, ${priceData.country}, ${priceData.currency}, precious metals`,
    }
  };
}

async function generateArticlesForAllCountries(pricesData) {
  console.log('\n🌍 جاري كتابة المقالات لجميع الدول واللغات...');
  
  const articles = [];
  const prices = pricesData.prices || pricesData;
  
  for (const [countryCode, countryData] of Object.entries(prices)) {
    // كتابة مقالة بـ إنجليزي وعربي لكل دولة
    for (const language of ['en', 'ar', 'es', 'fr', 'de']) {
      try {
        const article = await generateArticle(countryData, { name: countryData.country }, language);
        articles.push(article);
      } catch (error) {
        console.error(`❌ خطأ في كتابة مقالة ${countryData.country} بـ ${language}:`, error.message);
      }
    }
  }
  
  return articles;
}

async function saveArticles(articles) {
  const articlesDir = path.join(__dirname, '../articles');
  const indexFile = path.join(articlesDir, 'index.json');
  
  if (!fs.existsSync(articlesDir)) {
    fs.mkdirSync(articlesDir, { recursive: true });
  }
  
  // حفظ كل مقالة في ملف منفصل
  for (const article of articles) {
    const articleFile = path.join(articlesDir, `${article.slug}-${article.language}.json`);
    fs.writeFileSync(articleFile, JSON.stringify(article, null, 2));
  }
  
  // حفظ فهرس المقالات
  const existingArticles = fs.existsSync(indexFile) ? 
    JSON.parse(fs.readFileSync(indexFile, 'utf8')) : [];
  
  const updatedArticles = [...existingArticles, ...articles].slice(-1000); // احتفظ بآخر 1000 مقالة
  
  fs.writeFileSync(indexFile, JSON.stringify({
    total: updatedArticles.length,
    articles: updatedArticles,
    lastUpdated: new Date().toISOString(),
  }, null, 2));
  
  console.log(`✅ تم حفظ ${articles.length} مقالة بنجاح!`);
  
  return {
    count: articles.length,
    saved: true,
    location: articlesDir,
  };
}

async function main() {
  try {
    // جلب آخر أسعار
    const pricesFile = path.join(__dirname, '../data/latest-prices.json');
    
    if (!fs.existsSync(pricesFile)) {
      console.error('❌ لم يتم العثور على ملف الأسعار. يرجى تشغيل fetch-prices.js أولاً');
      process.exit(1);
    }
    
    const pricesData = JSON.parse(fs.readFileSync(pricesFile, 'utf8'));
    
    // كتابة المقالات
    const articles = await generateArticlesForAllCountries(pricesData);
    
    // حفظ المقالات
    const result = await saveArticles(articles);
    
    console.log(`\n✨ تم كتابة وحفظ ${result.count} مقالة بنجاح!`);
    
    return result;
    
  } catch (error) {
    console.error('❌ خطأ في كتابة المقالات:', error.message);
    process.exit(1);
  }
}

// تشغيل البرنامج
main().catch(error => {
  console.error('❌ خطأ:', error);
  process.exit(1);
});

module.exports = { generateArticle, generateArticlesForAllCountries };
