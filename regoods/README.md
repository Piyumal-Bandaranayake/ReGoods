# ♻️ ReGoods - Premium Thrift Marketplace

A comprehensive full-stack marketplace platform designed for the modern thrifting culture, featuring secure transactions, real-time negotiations, and a premium curated user experience.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [User Roles](#-user-roles)
- [Deployment](#-deployment)
- [License](#-license)

---

## 🌟 Overview

**ReGoods** is a sophisticated peer-to-peer marketplace that bridges the gap between sustainability and premium retail. Built with a focus on trust and user engagement, it enables users to trade pre-owned treasures through a secure, high-performance web interface.

### Key Highlights

- **🎭 Dual Engagement** - Users can seamlessly switch between buying and selling roles.
- **🤝 Dynamic Negotiation** - Integrated "Make Offer" and messaging system for price flexibility.
- **🛡️ Trusted Environment** - Identity verification (NIC) and a robust review/rating system.
- **� Secure Checkout** - Full Stripe integration with automatic PDF receipt generation.
- **📊 Admin Power** - Comprehensive management tools for platform-wide moderation and analytics.
- **✨ Next-Gen UI** - Built with the latest React 19 and Tailwind CSS v4 for a flagship-grade experience.

---

## ✨ Features

### For Buyers

- **� Advanced Search**: Filter by category, price range, and condition.
- **❤️ Wishlist & Cart**: Save items for later or proceed to multi-item checkout.
- **💬 Direct Negotiation**: Chat with sellers and send custom price offers.
- **� Seamless Payments**: Secure transactions via Stripe with multiple payment methods.
- **📄 Instant Documentation**: Download professional PDF receipts for all purchases.
- **⭐ Community Trust**: Rate and review sellers after successful transactions.

### For Sellers

- **� Quick Listing**: Upload high-quality images via Cloudinary and set item details.
- **🏷️ Inventory Management**: Track active listings, mark items as sold, or update details.
- **📈 Offer Management**: Accept, decline, or counter-offer buyer proposals.
- **🆔 Identity Verification**: Gain "Verified" status by submitting NIC for review.
- **💬 Responsive Sales**: Real-time message notifications to never miss a potential buyer.

### For Administrators

- **� Analytics Dashboard**: Monitor platform growth, revenue, and active listings.
- **👥 User Moderation**: Manage user accounts, handle reports, and issue bans for policy violations.
- **� Content Control**: Review and moderate items to maintain platform quality.
- **🚨 Conflict Resolution**: Oversee user reports and resolve disputes effectively.

---

## 🛠️ Tech Stack

### Frontend

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Core**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Utilities**: `classnames`, `date-fns`

### Backend

- **Runtime**: Node.js
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose ODM](https://mongoosejs.com/)
- **Auth**: [NextAuth.js](https://next-auth.js.org/) with JWT Strategy
- **File Handling**: [Cloudinary SDK](https://cloudinary.com/documentation/node_integration)
- **PDF Gen**: [jsPDF](https://github.com/parallax/jsPDF) & `jspdf-autotable`

### Services

- **Payments**: [Stripe API](https://stripe.com/docs/api)
- **Image Hosting**: Cloudinary
- **Hosting**: Vercel (Recommended)

---

## 📁 Project Structure

```text
regoods/
├── src/
│   ├── app/                # Next.js App Router (Pages, Actions, APIs)
│   │   ├── actions/        # Server Actions (Items, Auth, Offers)
│   │   ├── admin/          # Admin Dashboard routes
│   │   ├── api/            # Route Handlers
│   │   └── items/          # Product listing and detail pages
│   ├── components/         # Reusable UI Components
│   │   ├── admin/          # Admin-specific UI
│   │   ├── items/          # Product cards, galleries, forms
│   │   └── layout/         # Navbars, Footers, Modals
│   ├── lib/                # Shared logic and configurations
│   │   ├── models/         # Mongoose Schemas (User, Item, Offer, etc.)
│   │   ├── db.js           # Database connection
│   │   └── stripe.js       # Payment configuration
│   └── public/             # Static assets
├── .env                    # Environment variables
├── next.config.mjs         # Framework configuration
└── package.json            # Dependencies and scripts
```

---

## � Installation

### Prerequisites

- Node.js (v18.17 or higher)
- MongoDB Atlas account
- Cloudinary Developer account
- Stripe Developer account

### Steps

1. **Clone the Repo**

   ```bash
   git clone https://github.com/Piyumal-Bandaranayake/ReGoods.git
   cd ReGoods/regoods
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   (See the [Configuration](#-configuration) section below)

4. **Initialize Dev Server**
   ```bash
   npm run dev
   ```

---

## ⚙️ Configuration

Create a `.env` file in the root directory:

```env
# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/regoods

# NextAuth
NEXTAUTH_SECRET=your_random_32_char_secret
NEXTAUTH_URL=http://localhost:3000

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## 🏃 Running the Application

### Development

```bash
npm run dev
# The app will be available at http://localhost:3000
```

### Production Build

```bash
npm run build
npm start
```

---

## � User Roles

| Role      | Permissions                                              | Dashboard Access          |
| :-------- | :------------------------------------------------------- | :------------------------ |
| **User**  | Browse, buy, list items, negotiate, chat, review.        | Profile/Account Dashboard |
| **Admin** | Moderation, analytics, user management, report handling. | Admin Control Panel       |

---

## 🚀 Deployment

### Deploying to Vercel

1. Push your code to a GitHub repository.
2. Connect the repository to Vercel.
3. Configure the **Environment Variables** in Vercel settings.
4. Vercel will automatically detect the Next.js setup and deploy.

---

## 🛡️ License

This project is licensed under the MIT License.

---

**Developed with ❤️ for the Sustainable Future.**
