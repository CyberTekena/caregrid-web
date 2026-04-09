#!/bin/bash

echo "🚀 Deploying CareGrid to Vercel..."
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if user is logged in
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel:"
    vercel login
fi

# Deploy to production
echo "📦 Deploying to Vercel..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo "🌐 Your app should be live at the URL shown above"
echo ""
echo "📋 Next steps:"
echo "1. Set environment variables in Vercel dashboard if not set automatically"
echo "2. Test the authentication flow"
echo "3. Verify Supabase connection"