# TEEEFLEX Full Automatic Store

## Features
- Dark premium streetwear storefront
- Products, sizes and size-wise stock
- Cart and checkout
- Customer accounts
- Admin dashboard
- PostgreSQL database with Prisma
- Razorpay payment integration structure
- COD orders
- Automatic order records
- Razorpay webhook endpoint
- Inventory-ready schema
- Coupons, reviews and addresses schema

## 1. Install
```bash
npm install
```

## 2. Environment
Copy `.env.example` to `.env` and fill your own values.

## 3. Database
Create a PostgreSQL database, then:
```bash
npm run db:push
npm run db:seed
```

## 4. Run
```bash
npm run dev
```

Open `http://localhost:3000`.

## Product images
Put your T-shirt images inside:
`public/products/`

Use names such as:
`tee-1.webp`, `tee-2.webp`, etc.

## Before going live
1. Configure a production PostgreSQL database.
2. Add your real Razorpay keys in your host's environment variables.
3. Configure the Razorpay webhook URL:
`https://YOUR-DOMAIN/api/webhooks/razorpay`
4. Add authentication.
5. Set one user as ADMIN.
6. Test payments with Razorpay test mode before enabling live mode.

Never put payment secrets directly into frontend code.
