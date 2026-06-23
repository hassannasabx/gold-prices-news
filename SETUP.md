# 🚀 دليل التثبيت والإعداد

هذا الدليل خطوة بخطوة لتشغيل موقع أسعار الذهب العالمي الخاص بك.

## المتطلبات الأساسية

- حساب GitHub (لديك ✅)
- Node.js 18+ (https://nodejs.org)
- حساب Vercel (مجاني): https://vercel.com
- حساب Firebase (مجاني): https://firebase.google.com

## الخطوة 1: الإعداد المحلي

### 1.1 استنسخ المستودع
```bash
git clone https://github.com/hassannasabx/gold-prices-news.git
cd gold-prices-news
```

### 1.2 ثبت المتطلبات
```bash
npm install
```

### 1.3 أنشئ ملف `.env.local`
```bash
cp .env.example .env.local
```

### 1.4 عدل ملف `.env.local` بمفاتيحك
```
METALS_API_KEY=your_key_here
FIREBASE_API_KEY=your_firebase_key
FIREBASE_PROJECT_ID=your_project_id
```

### 1.5 شغّل محلياً
```bash
npm run dev
```

ثم اذهب إلى: http://localhost:3000

## الخطوة 2: إعداد Firebase (قاعدة البيانات المجانية)

### 2.1 اذهب إلى Firebase Console
https://console.firebase.google.com

### 2.2 أنشئ مشروع جديد
- اسم المشروع: `gold-prices-news`
- اختر موقعك

### 2.3 اختر Firestore Database
- اختر **التطوير** (free tier)
- اختر منطقتك

### 2.4 انسخ بيانات الاتصال
- اذهب إلى Settings → Project Settings
- انسخ Web API credentials

## الخطوة 3: إعداد Vercel (الاستضافة المجانية)

### 3.1 اذهب إلى Vercel
https://vercel.com

### 3.2 اتصل حسابك بـ GitHub
- اضغط "Sign Up"
- اختر "Continue with GitHub"
- وافق على الأذونات

### 3.3 استورد المستودع
- اضغط "New Project"
- اختر `gold-prices-news`
- اضغط "Import"

### 3.4 أضف متغيرات البيئة
في Vercel Dashboard:
- اذهب إلى Settings → Environment Variables
- أضف متغيراتك:
  ```
  METALS_API_KEY=your_key
  FIREBASE_API_KEY=your_key
  FIREBASE_PROJECT_ID=your_project_id
  ```

### 3.5 نشّر
اضغط "Deploy" - تم! 🎉

موقعك سيكون متاح على: `https://gold-prices-news.vercel.app`

## الخطوة 4: تفعيل الأتمتة

### 4.1 أضف GitHub Secrets
في GitHub:
- اذهب إلى Settings → Secrets and variables → Actions
- أضف:
  ```
  METALS_API_KEY = your_key
  VERCEL_TOKEN = your_vercel_token
  VERCEL_PROJECT_ID = your_project_id
  ```

### 4.2 الحصول على Vercel Token
- اذهب إلى Vercel → Settings → Tokens
- انسخ token

## الخطوة 5: اختبر الأتمتة

### 5.1 اختبر جلب الأسعار
```bash
npm run fetch-prices
```

### 5.2 اختبر كتابة المقالات
```bash
npm run generate-articles
```

### 5.3 تشغيل يدوي للـ GitHub Actions
- اذهب إلى GitHub Actions
- اختر Workflow: "Update Gold Prices & Publish Articles"
- اضغط "Run workflow"

## المميزات بعد الإعداد

✅ موقع مباشر على الإنترنت
✅ تحديث أسعار كل 30 دقيقة
✅ كتابة مقالات تلقائية
✅ دعم 15 لغة
✅ تغطية عالمية لجميع الدول
✅ محسّن للـ SEO

## استكشاف الأخطاء

### المشكلة: "API Key not found"
**الحل**: تأكد من نسخ API Key إلى `.env.local`

### المشكلة: "Firebase connection error"
**الحل**: تحقق من بيانات Firebase في `.env.local`

### المشكلة: موقع Vercel لا يعمل
**الحل**: 
- تحقق من Deployment Logs في Vercel
- تأكد من أن جميع Environment Variables مضافة

### المشكلة: Workflow لا يعمل
**الحل**:
- اذهب إلى Actions → Workflows
- اختر آخر run وشاهد الأخطاء
- تأكد من أن GitHub Secrets مضافة بشكل صحيح

## الخطوات التالية

1. **تخصيص التصميم**: عدّل `src/components/` حسب ذوقك
2. **إضافة ميزات**: أضف الإحصائيات والرسوم البيانية
3. **تحسين SEO**: أضف Meta Tags وـ Sitemap
4. **الترويج**: شارك الموقع على وسائل التواصل

## التكاليف

| الخدمة | السعر | الملاحظات |
|--------|-------|---------|
| GitHub | مجاني | Public repo |
| Vercel | مجاني | 100GB bandwidth/شهر |
| Firebase | مجاني | 1GB storage, 10GB/شهر reads |
| APIs | مجاني | معظم الـ APIs المستخدمة مجانية |
| **الإجمالي** | **$0** | ✅ 100% مجاني |

## التواصل

إذا واجهت مشكلة:
1. تحقق من README.md
2. افتح Issue في GitHub
3. اسأل في Discussions

---

**استمتع بموقعك! 🎉✨**
