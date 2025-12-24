#!/bin/bash
# Script untuk test auth flow

API_URL="http://localhost:3000"

echo "🧪 Testing Auth Flow"
echo "==================="

# 1. Test Register
echo ""
echo "1️⃣ Testing Register..."
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }')

echo "Response: $REGISTER_RESPONSE"

# Check if registered successfully
if echo "$REGISTER_RESPONSE" | grep -q "Registrasi berhasil"; then
  echo "✅ Register Success"
else
  echo "❌ Register Failed"
fi

# 2. Test Login
echo ""
echo "2️⃣ Testing Login..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }')

echo "Response: $LOGIN_RESPONSE"

if echo "$LOGIN_RESPONSE" | grep -q "token"; then
  echo "✅ Login Success"
else
  echo "❌ Login Failed"
fi

echo ""
echo "==================="
echo "✅ Auth Flow Testing Complete"
