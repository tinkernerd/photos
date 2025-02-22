# Setup Guide

## 1. Cloudflare R2 Account

1. **Create or Sign In**  
   - Visit [cloudflare.com](https://www.cloudflare.com/).  
   - Either log in with your existing account or create a new one.  

2. **Create an R2 Bucket**  
   - In the left-hand menu, select **R2 Object Storage**.  
   - Click **Create a Bucket**.  
   - Provide a name for the bucket (e.g., `my-bucket`), and leave other settings as default.  
   - Save this bucket name in your `.env` file as `CLOUDFLARE_R2_BUCKET_NAME`.

3. **Bucket Settings**  
   - After creating the bucket, go to **Settings**.  
   - Under **S3 API**, copy the endpoint URL and set it in your `.env` as `CLOUDFLARE_R2_ENDPOINT`.
   - Scroll down to **R2.dev subdomain** (or **Custom domain** if you have one) and enable the appropriate option:  
     - If you do not have a custom domain, select **Allow Access** for the R2.dev subdomain.  
   - Copy this domain URL and save it as `CLOUDFLARE_R2_PUBLIC_URL` in your `.env`.

4. **Configure CORS**  
   - In **Settings**, scroll down to **CORS policy** and click **Add CORS policy**.  
   - Create a policy like the following, then save:
     ```json
     [
       {
         "AllowedOrigins": [
           "http://localhost:3000",
           "YOUR_R2_BUCKET_URL"
         ],
         "AllowedMethods": [
           "GET",
           "HEAD",
           "PUT",
           "POST"
         ],
         "AllowedHeaders": [
           "*"
         ],
         "ExposeHeaders": [],
         "MaxAgeSeconds": 3000
       }
     ]
     ```
     > Replace `YOUR_R2_BUCKET_URL` with your actual R2 bucket or custom domain URL.

5. **Generate API Credentials**  
   - Return to the main **R2** page (using the back arrow).  
   - Next to **Create Bucket**, select **API**.  
   - Click **Manage API Tokens**.  
   - Create a new API Token and name it.  
   - Choose **Admin Read & Write** to allow full bucket and object operations.  
   - Copy the **Access Key ID** and **Secret Access Key** under **Use the following credentials for S3 clients**.  
   - Set these in your `.env` as:
     ```
     CLOUDFLARE_R2_ACCESS_KEY_ID=<Your Access Key ID>
     CLOUDFLARE_R2_SECRET_ACCESS_KEY=<Your Secret Access Key>
     ```

---

## 2. Better Auth

1. Go to the [Better Auth Installation Docs](https://www.better-auth.com/docs/installation).  
2. Generate a **Secret Key** by clicking **Generate Secret**.  
3. Copy the generated secret into your `.env` as:
   ```
   BETTER_AUTH_SECRET=<Your Secret Key>
   ```

---

## 3. Mapbox

1. Follow the [Mapbox token creation guide](https://docs.mapbox.com/help/getting-started/access-tokens/) to generate an access token.  
2. Add it to your `.env`:
   ```
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=<Your Mapbox Token>
   ```

---

## 4. Neon Database

1. Go to [Neon.tech](https://neon.tech/).  
2. Sign up or log in to your account.  
3. Select **New Project** once signed in.  
4. Name your project and database. Choose either AWS or Azure.  
5. Once the project is created, in the left-hand menu, select **NextJS**.  
6. Switch the displayed file to `.env` and copy the **DATABASE_URL**.  
7. Add it to your `.env`:
   ```
   DATABASE_URL=<Your Neon Database URL>
   ```

---

## 5. Vercel Hosting

1. Go to [Vercel](https://vercel.com/).  
2. Log in or sign up for a Vercel account.  
3. Click **Add New** → **Project** (top-right corner).  
4. Select the GitHub repository that contains your project and click **Import**.  
5. In the project setup screen, locate **Environment Variables**.  
   - Copy and paste your `.env` variables into the respective fields.  
6. Deploy your project.

---

## 6. File Changes

Before your final deployment, make sure the domain references within your code are accurate.

1. **Update `image-loader.ts`**  
   - In `image-loader.ts`, update the returned URL to reference your custom domain:
     ```ts
     // image-loader.ts
     return `https://your-domain.com/cdn-cgi/image/${paramsString}/${normalizeSrc(src)}`;
     ```
     > Replace `your-domain.com` with the domain you set as `CLOUDFLARE_R2_PUBLIC_URL` in your `.env`.  

2. **Update `next.config.ts`**  
   - Change the domain in `next.config.ts` to the domain you will use to access the site.

---

## 7. Info Changes in Files

Certain files contain default text or images that you may want to customize to fit your own project:

1. `layout.tsx` (in `src/app`)
2. `footer.tsx` (in `src/app`)
3. `profile-card.tsx` (in `src/app/(home)/_components`)
4. `logo.tsx` (in `src/app/(home)/_components/header`)
5. `mobile-menu.tsx` (in `src/app/(home)/_components/header`)
6. `logo.tsx` (in `src/modules/home/ui/components/header`)
7. `mobile-menu.tsx` (in `src/modules/home/ui/components/header`)

There may be other places throughout the application where you can update text, branding, or images. Explore and modify these files as needed to personalize your project.

