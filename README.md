# Photobooth Web App

A modern React web application for capturing photos using your webcam.

## Features

- 📷 Web camera capture
- 📸 Photo capture functionality
- 💾 Download captured photos
- 🎨 Modern, responsive UI
- 🚀 Ready for Vercel deployment

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Deployment to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Vercel will automatically detect the Vite configuration
4. Deploy!

Or use the Vercel CLI:

```bash
npm i -g vercel
vercel
```

## Browser Compatibility

Requires a browser with support for:
- MediaDevices.getUserMedia API
- Modern ES6+ features

Most modern browsers (Chrome, Firefox, Safari, Edge) are supported.

## Notes

- Camera permissions will be requested when you click "Start Camera"
- The app works best with HTTPS (required for camera access in production)
- Vercel provides HTTPS by default, so deployment will work seamlessly
