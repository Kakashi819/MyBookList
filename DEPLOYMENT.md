# MyBookList Deployment Guide

## Frontend Deployment to Netlify

### Prerequisites
1. Create a [Netlify account](https://netlify.com)
2. Install [Netlify CLI](https://docs.netlify.com/cli/get-started/) (optional)

### Method 1: Git-based Deployment (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Connect to Netlify:**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Select the `MyBookList` repository

3. **Configure Build Settings:**
   - Build command: `npm run build:frontend`
   - Publish directory: `apps/frontend/out`
   - Node version: `18`

4. **Set Environment Variables:**
   Go to Site Settings → Environment Variables and add:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.herokuapp.com
   NEXT_PUBLIC_APP_URL=https://your-app-name.netlify.app
   NEXT_PUBLIC_SUPABASE_URL=https://gerrbacxfdcughfbxgpt.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdlcnJiYWN4ZmRjdWdoZmJ4Z3B0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNzQ5NjMsImV4cCI6MjA2Nzk1MDk2M30.J24LZQq6g2DpA46__G3tqvk35Y6kiSzsEb4BhJH6vi8
   NEXT_PUBLIC_APP_NAME=MyBookList
   NEXT_PUBLIC_APP_DESCRIPTION=Discover and track your reading journey
   NEXT_PUBLIC_ENABLE_COMMENTS=true
   NEXT_PUBLIC_ENABLE_ADMIN=true
   ```

### Method 2: Manual Deployment

1. **Build the project locally:**
   ```bash
   npm run build:frontend
   ```

2. **Deploy using Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod --dir=apps/frontend/out
   ```

## Backend Deployment Options

### Option 1: Railway (Recommended)
1. Go to [Railway.app](https://railway.app)
2. Connect your GitHub repository
3. Select the backend folder: `apps/backend`
4. Add environment variables from `apps/backend/.env`

### Option 2: Heroku
1. Create a Heroku app
2. Add the Node.js buildpack
3. Set environment variables
4. Deploy the `apps/backend` directory

### Option 3: DigitalOcean App Platform
1. Create a new app on DigitalOcean
2. Connect your GitHub repository
3. Configure the backend service
4. Add environment variables

## Post-Deployment Steps

1. **Update Supabase URLs:**
   - Go to your Supabase dashboard
   - Update redirect URLs to include your Netlify domain
   - Add your Netlify domain to allowed origins

2. **Update API URLs:**
   - Update `NEXT_PUBLIC_API_URL` in Netlify environment variables
   - Point to your deployed backend URL

3. **Test the deployment:**
   - Visit your Netlify URL
   - Test user registration and login
   - Verify book operations work correctly

## Troubleshooting

### Common Issues:
- **Build fails**: Check Node.js version (should be 18+)
- **API calls fail**: Verify `NEXT_PUBLIC_API_URL` is correct
- **Authentication issues**: Check Supabase redirect URLs
- **Images not loading**: Verify `unoptimized: true` in next.config.js

### Debug Commands:
```bash
# Test local build
npm run build:frontend

# Check for TypeScript errors
npm run lint

# Test production build locally
npm run start
```

## Environment Variables Summary

### Frontend (.env.production)
```
NEXT_PUBLIC_API_URL=https://your-backend-url.herokuapp.com
NEXT_PUBLIC_APP_URL=https://your-app-name.netlify.app
NEXT_PUBLIC_SUPABASE_URL=https://gerrbacxfdcughfbxgpt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Backend (.env)
```
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://your-app-name.netlify.app
SUPABASE_URL=https://gerrbacxfdcughfbxgpt.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
JWT_SECRET=your_jwt_secret
```
