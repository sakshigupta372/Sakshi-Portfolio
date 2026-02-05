# Quick Customization Guide

## 📄 Adding Your Resume

### Step 1: Replace the Resume PDF
1. Save your resume as a PDF file
2. Navigate to: `C:/Users/hp/OneDrive/Desktop/Sakshi_Portfolio/public/`
3. Delete the existing `resume.pdf` file
4. Copy your resume PDF into this folder
5. Rename it to `resume.pdf`

**That's it!** The download button will automatically work with your new resume.

---

## 🔗 Adding Your LinkedIn & GitHub Profiles

### LinkedIn Profile

**Location 1: Hero Section**
Open `src/components/Hero.jsx` and find line 64:
```jsx
<a
  href="https://www.linkedin.com/in/sakshi-gupta"  // ← CHANGE THIS
  target="_blank"
  rel="noopener noreferrer"
```
Replace with: `href="https://www.linkedin.com/in/YOUR-LINKEDIN-USERNAME"`

**Location 2: Footer**
Open `src/components/Footer.jsx` and find line 51:
```jsx
<a
  href="https://www.linkedin.com/in/sakshi-gupta"  // ← CHANGE THIS
  target="_blank"
```

### GitHub Profile

**Location 1: Footer**
Open `src/components/Footer.jsx` and find line 43:
```jsx
<a
  href="https://github.com/sakshigupta"  // ← CHANGE THIS
  target="_blank"
```
Replace with: `href="https://github.com/YOUR-GITHUB-USERNAME"`

**Location 2: Project Cards (Optional)**
Open `src/components/Features.jsx` and update each project's GitHub link:
```jsx
{
  id: 'ai-agent',
  title: 'AI Agent Platform',
  // ...
  githubLink: 'https://github.com/YOUR-USERNAME/PROJECT-REPO'  // ← CHANGE THIS
}
```

---

## 🖼️ Adding Your Profile Image

### Option 1: Add Image to Hero Section (Recommended)

**Step 1: Add your image file**
1. Save your image (e.g., `profile.jpg`, `profile.png`)
2. Place it in: `public/images/` folder (create the folder if it doesn't exist)

**Step 2: Update Hero.jsx**
Open `src/components/Hero.jsx` and replace the code block section (around line 75) with:

```jsx
<div className="hidden lg:block">
  <div className="relative">
    <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl"></div>
    <img 
      src="/images/profile.jpg"
      alt="Sakshi Gupta"
      className="relative w-96 h-96 rounded-full object-cover border-4 border-white/20 shadow-2xl"
    />
  </div>
</div>
```

### Option 2: Add Image to Navbar (Small Avatar)

Open `src/components/Navbar.jsx` and update line 26:

```jsx
<div className="flex items-center gap-3">
  <img 
    src="/images/profile.jpg" 
    alt="Sakshi Gupta"
    className="w-10 h-10 rounded-full border-2 border-white/30"
  />
  <span className="text-xl font-mono font-bold text-gradient">
    SG | Agentic AI
  </span>
</div>
```

### Option 3: Replace Project Images with Your Own

1. Save your project screenshots to: `public/images/projects/`
2. Open `src/components/Features.jsx`
3. Update each project's image:

```jsx
const projects = [
  {
    id: 'ai-agent',
    title: 'AI Agent Platform',
    // Change from Unsplash URL to your own:
    image: '/images/projects/ai-agent-screenshot.jpg',
    // ...
  },
]
```

---

## 📧 Updating Your Email

Open `src/components/Navbar.jsx` and find line 9:
```jsx
navigator.clipboard.writeText('sg6227174@gmail.com')  // ← CHANGE THIS
```
Replace with: `'your-email@gmail.com'`

Also update in `src/components/Footer.jsx` line 60:
```jsx
<a href="mailto:sg6227174@gmail.com"  // ← CHANGE THIS
```

---

## ✅ Quick Checklist

- [ ] Add your resume PDF to `public/resume.pdf`
- [ ] Update LinkedIn URL in Hero.jsx (line 64) and Footer.jsx (line 51)
- [ ] Update GitHub URL in Footer.jsx (line 43)
- [ ] Add your profile image to `public/images/`
- [ ] Update Hero.jsx to show your image
- [ ] Update email in Navbar.jsx (line 9) and Footer.jsx (line 60)
- [ ] Replace project images in Features.jsx
- [ ] Update project GitHub links

---

## 🎯 File Locations Summary

| What to Update | File Location | Line Number(s) |
|---------------|--------------|----------------|
| Resume PDF | `public/resume.pdf` | - |
| Profile Image | `public/images/profile.jpg` | - |
| LinkedIn (Hero) | `src/components/Hero.jsx` | 64 |
| LinkedIn (Footer) | `src/components/Footer.jsx` | 51 |
| GitHub (Footer) | `src/components/Footer.jsx` | 43 |
| Email (Navbar) | `src/components/Navbar.jsx` | 9 |
| Email (Footer) | `src/components/Footer.jsx` | 60 |
| Project Images | `src/components/Features.jsx` | Throughout |

---

## 💡 Pro Tips

1. **Image Sizes:**
   - Profile image: 400x400px (square)
   - Project images: 800x600px (16:9 ratio)

2. **Image Formats:**
   - Use JPG for photos
   - Use PNG for images with transparency
   - Optimize images before adding (use tinypng.com)

3. **Testing:**
   - After making changes, save the file
   - Browser will auto-reload
   - Check that images load correctly
   - Test all links work

---

Need help? Check CUSTOMIZATION_GUIDE.md for more details!
