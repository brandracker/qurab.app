Add-Type -AssemblyName System.Drawing

function Crop-Image($sourcePath, $destPath, $cropX, $cropY, $cropW, $cropH, $targetW, $targetH) {
    $src = [System.Drawing.Image]::FromFile($sourcePath)
    $dest = New-Object System.Drawing.Bitmap($targetW, $targetH)
    $g = [System.Drawing.Graphics]::FromImage($dest)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    $srcRect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropW, $cropH)
    $destRect = New-Object System.Drawing.Rectangle(0, 0, $targetW, $targetH)
    $g.DrawImage($src, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)

    $dest.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)

    $g.Dispose()
    $dest.Dispose()
    $src.Dispose()
    Write-Output "Saved cropped image to $destPath"
}

$dest13 = "d:\Marriage App\serene-union-app\public\seeds\seed_male_13.jpg"
$dest14 = "d:\Marriage App\serene-union-app\public\seeds\seed_male_14.jpg"
$dest15 = "d:\Marriage App\serene-union-app\public\seeds\seed_male_15.jpg"

Crop-Image "d:\Marriage App\serene-union-app\public\stories\story_tariq_fatima.jpg" $dest13 280 10 480 640 600 800
Crop-Image "d:\Marriage App\serene-union-app\public\stories\story_zaid_ayesha.jpg" $dest14 315 130 380 507 600 800
Crop-Image "d:\Marriage App\serene-union-app\public\stories\story_hamza_maryam.jpg" $dest15 285 170 410 546 600 800


