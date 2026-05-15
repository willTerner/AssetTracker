#!/usr/bin/env node

const Canvas = require('canvas');
const fs = require('fs');
const path = require('path');

const { createCanvas } = Canvas;

// Warm coral theme colors
const CORAL = '#E8956D';
const CORAL_DARK = '#D4745E';
const ESPRESSO = '#5C3D2E';
const HONEY = '#F3BC8B';
const OFF_WHITE = '#FFFAF3';
const WHITE = '#FFFFFF';

function drawRoundedRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

function fillWarmGradient(ctx, x, y, w, h) {
    const gradient = ctx.createLinearGradient(x, y, x + w, y + h);
    gradient.addColorStop(0, CORAL);
    gradient.addColorStop(1, CORAL_DARK);
    ctx.fillStyle = gradient;
}

function drawAppIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Rounded rect background with coral gradient
    drawRoundedRect(ctx, 0, 0, size, size, size * 0.22);
    fillWarmGradient(ctx, 0, 0, size, size);
    ctx.fill();

    // Inner highlight
    const glow = ctx.createRadialGradient(size * 0.3, size * 0.3, 0, size * 0.5, size * 0.5, size * 0.7);
    glow.addColorStop(0, 'rgba(255,255,255,0.12)');
    glow.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = glow;
    ctx.fill();

    // ¥ symbol centered
    ctx.fillStyle = OFF_WHITE;
    ctx.font = `800 ${size * 0.48}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('¥', size / 2, size / 2);

    return canvas;
}

function drawAdaptiveIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Transparent background — adaptive icon is foreground only
    // Rounded square with coral gradient
    const inset = size * 0.08;
    const iconSize = size - inset * 2;
    drawRoundedRect(ctx, inset, inset, iconSize, iconSize, iconSize * 0.2);
    fillWarmGradient(ctx, inset, inset, iconSize, iconSize);
    ctx.fill();

    // ¥ symbol
    ctx.fillStyle = OFF_WHITE;
    ctx.font = `800 ${iconSize * 0.48}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('¥', size / 2, size / 2);

    return canvas;
}

function drawSplashScreen(width, height) {
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Espresso background
    ctx.fillStyle = ESPRESSO;
    ctx.fillRect(0, 0, width, height);

    // Center icon
    const iconSize = width * 0.22;
    const iconX = (width - iconSize) / 2;
    const iconY = height * 0.33;
    drawRoundedRect(ctx, iconX, iconY, iconSize, iconSize, iconSize * 0.22);
    fillWarmGradient(ctx, iconX, iconY, iconSize, iconSize);
    ctx.fill();

    // ¥ inside icon
    ctx.fillStyle = OFF_WHITE;
    ctx.font = `800 ${iconSize * 0.5}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('¥', iconX + iconSize / 2, iconY + iconSize / 2);

    // App name below icon
    const textY = iconY + iconSize + height * 0.05;
    ctx.fillStyle = HONEY;
    ctx.font = `700 ${height * 0.03}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('多币账本', width / 2, textY);

    // Subtitle
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = `${height * 0.016}px system-ui, sans-serif`;
    ctx.fillText('多货币资产统计 · 实时汇率转换', width / 2, textY + height * 0.04);

    return canvas;
}

function drawFavicon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    drawRoundedRect(ctx, 0, 0, size, size, size * 0.25);
    fillWarmGradient(ctx, 0, 0, size, size);
    ctx.fill();

    ctx.fillStyle = OFF_WHITE;
    ctx.font = `800 ${size * 0.55}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('¥', size / 2, size / 2);

    return canvas;
}

function saveIcon(canvas, filename, assetsDir) {
    const buf = canvas.toBuffer('image/png');
    const filepath = path.join(assetsDir, filename);
    fs.writeFileSync(filepath, buf);
    console.log(`  ✓ assets/${filename} (${canvas.width}x${canvas.height})`);
}

function main() {
    const assetsDir = path.join(__dirname, '..', 'assets');
    console.log('Generating warm-themed icons...\n');

    // Backup originals
    const backupDir = path.join(assetsDir, 'backup');
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir);
    }
    ['icon.png', 'adaptive-icon.png', 'splash-icon.png', 'favicon.png'].forEach((f) => {
        const src = path.join(assetsDir, f);
        const dst = path.join(backupDir, f);
        if (fs.existsSync(src) && !fs.existsSync(dst)) {
            fs.copyFileSync(src, dst);
        }
    });

    saveIcon(drawAppIcon(1024), 'icon.png', assetsDir);
    saveIcon(drawAdaptiveIcon(1024), 'adaptive-icon.png', assetsDir);
    saveIcon(drawSplashScreen(1024, 2048), 'splash-icon.png', assetsDir);
    saveIcon(drawFavicon(48), 'favicon.png', assetsDir);

    console.log('\nDone! Icons now match the warm coral theme.');
}

main();
