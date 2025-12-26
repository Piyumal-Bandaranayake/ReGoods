# ♻️ ReGoods - Premium Full-Stack Thrift Marketplace

A state-of-the-art, high-performance marketplace platform designed for the modern thrifting culture. Built with a focus on trust, sustainability, and a premium curated user experience.

---

## 📋 Table of Contents

- [🌟 Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#-tech-stack)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [⚙️ Configuration](#-configuration)
- [🛡️ Security & Trust](#-security--trust)
- [📊 Admin Capabilities](#-admin-capabilities)
- [📄 License](#-license)

---

## 🌟 Overview

**ReGoods** is a sophisticated peer-to-peer marketplace that bridges the gap between sustainability and premium retail. It enables users to trade pre-owned treasures through a secure, high-performance web interface designed with modern aesthetics and seamless interactions.

### Why ReGoods?

- **Premium Aesthetics**: Glassmorphism, smooth transitions, and a curated design system.
- **Trust First**: Identity verification and community-driven rating systems.
- **Dynamic Commerce**: Real-time negotiations and secure Stripe-powered transactions.

---

## ✨ Key Features

### 🛍️ For Buyers

- **Smart Discovery**: Advanced filtering by category, price, and condition.
- **Wishlist & Cart**: Elegant management of potential purchases.
- **Direct Negotiation**: Integrated "Make Offer" system for real-time price flexibility.
- **Secure Checkout**: Full Stripe integration with multi-method payment support.
- **Instant Receipts**: Post-purchase PDF generation for order confirmation.

### 🏷️ For Sellers

- **Fast Listings**: Cloudinary-powered image uploads with automatic optimization.
- **Inventory Control**: Comprehensive dashboard to track, edit, and mark items as sold.
- **Sales Analytics**: View contribution history and track earnings.
- **Reputation System**: Earn trust through verified badges and buyer reviews.

### 🛡️ Admin & Moderation

- **Analytics Hub**: Deep insights into revenue, user growth, and market activity.
- **Automated Reporting**: Export monthly/weekly performance reports as professional PDFs.
- **User Moderation**: Handle user bans, unbans, and account credential management.
- **Content Sanity**: Review reported items and messages to maintain platform integrity.

---

## 🛠️ Tech Stack

### Frontend & Framework

- **Framework**: [Next.js 14.2 (App Router)](https://nextjs.org/)
- **Library**: [React 18.3](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)

### Backend & Database

- **Runtime**: Node.js
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose ODM](https://mongoosejs.com/)
- **Auth**: [NextAuth.js](https://next-auth.js.org/) (JWT Strategy)
- **Mailing**: [Nodemailer](https://nodemailer.com/) for notifications and security.

### Services & Tools

- **Payments**: [Stripe API](https://stripe.com/)
- **Media**: [Cloudinary](https://cloudinary.com/)
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF) & `jspdf-autotable`

---

## 📁 Project Structure

```text
regoods/
├── src/
│   ├── app/                # App Router (Pages, Server Actions, APIs)
│   │   ├── actions/        # Encapsulated Server-side Business Logic
│   │   ├── admin/          # Admin Control Panel
│   │   ├── auth/           # Authentication Flows
│   │   └── items/          # Product Catalog & Details
│   ├── components/         # Reusable UI Components
│   │   ├── admin/          # Specialized Admin Components
│   │   ├── items/          # Items, Grids, and Forms
│   │   └── layout/         # Navigation, Footers, and Overlays
│   ├── lib/                # Core configurations
│   │   ├── models/         # Mongoose Schemas (User, Item, Offer, etc.)
│   │   ├── db.js           # Database Connection
│   │   └── mail.js         # SMTP Email Templates & Logic
│   └── public/             # Static Assets & Images
└── package.json            # Project Metadata & Scripts
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB Instance (Atlas or Local)
- Cloudinary, Stripe, and SMTP (Gmail/SendGrid) accounts

### Installation

1. **Clone the project**

   ```bash
   git clone https://github.com/Piyumal-Bandaranayake/ReGoods.git
   cd ReGoods/regoods
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Initialize development server**
   ```bash
   npm run dev
   ```

---

## ⚙️ Configuration

Create a `.env` file in the root directory and populate it with your credentials:

```env
# Database & Auth
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_32_character_secret
NEXTAUTH_URL=http://localhost:3000

# Cloudinary (Media Hosting)
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

# Stripe (Payments)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Mailing (Nodemailer)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your_email
EMAIL_SERVER_PASSWORD=your_app_password
EMAIL_FROM=noreply@regoods.com
```

---

## 🛡️ Security & Trust

ReGoods implements several layers of security:

- **Identity Verification**: Users must submit NIC verification to gain "Verified" status.
- **Bcrypt Hashing**: Secure password storage using salt rounds.
- **Protected Actions**: Server actions with session validation.
- **Moderation Tools**: Admins can instantly suspend malicious accounts.

---

## 📊 Admin Capabilities

The Admin Dashboard provides a command center for platform control:

- **PDF Report Generation**: Generate detailed weekly or monthly PDFs summarizing sales, user sign-ups, and engagement.
- **User Management**: Search, filter, and manage all users.
- **System Credentials**: Securely generate and email initial credentials for new team members.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Developed with ❤️ by [Piyumal Bandaranayake](https://github.com/Piyumal-Bandaranayake)**
