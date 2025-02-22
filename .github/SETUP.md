Below is an example of an **improved README** structure and content that you can merge into your repository (or adapt as needed). The aim is to make the project clearer for contributors and end-users, and to highlight important configuration details. It also includes suggestions for best practices, potential improvements, and instructions for contributing to the project. Feel free to pick and choose what is most relevant for your needs.

---

# Photography Blog

A modern, full-stack photography blog built with **Next.js 15**, **Neon Postgres**, **Drizzle ORM**, **Better Auth**, **Shadcn/ui**, and **Cloudflare R2**. Deployed on **Vercel**.

> **Note:** This repository is based on work by [ECarry](https://github.com/ECarry). As they publish updates, this project will integrate them. If you find any issues, please open an issue or pull request.

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
    1. [Prerequisites](#prerequisites)
    2. [Installation](#installation)
    3. [Environment Variables](#environment-variables)
    4. [Database Setup](#database-setup)
    5. [Initial User Registration](#initial-user-registration)
4. [Cloudflare R2 Setup](#cloudflare-r2-setup)
5. [Better Auth Setup](#better-auth-setup)
6. [Mapbox Setup](#mapbox-setup)
7. [Neon Database Setup](#neon-database-setup)
8. [Vercel Deployment](#vercel-deployment)
9. [File & Domain Configuration](#file--domain-configuration)
10. [Customizing Your Blog](#customizing-your-blog)
11. [Contribution Guidelines](#contribution-guidelines)
12. [License](#license)
13. [Acknowledgments](#acknowledgments)

---

## Features

- **Photo Gallery & Blog:** Showcase your photography work with a clean, modern UI.
- **Admin Dashboard:** Easily manage posts, images, and user profiles.
- **Image Optimization:** Leverages Cloudflare Image Optimization (via R2) and Next.js dynamic image loading.
- **Social Sharing:** Simple endpoints for social previews and embedded metadata.
- **Authentication & Authorization:** Secure sign-in with Better Auth, including protected admin routes.
- **Scalable Database:** Utilizes a serverless Postgres from Neon, managed via Drizzle ORM migrations.

---

## Tech Stack

| **Category**         | **Technology**                                                      |
|----------------------|---------------------------------------------------------------------|
| **Framework**        | [Next.js 15](https://nextjs.org/)                                  |
| **Database**         | [Neon](https://neon.tech/) (Serverless Postgres)                    |
| **ORM**              | [Drizzle](https://orm.drizzle.team/)                               |
| **Authentication**   | [Better Auth](https://better-auth.com/)                            |
| **UI Components**    | [Shadcn/ui](https://ui.shadcn.com/)                                |
| **API Layer**        | tRPC                                     |
| **Storage**          | [Cloudflare R2](https://www.cloudflare.com/products/r2/)           |
| **Deployment**       | [Vercel](https://vercel.com)                                       |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en) 20+
- [bun](https://bun.sh/) (recommended) or npm
- [Neon Database](https://neon.tech/) account
- [Cloudflare R2](https://www.cloudflare.com/products/r2/) bucket and credentials

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/photography-website.git
   cd photography-website
   ```
2. **Install dependencies:**

   ```bash
   bun install
   ```
3. **Start the development server:**

   ```bash
   bun run dev
   ```
   The app should now be running on http://localhost:3000.

### Environment Variables

Create a file named `.env.local` in the root directory and add the following:

```bash
# === DATABASE ===
DATABASE_URL=your_neon_database_url

# === AUTH ===
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000  # Base URL of your app
NEXT_PUBLIC_APP_URL='http://localhost:3000'

# === CLOUDFLARE R2 ===
CLOUDFLARE_R2_ENDPOINT=
CLOUDFLARE_R2_ACCESS_KEY_ID=
CLOUDFLARE_R2_SECRET_ACCESS_KEY=
CLOUDFLARE_R2_BUCKET_NAME=
CLOUDFLARE_R2_PUBLIC_URL=

# === MAPBOX ===
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=
```

Replace placeholder values with your actual credentials.  

### Database Setup

This project uses Drizzle ORM with a Postgres instance (via Neon). Once your environment variables are set up properly:

```bash
bun db:push
```
This command will create or update your schema in the connected Neon database.  

### Initial User Registration

When you first run the application, you’ll need an admin account to manage content and access admin routes. Simply navigate to:

```
http://localhost:3000/sign-up
```
> **Note:** Once the first admin is created, the `/sign-up` route will be disabled to prevent unwanted registrations. Any subsequent sign-up attempts will be redirected to `/sign-in`.

---

## Cloudflare R2 Setup

1. **Create or Sign In**  
   - Go to [Cloudflare](https://www.cloudflare.com/) and create or sign in to your account.

2. **Create an R2 Bucket**  
   - Under **R2 Object Storage**, create a new bucket and name it (e.g., `my-bucket`).

3. **Bucket Settings**  
   - Copy the endpoint URL under **S3 API** → **Endpoint** and set it as `CLOUDFLARE_R2_ENDPOINT`.
   - Enable the R2.dev subdomain or add a custom domain, and set `CLOUDFLARE_R2_PUBLIC_URL` accordingly.

4. **Configure CORS**  
   - Add a CORS policy allowing `http://localhost:3000` (and your production domain if applicable).

5. **Generate API Credentials**  
   - Create a new API token with **Read & Write** privileges.
   - Store **Access Key** and **Secret Key** as `CLOUDFLARE_R2_ACCESS_KEY_ID` and `CLOUDFLARE_R2_SECRET_ACCESS_KEY`.

---

## Better Auth Setup

1. **Generate a Secret Key**  
   - Visit [Better Auth Installation Docs](https://www.better-auth.com/docs/installation) and click **Generate Secret**.
2. **Copy the Key**  
   - Add it to your `.env` as `BETTER_AUTH_SECRET=<Your Secret Key>`.

---

## Mapbox Setup

1. **Generate an Access Token**  
   - Follow [Mapbox's Guide](https://docs.mapbox.com/help/getting-started/access-tokens/) to create a token.
2. **Add to .env**  
   - `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=<Your Mapbox Token>`

---

## Neon Database Setup

1. **Create a Neon Account/Project**  
   - Go to [Neon.tech](https://neon.tech/).
2. **Copy DATABASE_URL**  
   - Once your Postgres instance is created, navigate to **NextJS** in the Neon dashboard.
   - Copy the `.env` snippet and paste into your `.env` as `DATABASE_URL`.

---

## Vercel Deployment

1. **Link to Vercel**  
   - Log into [Vercel](https://vercel.com/), click **Add New → Project**, and import your GitHub repo.
2. **Set Environment Variables**  
   - In the Vercel project settings, add the same environment variables from your `.env.local`.
3. **Deploy**  
   - Click **Deploy**. Vercel will build and host your application at a generated URL (or custom domain if configured).

---

## File & Domain Configuration

1. **`image-loader.ts`**  
   - Make sure your domain references match your deployment. For Cloudflare Image Optimization to work, update the base URL:
   ```ts
   // src/lib/image-loader.ts
   return `https://your-domain.com/cdn-cgi/image/${paramsString}/${normalizeSrc(src)}`;
   ```
   Replace `your-domain.com` with the domain you use (e.g., `example.vercel.app` or `CLOUDFLARE_R2_PUBLIC_URL`).

2. **`next.config.ts`**  
   - Update the `images.domains` array or any custom domain references to align with your deployment domain.

---

## Customizing the Portfolio

Certain files contain default images, text, and branding that you may want to change:

- `src/app/layout.tsx`
- `src/app/footer.tsx`
- `src/app/(home)/_components/profile-card.tsx`
- `src/app/(home)/_components/header/logo.tsx`
- `src/app/(home)/_components/header/mobile-menu.tsx`
- `src/modules/home/ui/components/header/logo.tsx`
- `src/modules/home/ui/components/header/mobile-menu.tsx`

> **Tip:** Search the codebase for placeholder text like “ECarry” or “Photography Blog” to quickly locate branding references and replace them with your own.

---

## Acknowledgments

- [ECarry](https://github.com/ECarry) for the original codebase and continuous updates.
- [Next.js](https://nextjs.org/), [Neon](https://neon.tech/), [Drizzle](https://orm.drizzle.team/), [Better Auth](https://better-auth.com/), [Shadcn/ui](https://ui.shadcn.com/), and [Cloudflare R2](https://www.cloudflare.com/products/r2/) for the awesome tools.

