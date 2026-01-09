#!/bin/bash
# Production startup script for backend

# Check Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi

echo "🚀 Starting Smart Event Booking System Backend..."
echo "📦 Node version: $(node -v)"
echo "📦 npm version: $(npm -v)"

# Check if we're in the backend directory
if [ ! -f "server.js" ]; then
    echo "❌ Error: server.js not found. Run this script from the backend directory"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📥 Installing dependencies..."
    npm install --production
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found"
    echo "📝 Please create .env file with required variables:"
    echo "   PORT=5000"
    echo "   NODE_ENV=production"
    echo "   JWT_SECRET=your_secret_key"
    echo "   FRONTEND_URL=your_frontend_url"
    exit 1
fi

# Check .env has required variables
if ! grep -q "JWT_SECRET" .env; then
    echo "⚠️  Warning: JWT_SECRET not found in .env"
fi

if ! grep -q "FRONTEND_URL" .env; then
    echo "⚠️  Warning: FRONTEND_URL not found in .env"
fi

echo "✅ All checks passed"
echo ""
echo "🌐 Starting server..."

# Start the server
node server.js
