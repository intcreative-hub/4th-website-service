# 3D Product Images - Free Sources & Download Guide

## Overview
This document provides step-by-step instructions for downloading free 3D rendered product images to replace the current placeholder gradients.

---

## Category 1: Premium Vapes

### Recommended Sources:
1. **Pikbest** - https://pikbest.com/free-png-images/vape.html
   - 40+ vape PNG images with transparent backgrounds
   - Includes 3D renders of RDA, vape tanks, and e-cigarettes
   - **Steps**: Visit site → Search "vape" → Filter by "PNG" → Download free images

2. **Freepik** - https://www.freepik.com/premium-psd/3d-render-electronic-cigarette-vape-transparent-background_29635464.htm
   - Premium 3D render electronic cigarette
   - Transparent background PSD/PNG
   - **Steps**: Create free account → Download → Use PNG export

3. **Sketchfab** - https://sketchfab.com/3d-models/vape-model-a19b863a29324efeab81ad4f45f9d3d3
   - Free 3D model with preview renders
   - CC Attribution license
   - **Steps**: Visit model → Take screenshot of preview OR download model and render

### Image Specs:
- Format: PNG with transparent background
- Dimensions: 800x800px minimum
- Style: Modern pod system or disposable vape
- File name: `vape-product.png`
- Location: `/public/images/products/`

---

## Category 2: Glass & Accessories

### Recommended Sources:
1. **Freepik** - https://www.freepik.com/free-photos-vectors/bong-pipe
   - Free vectors and photos of glass pipes/bongs
   - Multiple styles available
   - **Steps**: Search "glass bong" OR "glass pipe" → Filter "Free" → Download PNG

2. **iStockPhoto** (Paid but high quality) - https://www.istockphoto.com/photo/transparent-glass-bong-3d-gm1223071950-359135900
   - Professional 3D render, transparent glass
   - $12 with royalty-free license
   - **Steps**: Purchase → Download PNG

3. **Sketchfab** - Search "bong" or "glass pipe"
   - Free 3D models with preview renders
   - **Steps**: Browse models → Screenshot preview OR download and render

### Image Specs:
- Format: PNG with transparent background
- Dimensions: 800x800px minimum
- Style: Artistic glass bong or water pipe
- File name: `glass-pipe.png`
- Location: `/public/images/products/`

---

## Category 3: CBD Products

### Recommended Sources:
1. **Rawpixel** - https://www.rawpixel.com/search/Weed%20png
   - PNG cannabis/hemp flower images
   - 3D renders with transparent backgrounds
   - **Steps**: Create free account → Search "hemp flower" OR "cannabis bud" → Download PNG

2. **Freepik** - https://www.freepik.com/free-photos-vectors/3d-marijuana-plant
   - Free 3D marijuana plant vectors and photos
   - Commercial use allowed
   - **Steps**: Search "hemp flower" OR "cannabis bud 3D" → Filter "Free" → Download

3. **Sketchfab** - https://sketchfab.com/3d-models/weed-bud-bfeabeb5adff45b79d3b3b543bb673d0
   - Realistic hemp flower 3D model
   - 8,768 downloads, highly rated
   - **Steps**: View model → Screenshot preview OR download model

### Image Specs:
- Format: PNG with transparent background
- Dimensions: 800x800px minimum
- Style: Realistic hemp flower/bud (CBD focus, not THC)
- File name: `cbd-hemp.png`
- Location: `/public/images/products/`

---

## Category 4: Tobacco & Papers

### Recommended Sources:
1. **Vecteezy** - https://www.vecteezy.com/free-png/rolling-paper
   - 252 rolling paper PNGs with transparent backgrounds
   - Royalty-free download
   - **Steps**: Browse collection → Click image → Download PNG

2. **Sketchfab** - https://sketchfab.com/3d-models/smoke-rolling-paper-ocb-70192183f4b74a7dabe61a8407a7915b
   - Free OCB rolling paper 3D model
   - **Steps**: View model → Screenshot preview OR download

3. **Vecteezy** - https://www.vecteezy.com/free-png/cigarette
   - 3,152 cigarette PNGs (can show tobacco products)
   - **Steps**: Search "rolling papers" OR "tobacco package" → Download

### Image Specs:
- Format: PNG with transparent background
- Dimensions: 800x800px minimum
- Style: Rolling paper package or premium tobacco
- File name: `tobacco-papers.png`
- Location: `/public/images/products/`

---

## Implementation Steps

### 1. Create Images Directory
```bash
cd /home/intadmin/INT-Creative/ACTIVE-PROJECTS/purple-haze-smoke-shop
mkdir -p public/images/products
```

### 2. Download Images
Visit each source above and download 3D rendered PNG images with transparent backgrounds.

### 3. Optimize Images
```bash
# If you have ImageMagick installed:
convert vape-product.png -resize 800x800 -quality 85 public/images/products/vape-product.png
convert glass-pipe.png -resize 800x800 -quality 85 public/images/products/glass-pipe.png
convert cbd-hemp.png -resize 800x800 -quality 85 public/images/products/cbd-hemp.png
convert tobacco-papers.png -resize 800x800 -quality 85 public/images/products/tobacco-papers.png
```

### 4. Update Product Data
Edit `lib/constants.ts` and update the `image` field for each category:
```typescript
export const PRODUCT_CATEGORIES = [
  {
    id: "vapes",
    title: "Premium Vapes",
    // ... other fields
    image: "/images/products/vape-product.png", // ← Update this
  },
  {
    id: "glass",
    title: "Glass & Accessories",
    // ... other fields
    image: "/images/products/glass-pipe.png", // ← Update this
  },
  {
    id: "cbd",
    title: "CBD Products",
    // ... other fields
    image: "/images/products/cbd-hemp.png", // ← Update this
  },
  {
    id: "tobacco",
    title: "Tobacco & Papers",
    // ... other fields
    image: "/images/products/tobacco-papers.png", // ← Update this
  },
];
```

### 5. Update WhatWeOffer Component
Replace placeholder gradient with actual image:
```tsx
{/* Replace gradient placeholder with actual image */}
<div className="product-image-wrapper relative h-48 overflow-hidden bg-darker-bg">
  <img
    src={product.image}
    alt={product.title}
    className="w-full h-full object-contain p-4"
  />
</div>
```

### 6. Test and Deploy
```bash
npm run dev  # Test locally
npm run build  # Build for production
```

---

## Licensing Notes

- **Freepik**: Free for commercial use with attribution (check each image)
- **Vecteezy**: Royalty-free download, attribution appreciated
- **Rawpixel**: Free account required, check license per image
- **Pikbest**: Free downloads available, check commercial use terms
- **Sketchfab**: CC Attribution license, credit the creator

**Always verify the specific license for each image before using commercially.**

---

## Alternative: AI-Generated Images

If you cannot find suitable free images, consider:
1. **Midjourney** - Generate custom 3D product renders ($10/month)
2. **DALL-E 3** - Create realistic product images
3. **Stable Diffusion** - Free local AI image generation

Prompt example: "3D render of a modern vape device, product photography, transparent background, professional lighting, studio shot"

---

## Current Placeholder Status

The site currently uses **premium CSS gradient placeholders** designed to look professional until real images are added. These include:
- Category-specific color gradients (purple for vapes, blue for glass, green for CBD, amber for tobacco)
- Animated pulse effects
- Decorative blur orbs for depth
- Category icons and labels

These placeholders are intentional and look professional, not broken.

---

*Last Updated: October 23, 2025*
*For questions: Contact INT Creative*
