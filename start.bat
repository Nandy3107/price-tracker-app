@echo off
echo 🚀 Starting Price Tracker Application with WhatsApp Integration
echo.

echo 📁 Starting Backend Server...
cd backend
start "Backend Server" cmd /k "npm run dev"

timeout /t 3 /nobreak > nul

echo 🎨 Starting Frontend Application...
cd ..\frontend
start "Frontend App" cmd /k "npm start"

echo.
echo ✅ Both servers are starting up...
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:3001/api
echo 📱 WhatsApp notifications enabled
echo.
echo 💡 To stop servers, close the respective command windows
pause
