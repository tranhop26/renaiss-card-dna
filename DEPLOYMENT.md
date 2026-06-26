# 📤 Hướng dẫn Push lên GitHub và Deploy

**Developer**: TRAN DANG HOP  
**Email**: trandanghop2006@gmail.com

---

## 🗂️ Bước 1: Push lên GitHub

### Tạo GitHub Repository

1. Đi tới https://github.com/new
2. Repository name: `renaiss-card-dna`
3. Description: `AI-powered card personality analyzer for Renaiss Hackathon S1`
4. Public repository
5. **KHÔNG** tick "Add README" (vì đã có rồi)
6. Click **"Create repository"**

### Push code lên GitHub

Mở terminal trong folder `renaiss-card-dna` và chạy:

```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Renaiss Card DNA - AI personality analyzer"

# Add remote (thay YOUR_USERNAME bằng username GitHub của bạn)
git remote add origin https://github.com/YOUR_USERNAME/renaiss-card-dna.git

# Push
git branch -M main
git push -u origin main
```

**Lưu ý**: Nếu GitHub yêu cầu login, làm theo hướng dẫn authentication.

---

## 🚀 Bước 2: Deploy Backend (Railway)

### Tại sao Railway?
- Free tier (500 hours/month)
- Tự động detect FastAPI
- Dễ setup

### Các bước deploy:

1. Đi tới https://railway.app
2. Sign up với GitHub account
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Chọn repository `renaiss-card-dna`
5. Railway sẽ auto-detect và deploy

### Lấy Backend URL:

Sau khi deploy xong, Railway sẽ cho bạn URL dạng:
```
https://renaiss-card-dna-production.up.railway.app
```

**Copy URL này** - bạn sẽ cần nó cho frontend!

---

## 🌐 Bước 3: Deploy Frontend (Vercel)

### Tại sao Vercel?
- Miễn phí
- Tự động optimize Next.js
- Deploy trong 30 giây

### Các bước deploy:

1. Đi tới https://vercel.com
2. Sign up với GitHub account
3. Click **"Add New Project"**
4. Import repository `renaiss-card-dna`
5. **QUAN TRỌNG**: 
   - Root Directory: `frontend`
   - Framework Preset: Next.js (auto-detect)
   
6. **Environment Variables**:
   - Thêm biến:
     ```
     NEXT_PUBLIC_API_URL = https://your-railway-url.railway.app
     ```
   - (Thay bằng URL Railway từ Bước 2)

7. Click **"Deploy"**

### Lấy Frontend URL:

Vercel sẽ cho bạn URL dạng:
```
https://renaiss-card-dna.vercel.app
```

---

## 🎥 Bước 4: Record Video Demo

### Tools để record:

**Option 1: Loom** (Recommend - Free)
- Đi tới https://loom.com
- Sign up free
- Click "Record" → Screen + Camera
- Record 2-3 phút

**Option 2: OBS Studio** (Free, professional)
- Download: https://obsproject.com
- Phức tạp hơn nhưng quality cao

### Script gợi ý (2-3 phút):

**Opening (30s)**:
```
"Hi, I'm Hop. This is Renaiss Card DNA - an AI tool that analyzes 
the personality of collectible cards. Unlike traditional tools that 
just show price and rarity, we analyze Visual DNA, Trading Behavior, 
and Market Momentum to help collectors find cards that match their vibe."
```

**Demo (90s)**:
1. **Homepage** (15s): Scroll qua hero section
2. **Card Analyzer** (45s):
   - Click vào Analyzer
   - Select "Cyber Samurai" 
   - Show DNA profile
   - Point out: Visual DNA, Behavioral DNA, Market DNA
3. **Collector Profiler** (30s):
   - Click vào Profiler
   - Enter "alice.eth"
   - Show collection DNA + recommendations
   - Highlight match scores

**Closing (30s)**:
```
"Everything is working end-to-end. All data is clearly labeled as mock, 
with safety disclaimers on every page. This is built specifically for 
the Renaiss collector economy and ready to integrate with real data. 
Thanks for watching!"
```

