# 🚀 Setup Guide - Renaiss Card DNA

Complete step-by-step instructions to run the project locally.

---

## 📋 Prerequisites

Before you begin, make sure you have:

- **Python 3.9+** installed ([python.org](https://www.python.org/downloads/))
- **Node.js 18+** and npm installed ([nodejs.org](https://nodejs.org/))
- **Git** (optional, for version control)

Check your versions:
```bash
python --version  # Should be 3.9 or higher
node --version    # Should be 18 or higher
npm --version
```

---

## 🔧 Step 1: Download the Project

If you have the project as a zip file:
```bash
unzip renaiss-card-dna.zip
cd renaiss-card-dna
```

Or clone from Git:
```bash
git clone <repository-url>
cd renaiss-card-dna
```

---

## 🐍 Step 2: Setup Backend (FastAPI)

### Navigate to backend folder
```bash
cd backend
```

### Install Python dependencies

**On macOS/Linux:**
```bash
pip3 install -r requirements.txt
```

**On Windows:**
```bash
pip install -r requirements.txt
```

**If you get permission errors**, use:
```bash
pip install -r requirements.txt --break-system-packages
```

### Start the backend server
```bash
python main.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
```

✅ **Backend is running!**

Test it by visiting: http://localhost:8000

You should see:
```json
{
  "status": "active",
  "service": "Renaiss Card DNA API",
  "version": "1.0.0"
}
```

**Keep this terminal open** - the backend needs to keep running.

---

## ⚛️ Step 3: Setup Frontend (Next.js)

Open a **NEW terminal window** (keep the backend running in the first one).

### Navigate to frontend folder
```bash
cd frontend
```

### Install Node dependencies
```bash
npm install
```

This will take 1-2 minutes to download all packages.

### Start the development server
```bash
npm run dev
```

You should see:
```
- ready started server on 0.0.0.0:3000
- Local:   http://localhost:3000
```

✅ **Frontend is running!**

---

## 🎉 Step 4: Open the App

Open your browser and go to:
```
http://localhost:3000
```

You should see the **Renaiss Card DNA** homepage!

---

## 🧪 Testing the Application

### Test 1: Card Analyzer
1. Click **"Analyze a Card →"** on the homepage
2. Select any card from the dropdown (e.g., "Cyber Samurai")
3. Click **"Analyze DNA"**
4. You should see a complete DNA profile with Visual, Behavioral, and Market DNA

### Test 2: Collector Profiler
1. Click **"Check My Profile"** on the homepage
2. Enter any wallet address (e.g., `alice.eth` or `collector_001`)
3. Click **"Analyze My DNA"**
4. You should see your collector profile and personalized recommendations

---

## 🔍 Troubleshooting

### Backend won't start

**Problem:** `ModuleNotFoundError: No module named 'fastapi'`

**Solution:** Make sure you're in the `backend/` folder and run:
```bash
pip install -r requirements.txt --break-system-packages
```

---

**Problem:** `Port 8000 is already in use`

**Solution:** Kill the process using port 8000:

*On macOS/Linux:*
```bash
lsof -ti:8000 | xargs kill -9
```

*On Windows:*
```bash
netstat -ano | findstr :8000
taskkill /PID <PID_NUMBER> /F
```

Then restart the backend.

---

### Frontend won't start

**Problem:** `Error: Cannot find module 'next'`

**Solution:** Delete `node_modules` and reinstall:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

**Problem:** `Port 3000 is already in use`

**Solution:** Next.js will automatically try port 3001. Or kill the process:

*On macOS/Linux:*
```bash
lsof -ti:3000 | xargs kill -9
```

*On Windows:*
```bash
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

---

### API requests fail (CORS errors)

**Problem:** Frontend can't connect to backend

**Solution:** Make sure:
1. Backend is running on `http://localhost:8000`
2. Check `frontend/.env.local` has:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
3. Restart the frontend server after changing `.env.local`

---

## 📦 Project Structure

After setup, you should have:

```
renaiss-card-dna/
├── backend/
│   ├── main.py              # ✅ Backend server
│   ├── ai_engine.py         # ✅ AI logic
│   ├── requirements.txt
│   └── __pycache__/         # (auto-generated)
├── frontend/
│   ├── app/                 # ✅ Next.js pages
│   ├── lib/                 # ✅ API client
│   ├── node_modules/        # (auto-generated)
│   ├── .next/               # (auto-generated)
│   ├── .env.local           # ✅ Environment config
│   └── package.json
└── data/
    └── mock_cards.json      # ✅ Sample data
```

---

## 🛠️ Development Tips

### Hot Reload

Both servers support hot reload:
- **Backend**: Restart `python main.py` after code changes
- **Frontend**: Automatically reloads on save (no restart needed)

### View API Documentation

FastAPI provides automatic interactive docs:
```
http://localhost:8000/docs
```

You can test all API endpoints directly in the browser!

### Check Logs

**Backend logs**: Visible in the terminal where you ran `python main.py`

**Frontend logs**: 
- Browser console (F12 → Console tab)
- Terminal where you ran `npm run dev`

---

## 🚢 Deployment (Optional)

### Backend Deployment (e.g., Render, Railway)

1. Push code to GitHub
2. Connect to deployment platform
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Frontend Deployment (e.g., Vercel)

1. Push code to GitHub
2. Connect to Vercel
3. Set root directory: `frontend`
4. Add environment variable: `NEXT_PUBLIC_API_URL=<your-backend-url>`

---

## ✅ Next Steps

Now that you have the project running:

1. **Explore the code**: Check out `backend/ai_engine.py` to see how DNA analysis works
2. **Customize**: Modify colors in `frontend/tailwind.config.ts`
3. **Extend**: Add new features (e.g., card comparison, social discovery)
4. **Deploy**: Share your demo with the world!

---

## 📞 Need Help?

If you're stuck:

1. Check the **Troubleshooting** section above
2. Review error messages carefully
3. Make sure both backend AND frontend are running
4. Check browser console for errors (F12)

---

**Happy Hacking! 🧬**
