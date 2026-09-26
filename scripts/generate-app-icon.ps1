Add-Type -AssemblyName System.Drawing

$size = 1024
$scale = 2.0
$outputDir = Join-Path $PSScriptRoot '..\assets'
$iconPath = Join-Path $outputDir 'icon.png'
$adaptivePath = Join-Path $outputDir 'adaptive-icon.png'
$splashPath = Join-Path $outputDir 'splash-icon.png'

function Convert-HexColor([string]$hex) {
    $value = $hex.TrimStart('#')
    if ($value.Length -eq 8) {
        $red = [Convert]::ToInt32($value.Substring(0, 2), 16)
        $green = [Convert]::ToInt32($value.Substring(2, 2), 16)
        $blue = [Convert]::ToInt32($value.Substring(4, 2), 16)
        $alpha = [Convert]::ToInt32($value.Substring(6, 2), 16)
        return [System.Drawing.Color]::FromArgb($alpha, $red, $green, $blue)
    }
    return [System.Drawing.ColorTranslator]::FromHtml("#$value")
}

function New-RoundedPath([float]$x, [float]$y, [float]$width, [float]$height, [float]$radius) {
    $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
    $diameter = [Math]::Min($radius * 2, [Math]::Min($width, $height))
    $path.AddArc($x, $y, $diameter, $diameter, 180, 90)
    $path.AddArc($x + $width - $diameter, $y, $diameter, $diameter, 270, 90)
    $path.AddArc($x + $width - $diameter, $y + $height - $diameter, $diameter, $diameter, 0, 90)
    $path.AddArc($x, $y + $height - $diameter, $diameter, $diameter, 90, 90)
    $path.CloseFigure()
    return $path
}

function Fill-RoundedRect($graphics, $color, [float]$x, [float]$y, [float]$width, [float]$height, [float]$radius) {
    $path = New-RoundedPath $x $y $width $height $radius
    $brush = [System.Drawing.SolidBrush]::new($color)
    $graphics.FillPath($brush, $path)
    $brush.Dispose()
    $path.Dispose()
}

function Draw-Icon([string]$path) {
    $bitmap = [System.Drawing.Bitmap]::new($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    $background = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
        [System.Drawing.Point]::new(0, 0),
        [System.Drawing.Point]::new($size, $size),
        (Convert-HexColor '#0759D7'),
        (Convert-HexColor '#67B9FF')
    )
    $graphics.FillRectangle($background, 0, 0, $size, $size)
    $background.Dispose()

    $graphics.FillEllipse([System.Drawing.SolidBrush]::new((Convert-HexColor '#FFFFFF12')), 36, 32, 440, 440)
    $graphics.FillEllipse([System.Drawing.SolidBrush]::new((Convert-HexColor '#A7F3FF24')), 680, 680, 320, 320)

    foreach ($offset in @(26, 16, 8)) {
        Fill-RoundedRect $graphics (Convert-HexColor '#063B8F14') (208 + $offset) (278 + $offset) 608 548 108
    }
    Fill-RoundedRect $graphics (Convert-HexColor '#FFFFFFF5') 208 278 608 548 108

    $walletPen = [System.Drawing.Pen]::new((Convert-HexColor '#0A84FF'), 14)
    $walletPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $walletPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $walletPen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
    $wallet = New-RoundedPath 310 346 148 112 26
    $graphics.DrawPath($walletPen, $wallet)
    $graphics.DrawLine($walletPen, 310, 394, 458, 394)
    $graphics.DrawLine($walletPen, 420, 422, 444, 422)
    $wallet.Dispose()
    $walletPen.Dispose()

    Fill-RoundedRect $graphics (Convert-HexColor '#DCEBFF') 492 366 198 24 12
    Fill-RoundedRect $graphics (Convert-HexColor '#EAF0F8') 492 414 140 20 10
    Fill-RoundedRect $graphics (Convert-HexColor '#DCEBFF') 294 744 428 16 8
    Fill-RoundedRect $graphics (Convert-HexColor '#9CCBFF') 316 620 88 124 26
    Fill-RoundedRect $graphics (Convert-HexColor '#4AA2FF') 440 550 88 194 26
    Fill-RoundedRect $graphics (Convert-HexColor '#0A84FF') 564 468 88 276 26

    $badgeShadow = [System.Drawing.SolidBrush]::new((Convert-HexColor '#0759D733'))
    $graphics.FillEllipse($badgeShadow, 646, 180, 224, 224)
    $badgeShadow.Dispose()
    $graphics.FillEllipse([System.Drawing.SolidBrush]::new((Convert-HexColor '#34C759')), 638, 164, 224, 224)
    $badgePen = [System.Drawing.Pen]::new([System.Drawing.Color]::White, 14)
    $graphics.DrawEllipse($badgePen, 645, 171, 210, 210)
    $badgePen.Dispose()

    $arrowPen = [System.Drawing.Pen]::new([System.Drawing.Color]::White, 18)
    $arrowPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $arrowPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $arrowPen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
    $graphics.DrawLine($arrowPen, 704, 306, 790, 220)
    $graphics.DrawLine($arrowPen, 744, 220, 790, 220)
    $graphics.DrawLine($arrowPen, 790, 220, 790, 266)
    $arrowPen.Dispose()

    $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
}

Draw-Icon $iconPath
Copy-Item -LiteralPath $iconPath -Destination $adaptivePath -Force
Copy-Item -LiteralPath $iconPath -Destination $splashPath -Force
Write-Output "Generated Android icon assets"