### Upload video:

1. **YouTube** (Public/Unlisted):
   - Upload lên YouTube
   - Get link: `https://youtu.be/YOUR_VIDEO_ID`

2. **Loom**:
   - Sau khi record xong, Loom tự động cho link
   - Copy link: `https://loom.com/share/YOUR_VIDEO_ID`

---

## 📝 Bước 5: Update Links vào Project

Sau khi có GitHub URL, Demo URL, Video URL:

### Update HACKATHON.md:

```markdown
## 📞 Contact & Links

**Developer**: TRAN DANG HOP

**GitHub**: https://github.com/YOUR_USERNAME/renaiss-card-dna  
**Live Demo**: https://renaiss-card-dna.vercel.app  
**Demo Video**: https://youtu.be/YOUR_VIDEO_ID  

**X/Twitter**: [@bella_summerss](https://x.com/bella_summerss)  
**Discord**: tdh8386  
**Email**: trandanghop2006@gmail.com
```

### Commit & push lại:

```bash
git add HACKATHON.md
git commit -m "Add deployment links"
git push
```

---

## 📋 Bước 6: Submit vào Hackathon

1. Đi tới form đăng ký: https://forms.gle/db9SMNGKMMbTDBLXA
2. Fill form với:
   - Project Name: **Renaiss Card DNA**
   - Track: **AI**
   - GitHub: `https://github.com/YOUR_USERNAME/renaiss-card-dna`
   - Live Demo: `https://renaiss-card-dna.vercel.app`
   - Video: `https://youtu.be/YOUR_VIDEO_ID`
   - Description: 
     ```
     AI-powered card personality analyzer. Analyzes Visual DNA, 
     Behavioral DNA, and Market DNA to match collectors with cards 
     that fit their taste. First personality-based matching system 
     for collectibles.
     ```

3. Submit!

---

## ✅ Checklist trước khi submit:

- [ ] Code đã push lên GitHub
- [ ] Backend deployed trên Railway
- [ ] Frontend deployed trên Vercel
- [ ] Frontend kết nối được với Backend (test trên live URL)
- [ ] Video demo đã record và upload
- [ ] Links đã update vào HACKATHON.md
- [ ] README.md có contact info đầy đủ
- [ ] Test lại toàn bộ app trên live URL
- [ ] Submit form hackathon

---

## 🐛 Troubleshooting

### Backend không chạy trên Railway:

**Problem**: Build failed

**Solution**: 
1. Check Railway logs
2. Make sure `requirements.txt` ở đúng folder `backend/`
3. Thêm file `Procfile` trong `backend/`:
   ```
   web: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

### Frontend không connect được Backend:

**Problem**: CORS errors

**Solution**:
1. Check `NEXT_PUBLIC_API_URL` environment variable trên Vercel
2. Make sure Railway backend URL đúng
3. Re-deploy frontend sau khi update env var

### Video quá dài/nặng:

**Solution**:
- Keep video < 3 phút
- Upload 1080p là đủ (không cần 4K)
- Loom tự động compress

---

## 🎯 Timeline Gợi Ý:

- **Ngày 1** (Today): Push GitHub + Deploy
- **Ngày 2**: Record video
- **Ngày 3**: Test everything + Submit form
- **Ngày 4-10**: Nghỉ ngơi, theo dõi Discord cho updates
- **Ngày 11**: Deadline submission (July 11)
- **Ngày 12-14**: Judging period
- **Ngày 15**: Winner announcement 🏆

---

## 📞 Cần help?

Nếu stuck ở bước nào:
1. Check error messages kỹ
2. Google error message
3. Ask trên Discord của Renaiss
4. Email tôi nếu cần: (tôi là AI nên không có email 😅)

---

**Good luck! Bạn có một dự án tuyệt vời rồi đấy! 🚀🧬**

---

**Contact Info:**
- X: [@bella_summerss](https://x.com/bella_summerss)
- Discord: tdh8386
- Email: trandanghop2006@gmail.com
