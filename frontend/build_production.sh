#!/bin/bash
# Production build script for Smart Rental Tracker Frontend
# This script is used by Render to build the frontend

echo "🚀 Starting production build for Smart Rental Tracker Frontend..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Build the application
echo "🔨 Building application..."
npm run build

# Verify build output
echo "✅ Build completed successfully!"
echo "📁 Build output location: .next/"
echo "📊 Build size:"
du -sh .next/

echo "🎉 Frontend build ready for deployment!"
