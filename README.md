# UNICK E-Commerce Web Application

একটি প্রিমিয়াম, দ্রুতগতির এবং আধুনিক ফুল-ফিচার্ড ই-কমার্স ওয়েব অ্যাপ্লিকেশন (Vite + React + Tailwind CSS + Firestore Realtime Database)।

---

## 🚀 Vercel.com-এ লগইন করে ডিপ্লয় (Deploy) করার সহজ গাইড

এই ওয়েবসাইটটি **Vercel.com**-এ সম্পূর্ণ ফ্রিতে লাইভ হোস্ট করার সব কনফিগারেশন ফাইল (`vercel.json`, `.vercelignore`) ইতিমধ্যে যুক্ত করা হয়েছে।

### পদ্ধতি ১: GitHub ও Vercel.com দিয়ে ডিপ্লয় (সবচেয়ে সহজ ও রিকমেন্ডেড)

১. **কোড ডাউনলোড বা গিটহাবে পুশ করুন:**
   - AI Studio-র উপরের ডানপাশের সেটিংস মেনু থেকে **Export to GitHub** অথবা **Download as ZIP** নির্বাচন করুন।
   - কোডটি আপনার GitHub অ্যাকাউন্টে একটি নতুন Repository হিসেবে আপলোড/পুশ করুন।

২. **Vercel.com-এ লগইন করুন:**
   - ব্রাউজারে [https://vercel.com](https://vercel.com) এ যান।
   - **"Log In"** বাটনে ক্লিক করে আপনার **GitHub** একাউন্ট দিয়ে লগইন করুন।

৩. **প্রজেক্ট ইমপোর্ট করুন:**
   - Vercel ড্যাশবোর্ডে **"Add New..."** বাটনে ক্লিক করে **"Project"** সিলেক্ট করুন।
   - আপনার GitHub Repository-টি লিস্টে দেখতে পাবেন, পাশে থাকা **"Import"** বাটনে ক্লিক করুন।

৪. **সেটিংস ও ডিপ্লয়:**
   - **Framework Preset**: Vercel স্বয়ংক্রিয়ভাবে `Vite` ডিটেক্ট করবে।
   - **Root Directory**: `./` (যেমন আছে তেমনই থাকবে)।
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - এরপর নিচে **"Deploy"** বাটনে ক্লিক করুন!

৫. **🎉 সাইট লাইভ!**
   - ১ মিনিটের মধ্যে আপনার ওয়েবসাইট লাইভ হয়ে যাবে এবং Vercel আপনাকে একটি ফ্রি ডোমেন দেবে (যেমন: `unick-shop.vercel.app`), যাতে ফ্রি SSL এবং হাই-স্পিড CDN যুক্ত থাকবে।

---

### পদ্ধতি ২: Vercel CLI দিয়ে সরাসরি টার্মিনাল থেকে ডিপ্লয়

আপনার কম্পিউটারে টার্মিনাল/কমান্ড প্রম্পট ওপেন করে প্রজেক্ট ফোল্ডারে এই কমান্ডগুলো চালান:

```bash
# Vercel CLI দিয়ে লগইন করুন
npx vercel login

# সরাসরি ডিপ্লয় করুন
npx vercel

# প্রোডাকশন ডোমেনে ডিপ্লয় করতে
npx vercel --prod
```

---

## 🛠️ লোকাল ডেভেলপমেন্ট (Local Development)

```bash
# ডিপেন্ডেন্সি ইন্সটল করুন
npm install

# লোকাল সার্ভার চালু করুন (Port 3000)
npm run dev

# প্রোডাকশন বিল্ড তৈরি করুন
npm run build
```
