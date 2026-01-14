# Stubgram Landing Page

A stunning, production-ready landing page for Stubgram - the social media
platform that pays you for being social.

## 🚀 Features

- **Modern Design**: Gradient backgrounds, glassmorphism effects, and smooth
  animations
- **Fully Responsive**: Optimized for mobile, tablet, and desktop devices
- **SEO Optimized**: Complete metadata, Open Graph, and Twitter Cards
- **Performance Focused**: Built with Next.js 14+ for optimal performance
- **Conversion Optimized**: Multiple CTAs and clear value propositions

## 📦 Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Styling**: Vanilla CSS with CSS Modules
- **TypeScript**: Type-safe development
- **Images**: Next.js Image optimization
- **Deployment**: Optimized for Vercel

## 🛠️ Local Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

## 🌐 Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js and configure settings
6. Click "Deploy"

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Follow the prompts to complete deployment.

### Environment Variables (Optional)

Create `.env.local` for local development:

```env
NEXT_PUBLIC_APP_URL=https://stubgram.app
NEXT_PUBLIC_API_URL=https://api.stubgram.app
```

Add these in Vercel's dashboard under "Environment Variables" for production.

## 📁 Project Structure

```
stub-landing/
├── app/
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Main landing page
│   └── globals.css        # Global styles and design system
├── components/
│   ├── Hero.tsx           # Hero section
│   ├── Features.tsx       # Features showcase
│   ├── HowItWorks.tsx     # How it works section
│   ├── RewardsSystem.tsx  # Snap Coins rewards
│   ├── Showcase.tsx       # Platform screenshots
│   ├── Testimonials.tsx   # Stats and testimonials
│   ├── CTA.tsx            # Call-to-action
│   └── Footer.tsx         # Footer
├── public/
│   ├── logo.png           # Stubgram logo
│   ├── hero-mockup.png    # Hero section mockup
│   └── ...                # Other images
└── package.json
```

## 🎨 Design System

The landing page uses a comprehensive design system with:

- **Color Palette**: Primary (#0a7ea4), Secondary (#EC4899), Accent (#F59E0B)
- **Gradients**: 5 unique gradient combinations
- **Typography**: Responsive clamp() sizes for perfect scaling
- **Spacing**: Consistent spacing scale (8px, 16px, 24px, 32px, 48px, 64px)
- **Shadows**: 4 elevation levels
- **Animations**: Fade-in, slide, and float animations

## 📈 Performance

- Lighthouse Performance: 90+
- First Contentful Paint: < 1.5s
- Fully responsive and accessible
- Optimized images with Next.js Image component

## 📄 License

© 2026 Stubgram. All rights reserved.

## 🤝 Support

For questions or support, contact us at support@stubgram.app
