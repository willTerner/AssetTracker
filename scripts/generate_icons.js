#!/usr/bin/env node

const Canvas = require('canvas');
const fs = require('fs');
const path = require('path');

const { createCanvas } = Canvas;

// Color scheme
const colors = {
  primaryBlue: '#2196F3',
  gold: '#FFD700',
  white: '#FFFFFF',
  lightGray: '#F5F5F5',
  darkBlue: '#1976D2',
};

function createAppIcon() {
  const size = 512;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  const center = size / 2;
  
  // // Background
  // ctx.fillStyle = colors.lightGray;
  // ctx.fillRect(0, 0, size, size);
  
  // Draw blue background circle
  ctx.fillStyle = colors.primaryBlue;
  ctx.beginPath();
  ctx.arc(center, center, size / 3, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw wallet
  const walletWidth = size * 0.4;
  const walletHeight = size * 0.25;
  const walletX = center - walletWidth / 2;
  const walletY = center - walletHeight / 2;
  
  ctx.fillStyle = colors.white;
  ctx.strokeStyle = colors.primaryBlue;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(walletX, walletY, walletWidth, walletHeight, 30);
  ctx.fill();
  ctx.stroke();
  
  // Draw two coins in horizontal arrangement
  const coinRadius = walletHeight * 0.22;
  const coinSpacing = coinRadius * 3;
  
  ctx.fillStyle = colors.gold;
  ctx.strokeStyle = colors.primaryBlue;
  ctx.lineWidth = 2;
  
  // Left coin
  ctx.beginPath();
  ctx.arc(center - coinSpacing / 2, center, coinRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  // Right coin
  ctx.beginPath();
  ctx.arc(center + coinSpacing / 2, center, coinRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  return canvas;
}

function createAdaptiveIcon() {
  const size = 432;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  const center = size / 2;
  
  // Background
  // ctx.fillStyle = colors.lightGray;
  // ctx.fillRect(0, 0, size, size);
  
  // Blue background circle
  ctx.fillStyle = colors.primaryBlue;
  ctx.beginPath();
  ctx.arc(center, center, size / 2.5, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw white rounded square frame
  const frameWidth = size * 0.5;
  const frameHeight = size * 0.35;
  const frameX = center - frameWidth / 2;
  const frameY = center - frameHeight / 2;
  
  ctx.fillStyle = colors.white;
  ctx.strokeStyle = colors.primaryBlue;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(frameX, frameY, frameWidth, frameHeight, 25);
  ctx.fill();
  ctx.stroke();
  
  // Draw two coins in horizontal arrangement
  const coinRadius = 28;
  const spacing = 95;
  
  ctx.fillStyle = colors.gold;
  ctx.strokeStyle = colors.primaryBlue;
  ctx.lineWidth = 2;
  
  // Left coin
  ctx.beginPath();
  ctx.arc(center - spacing / 2, center, coinRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  // Right coin
  ctx.beginPath();
  ctx.arc(center + spacing / 2, center, coinRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  return canvas;
}

function createSplashScreen() {
  const width = 1024;
  const height = 2048;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Gradient background
  for (let y = 0; y < height; y++) {
    const ratio = y / height;
    const r = Math.floor(33 + (25 * ratio)).toString(16).padStart(2, '0');
    const g = Math.floor(150 + (50 * ratio)).toString(16).padStart(2, '0');
    const b = 'f3';
    ctx.fillStyle = `#${r}${g}${b}`;
    ctx.fillRect(0, y, width, 1);
  }
  
  // Draw large icon circle background
  const iconSize = 400;
  const iconX = (width - iconSize) / 2;
  const iconY = height * 0.15;
  
  ctx.fillStyle = colors.white;
  ctx.beginPath();
  ctx.arc(iconX + iconSize / 2, iconY + iconSize / 2, iconSize / 2, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw wallet
  const walletWidth = iconSize * 0.6;
  const walletHeight = iconSize * 0.35;
  const walletX = iconX + (iconSize - walletWidth) / 2;
  const walletY = iconY + (iconSize - walletHeight) / 2;
  
  ctx.fillStyle = colors.primaryBlue;
  ctx.strokeStyle = colors.white;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(walletX, walletY, walletWidth, walletHeight, 25);
  ctx.fill();
  ctx.stroke();
  
  // Two coins in horizontal arrangement
  const coinRadius = walletHeight * 0.18;
  const walletCenterX = walletX + walletWidth / 2;
  const walletCenterY = walletY + walletHeight / 2;
  const coinSpacing = coinRadius * 2.8;
  
  ctx.fillStyle = colors.gold;
  ctx.strokeStyle = colors.white;
  ctx.lineWidth = 2;
  
  // Left coin
  ctx.beginPath();
  ctx.arc(walletCenterX - coinSpacing / 2, walletCenterY, coinRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  // Right coin
  ctx.beginPath();
  ctx.arc(walletCenterX + coinSpacing / 2, walletCenterY, coinRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  
  // Text
  const textY = height * 0.6;
  
  // Title
  ctx.fillStyle = colors.white;
  ctx.font = 'bold 80px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('多币账本', width / 2, textY);
  
  // Subtitle
  ctx.fillStyle = colors.gold;
  ctx.font = '35px Arial';
  ctx.fillText('智能资产管理', width / 2, textY + 120);
  
  // Description
  ctx.fillStyle = colors.white;
  ctx.font = '28px Arial';
  ctx.fillText('多货币资产统计 · 实时汇率转换', width / 2, textY + 200);
  
  return canvas;
}

async function main() {
  console.log('Generating AssetTracker icons...');
  
  try {
    // Create assets directory if not exists (save to root assets)
    const assetsDir = path.join(__dirname, '..', 'assets');
    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir, { recursive: true });
    }
    
    // Generate main icon
    console.log('Creating main icon (512x512)...');
    const icon = createAppIcon();
    const iconBuffer = icon.toBuffer('image/png');
    fs.writeFileSync(path.join(assetsDir, 'icon.png'), iconBuffer);
    console.log('✓ Saved assets/icon.png');
    
    // Generate adaptive icon
    console.log('Creating adaptive icon (432x432)...');
    const adaptive = createAdaptiveIcon();
    const adaptiveBuffer = adaptive.toBuffer('image/png');
    fs.writeFileSync(path.join(assetsDir, 'adaptive-icon.png'), adaptiveBuffer);
    console.log('✓ Saved assets/adaptive-icon.png');
    
    // Generate splash screen
    console.log('Creating splash screen (1024x2048)...');
    const splash = createSplashScreen();
    const splashBuffer = splash.toBuffer('image/png');
    fs.writeFileSync(path.join(assetsDir, 'splash-icon.png'), splashBuffer);
    console.log('✓ Saved assets/splash-icon.png');
    
    console.log('\n✅ All icons generated successfully!');
    console.log('\nGenerated files:');
    console.log('  - assets/icon.png (512x512)');
    console.log('  - assets/adaptive-icon.png (432x432)');
    console.log('  - assets/splash-icon.png (1024x2048)');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

main();
