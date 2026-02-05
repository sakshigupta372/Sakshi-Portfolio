# Portfolio Customization Guide

This guide will help you customize your portfolio with your own content, images, and resume.

## 📄 Adding Your Resume

1. Replace the placeholder resume at `public/resume.pdf` with your actual resume PDF
2. Name it `resume.pdf` or update the link in `src/components/Hero.jsx` (line 55)
3. The resume will be automatically downloadable when visitors click "Download Resume"

## 🖼️ Adding Custom Project Images

### Option 1: Use Your Own Images (Recommended)

1. Create a folder: `public/images/projects/`
2. Add your project images to this folder (e.g., `ai-agent.jpg`, `iot-project.png`)
3. Update the image URLs in `src/components/Features.jsx`:

```jsx
const projects = [
  {
    id: 'ai-agent',
    title: 'AI Agent Platform',
    image: '/images/projects/ai-agent.jpg', // Change this
    // ... rest of the project
  },
]
```

### Option 2: Use Different Stock Images

Replace the Unsplash URLs in `src/components/Features.jsx` with your preferred images:
- Current: `https://images.unsplash.com/photo-...`
- Replace with your own URLs

## 🎯 Customizing Projects

Edit `src/components/Features.jsx` to update your projects:

```jsx
{
  id: 'your-project-id',
  title: 'Your Project Name',
  description: 'Brief description of your project',
  tags: ['Tag1', 'Tag2', 'Tag3'],
  image: '/path/to/your/image.jpg',
  demoLink: 'https://your-demo-link.com',
  githubLink: 'https://github.com/yourusername/repo'
}
```

### Tips for Project Cards:
- **Keep descriptions concise** (1-2 sentences)
- **Use 3-4 tags maximum** for clean design
- **Image dimensions**: 800x600px or 16:9 aspect ratio
- **Update links**: Replace '#' with actual demo and GitHub URLs

## 👤 Personal Information

### Update Contact Email
In `src/components/Navbar.jsx` (line 9):
```jsx
navigator.clipboard.writeText('your-email@gmail.com')
```

### Update Social Links

**Footer** (`src/components/Footer.jsx`):
- Line 43: GitHub URL
- Line 51: LinkedIn URL
- Line 59: Email

**Hero Section** (`src/components/Hero.jsx`):
- Line 64: LinkedIn URL

## 🎨 Adding More Projects

To add more than 6 projects, simply add more objects to the `projects` array in `src/components/Features.jsx`:

```jsx
const projects = [
  // ... existing projects
  {
    id: 'new-project',
    title: 'New Project',
    description: 'Description here',
    tags: ['Tech1', 'Tech2'],
    image: 'https://your-image-url.com',
    demoLink: '#',
    githubLink: '#'
  }
]
```

The grid will automatically adjust to accommodate more projects!

## 🎭 Customizing Stats Strip

Update your focus areas in `src/components/StatsStrip.jsx`:

```jsx
const stats = [
  {
    icon: <Brain className="w-5 h-5" />,
    label: 'Focus',
    value: 'Your Focus Area'
  },
  {
    icon: <Blocks className="w-5 h-5" />,
    label: 'Core Tech',
    value: 'Your Technologies'
  }
]
```

## 🏷️ Updating Skills Marquee

Edit `src/components/Marquee.jsx` to change the scrolling skills:

```jsx
const skills = [
  'Your Skill 1',
  'Your Skill 2',
  'Your Skill 3',
  // Add as many as you want
]
```

## 📝 Changing Page Title & Meta

Update `index.html`:
```html
<title>Your Name | Your Title</title>
<meta name="description" content="Your description">
```

## 🎨 Color Customization (Optional)

The portfolio uses a black and white theme. To modify:

**Main Colors** (`tailwind.config.js`):
```js
colors: {
  primary: '#ffffff',
  dark: '#000000',
  'dark-secondary': '#0a0a0a',
  'dark-tertiary': '#141414',
}
```

## 🚀 Deployment Checklist

Before deploying:
- [ ] Replace resume.pdf with your actual resume
- [ ] Update all project images
- [ ] Add real demo and GitHub links
- [ ] Update personal email
- [ ] Update LinkedIn and GitHub URLs
- [ ] Test all links
- [ ] Update page title and meta description
- [ ] Test on mobile devices

## 📸 Recommended Image Sources

If you don't have project screenshots:
- **Unsplash**: https://unsplash.com (free stock photos)
- **Pexels**: https://pexels.com (free stock photos)
- **Your Own Screenshots**: Take screenshots of your projects
- **Design Mockups**: Create mockups in Figma/Canva

## 💡 Pro Tips

1. **High-Quality Images**: Use 800x600px minimum for project images
2. **Optimize Images**: Compress images before uploading (use TinyPNG)
3. **Consistent Descriptions**: Keep all project descriptions similar in length
4. **Active Links**: Ensure all demo and GitHub links work
5. **Mobile Testing**: Test the portfolio on various screen sizes
6. **Resume Format**: Use PDF format for best compatibility

## 🔧 Common Issues

**Images not showing:**
- Check file paths are correct
- Ensure images are in the `public` folder
- Clear browser cache

**Resume not downloading:**
- Verify `resume.pdf` exists in `public` folder
- Check browser allows downloads

**Links not working:**
- Replace all '#' with actual URLs
- Test each link after deployment

---

Need help? Check the main README.md or open an issue on GitHub.
