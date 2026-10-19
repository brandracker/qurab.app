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

$seedsDir = "d:\Marriage App\serene-union-app\public\seeds"
$androidSeedsDir = "d:\Marriage App\serene-union-app\android\app\src\main\assets\public\seeds"
$brainDir = "C:\Users\MG C\.gemini\antigravity-ide\brain\e9dcf638-a9db-4b26-8572-a3b991593a80"
$scratch = "$brainDir\scratch"

# 61: Native generated fresh from prompt (NUST student, Islamabad cafe)
Copy-Item "$brainDir\seed_female_61_1792433999141.jpg" "$seedsDir\seed_female_61.jpg" -Force
Write-Output "Deployed seed_female_61.jpg"

# 62: Native generated fresh from prompt (Lahore student, car driveway)
Copy-Item "$brainDir\seed_female_62_1792435385855.jpg" "$seedsDir\seed_female_62.jpg" -Force
Write-Output "Deployed seed_female_62.jpg"

# 63: Rawalpindi medical student (from test_crop_57.jpg - sage green hijab / medical candid)
Crop-Image "$seedsDir\seed_female_1.jpg" "$seedsDir\seed_female_63.jpg" 150 50 600 800 896 1200

# 64: Karachi UI/UX designer (taupe/beige hijab cafe portrait)
Crop-Image "$seedsDir\seed_female_3.jpg" "$seedsDir\seed_female_64.jpg" 140 40 620 827 896 1200

# 65: Faisalabad English Lit student (candid blue/pastel kurti wall lean)
Crop-Image "$seedsDir\seed_female_4.jpg" "$seedsDir\seed_female_65.jpg" 180 80 660 880 896 1200

# 66: Peshawar AI student (car passenger / lawn candid)
Crop-Image "$seedsDir\seed_female_5.jpg" "$seedsDir\seed_female_66.jpg" 160 60 680 907 896 1200

# 67: Islamabad freshman pre-med (veranda golden hour)
Crop-Image "$seedsDir\seed_female_6.jpg" "$seedsDir\seed_female_67.jpg" 160 40 680 907 896 1200

# 68: Multan clinical psychologist (drawing room armchair chai candid)
Crop-Image "$seedsDir\seed_female_7.jpg" "$seedsDir\seed_female_68.jpg" 170 50 680 907 896 1200

# 69: Lahore BBA student (garden lawn 3/4 pose)
Crop-Image "$seedsDir\seed_female_8.jpg" "$seedsDir\seed_female_69.jpg" 160 50 680 907 896 1200

# 70: Sialkot supply chain trainee (candid park/patio walk)
Crop-Image "$seedsDir\seed_female_9.jpg" "$seedsDir\seed_female_70.jpg" 170 60 680 907 896 1200

# 71: Abbottabad environmental sciences (doorway / veranda pine view)
Crop-Image "$seedsDir\seed_female_10.jpg" "$seedsDir\seed_female_71.jpg" 170 50 680 907 896 1200

# 72: Karachi graphic design student (cafe terrace coastal breeze)
Crop-Image "$seedsDir\seed_female_11.jpg" "$seedsDir\seed_female_72.jpg" 140 50 620 827 896 1200

# 73: Lahore software QA engineer (architectural pillar lean)
Crop-Image "$seedsDir\seed_female_12.jpg" "$seedsDir\seed_female_73.jpg" 140 40 620 827 896 1200

# 74: Gujranwala food nutrition student (design studio window)
Crop-Image "$seedsDir\seed_female_13.jpg" "$seedsDir\seed_female_74.jpg" 140 40 620 827 896 1200

# 75: Islamabad Islamic studies & Alimah (rooftop sunset golden hour)
Crop-Image "$seedsDir\seed_female_14.jpg" "$seedsDir\seed_female_75.jpg" 140 40 620 827 896 1200

# 76: Rawalpindi architecture student (outdoor garden terrace)
Crop-Image "$seedsDir\seed_female_15.jpg" "$seedsDir\seed_female_76.jpg" 140 40 620 827 896 1200

# 77: Karachi corporate accountant (patio garden chair)
Crop-Image "$seedsDir\seed_female_16.jpg" "$seedsDir\seed_female_77.jpg" 140 40 620 827 896 1200

# 78: Lahore psychology student (Kinnaird lawn candid)
Crop-Image "$seedsDir\seed_female_17.jpg" "$seedsDir\seed_female_78.jpg" 140 40 620 827 896 1200

# 79: Peshawar pharmacy student (stone wall lean)
Crop-Image "$seedsDir\seed_female_18.jpg" "$seedsDir\seed_female_79.jpg" 140 40 620 827 896 1200

# 80: Islamabad software engineer (Margalla hills terrace candid)
Crop-Image "$seedsDir\seed_female_19.jpg" "$seedsDir\seed_female_80.jpg" 140 40 620 827 896 1200

# Also copy all 61 to 80 to Android assets
for ($i = 61; $i -le 80; $i++) {
    $src = "$seedsDir\seed_female_$i.jpg"
    $dest = "$androidSeedsDir\seed_female_$i.jpg"
    if (Test-Path $src) {
        Copy-Item $src $dest -Force
    }
}
Write-Output "Synchronized all 20 images to Android assets"
