#!/usr/bin/env python3
"""
Generate app icons and splash screen for AssetTracker
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math

# Color scheme
PRIMARY_BLUE = '#2196F3'
GOLD = '#FFD700'
WHITE = '#FFFFFF'
LIGHT_GRAY = '#F5F5F5'
DARK_BLUE = '#1976D2'

def create_app_icon():
    """Generate main app icon (512x512)"""
    size = 512
    img = Image.new('RGBA', (size, size), LIGHT_GRAY)
    draw = ImageDraw.Draw(img)
    
    # Create a gradient-like effect with circles
    center = size // 2
    radius = size // 3
    
    # Draw background circle (gradient effect using multiple circles)
    for i in range(3):
        r = radius - (i * 15)
        color_val = int(33 + i * 20)
        circle_color = f'#{color_val:02x}c2f9'
        draw.ellipse([center-r, center-r, center+r, center+r], fill=PRIMARY_BLUE)
    
    # Draw wallet/asset shape - rounded rectangle
    wallet_width = int(size * 0.55)
    wallet_height = int(size * 0.35)
    wallet_left = center - wallet_width // 2
    wallet_top = center - wallet_height // 2
    
    # Wallet background
    draw.rounded_rectangle(
        [wallet_left, wallet_top, wallet_left + wallet_width, wallet_top + wallet_height],
        radius=30,
        fill=WHITE,
        outline=PRIMARY_BLUE,
        width=4
    )
    
    # Draw coins inside wallet (3 coins)
    coin_radius = int(wallet_height * 0.35)
    coin_y = center
    coin_positions = [
        center - coin_radius * 1.5,
        center,
        center + coin_radius * 1.5
    ]
    
    for coin_x in coin_positions:
        # Draw coin circle
        draw.ellipse(
            [coin_x - coin_radius, coin_y - coin_radius, 
             coin_x + coin_radius, coin_y + coin_radius],
            fill=GOLD,
            outline=PRIMARY_BLUE,
            width=3
        )
        # Add coin detail (dollar sign)
        draw.text((coin_x - 8, coin_y - 15), '$', fill=PRIMARY_BLUE, font=None)
    
    # Draw upward arrow (growth indicator)
    arrow_start_x = center + int(wallet_width * 0.35)
    arrow_start_y = center + int(wallet_height * 0.2)
    arrow_end_x = arrow_start_x + 40
    arrow_end_y = arrow_start_y - 80
    
    # Arrow line
    draw.line([arrow_start_x, arrow_start_y, arrow_end_x, arrow_end_y], 
              fill=GOLD, width=6)
    
    # Arrow head
    angle = math.atan2(arrow_end_y - arrow_start_y, arrow_end_x - arrow_start_x)
    arrow_size = 20
    point1_x = arrow_end_x - arrow_size * math.cos(angle - math.pi/6)
    point1_y = arrow_end_y - arrow_size * math.sin(angle - math.pi/6)
    point2_x = arrow_end_x - arrow_size * math.cos(angle + math.pi/6)
    point2_y = arrow_end_y - arrow_size * math.sin(angle + math.pi/6)
    
    draw.polygon([
        (arrow_end_x, arrow_end_y),
        (point1_x, point1_y),
        (point2_x, point2_y)
    ], fill=GOLD)
    
    # Add slight shadow effect
    shadow = img.filter(ImageFilter.GaussianBlur(radius=2))
    
    return img

def create_adaptive_icon():
    """Generate adaptive icon (432x432 for Android safe zone)"""
    size = 432
    img = Image.new('RGBA', (size, size), LIGHT_GRAY)
    draw = ImageDraw.Draw(img)
    
    center = size // 2
    
    # Simplified version of main icon - focused on central design
    radius = size // 2.5
    
    # Draw background circle
    draw.ellipse([center-radius, center-radius, center+radius, center+radius], 
                 fill=PRIMARY_BLUE)
    
    # Draw coins
    coin_positions = [center - 60, center, center + 60]
    coin_radius = 35
    
    for coin_x in coin_positions:
        draw.ellipse(
            [coin_x - coin_radius, center - coin_radius, 
             coin_x + coin_radius, center + coin_radius],
            fill=GOLD,
            outline=WHITE,
            width=2
        )
    
    return img

def create_splash_screen():
    """Generate splash screen (1024x2048)"""
    width, height = 1024, 2048
    img = Image.new('RGBA', (width, height), WHITE)
    draw = ImageDraw.Draw(img)
    
    # Create gradient background effect
    for y in range(height):
        ratio = y / height
        r_val = int(33 + (25 * ratio))
        g_val = int(150 + (50 * ratio))
        b_val = int(243)
        color = f'#{r_val:02x}{g_val:02x}{b_val:02x}'
        draw.line([(0, y), (width, y)], fill=color)
    
    # Draw large icon in upper portion
    icon_size = 400
    icon_x = (width - icon_size) // 2
    icon_y = int(height * 0.15)
    
    # Icon background circle
    draw.ellipse(
        [icon_x, icon_y, icon_x + icon_size, icon_y + icon_size],
        fill=WHITE
    )
    
    # Draw wallet with coins
    wallet_width = int(icon_size * 0.6)
    wallet_height = int(icon_size * 0.35)
    wallet_x = icon_x + (icon_size - wallet_width) // 2
    wallet_y = icon_y + (icon_size - wallet_height) // 2 - 30
    
    draw.rounded_rectangle(
        [wallet_x, wallet_y, wallet_x + wallet_width, wallet_y + wallet_height],
        radius=25,
        fill=PRIMARY_BLUE,
        outline=WHITE,
        width=3
    )
    
    # Coins
    coin_radius = int(wallet_height * 0.3)
    coin_y = wallet_y + wallet_height // 2
    
    for i, coin_offset in enumerate([-1.2, 0, 1.2]):
        coin_x = wallet_x + wallet_width // 2 + int(coin_offset * coin_radius * 1.5)
        draw.ellipse(
            [coin_x - coin_radius, coin_y - coin_radius,
             coin_x + coin_radius, coin_y + coin_radius],
            fill=GOLD,
            outline=WHITE,
            width=2
        )
    
    # Draw upward arrow
    arrow_x = wallet_x + wallet_width + 60
    arrow_y = wallet_y + wallet_height
    arrow_end_y = arrow_y - 120
    
    draw.line([arrow_x, arrow_y, arrow_x, arrow_end_y], fill=GOLD, width=8)
    
    # Arrow head
    triangle_size = 25
    draw.polygon([
        (arrow_x, arrow_end_y),
        (arrow_x - triangle_size, arrow_end_y + triangle_size),
        (arrow_x + triangle_size, arrow_end_y + triangle_size)
    ], fill=GOLD)
    
    # App name and description
    text_y = int(height * 0.6)
    
    try:
        # Try to use a larger font
        title_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 80)
        desc_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 40)
    except:
        title_font = ImageFont.load_default()
        desc_font = ImageFont.load_default()
    
    # App title
    title = "AssetTracker"
    bbox = draw.textbbox((0, 0), title, font=title_font)
    title_width = bbox[2] - bbox[0]
    title_x = (width - title_width) // 2
    draw.text((title_x, text_y), title, fill=WHITE, font=title_font)
    
    # Subtitle
    subtitle = "智能资产管理"
    try:
        subtitle_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 35)
    except:
        subtitle_font = desc_font
    
    bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
    subtitle_width = bbox[2] - bbox[0]
    subtitle_x = (width - subtitle_width) // 2
    draw.text((subtitle_x, text_y + 120), subtitle, fill=GOLD, font=subtitle_font)
    
    # Description
    description = "多货币资产统计 · 实时汇率转换"
    try:
        small_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 28)
    except:
        small_font = desc_font
    
    bbox = draw.textbbox((0, 0), description, font=small_font)
    desc_width = bbox[2] - bbox[0]
    desc_x = (width - desc_width) // 2
    draw.text((desc_x, text_y + 200), description, fill=WHITE, font=small_font)
    
    return img

def main():
    """Generate all icons"""
    print("Generating AssetTracker icons...")
    
    # Generate main icon (icon.png)
    print("Creating main icon (512x512)...")
    icon = create_app_icon()
    icon.save('assets/icon.png')
    print("✓ Saved assets/icon.png")
    
    # Generate adaptive icon (adaptive-icon.png)
    print("Creating adaptive icon (432x432)...")
    adaptive = create_adaptive_icon()
    adaptive.save('assets/adaptive-icon.png')
    print("✓ Saved assets/adaptive-icon.png")
    
    # Generate splash screen (splash-icon.png)
    print("Creating splash screen (1024x2048)...")
    splash = create_splash_screen()
    splash.save('assets/splash-icon.png')
    print("✓ Saved assets/splash-icon.png")
    
    print("\n✅ All icons generated successfully!")
    print("\nGenerated files:")
    print("  - assets/icon.png (512x512)")
    print("  - assets/adaptive-icon.png (432x432)")
    print("  - assets/splash-icon.png (1024x2048)")

if __name__ == '__main__':
    main()
