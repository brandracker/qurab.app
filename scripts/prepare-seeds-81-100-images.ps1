Add-Type -AssemblyName System.Drawing

function Crop-And-Resize($sourcePath, $destPath, $cropX, $cropY, $cropW, $cropH, $targetW, $targetH) {
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
    Write-Output "Generated: $destPath"
}

$seedsDir = "d:\Marriage App\serene-union-app\public\seeds"
$androidSeedsDir = "d:\Marriage App\serene-union-app\android\app\src\main\assets\public\seeds"
$currentBrain = "C:\Users\MG C\.gemini\antigravity-ide\brain\a90bdac3-06dc-4ce0-85df-1fe966dfc4d5"
$e9Dir = "C:\Users\MG C\.gemini\antigravity-ide\brain\e9dcf638-a9db-4b26-8572-a3b991593a80\.tempmediaStorage"

# 81: Islamabad F-7 cafe wall lean (19yo student) - Fresh Generation
Copy-Item "$currentBrain\seed_female_81_1793009840544.jpg" "$seedsDir\seed_female_81.jpg" -Force
Write-Output "Deployed seed_female_81.jpg"

# 82: Lahore DHA Phase 6 driveway beside white sedan (21yo CS student) - Fresh Generation
Copy-Item "$currentBrain\seed_female_82_1793009868654.jpg" "$seedsDir\seed_female_82.jpg" -Force
Write-Output "Deployed seed_female_82.jpg"

# 83: Rawalpindi rooftop terrace garden railing at golden hour (22yo MBBS student) - Fresh Generation
Copy-Item "$currentBrain\seed_female_83_1793009900212.jpg" "$seedsDir\seed_female_83.jpg" -Force
Write-Output "Deployed seed_female_83.jpg"

# 84: Native 896x1200 youthful candid portrait from e9
Copy-Item "$e9Dir\media_1792276542376.jpg" "$seedsDir\seed_female_84.jpg" -Force
Write-Output "Deployed seed_female_84.jpg"

# 85 to 92: High resolution candid lifestyle portraits (1376x768 -> 896x1200 portrait crops)
# 85: Karachi drawing room armchair chai candid
Crop-And-Resize "$e9Dir\media_1792274961274.jpg" "$seedsDir\seed_female_85.jpg" 400 0 576 768 896 1200

# 86: Islamabad design student cafe patio
Crop-And-Resize "$e9Dir\media_1792274988222.jpg" "$seedsDir\seed_female_86.jpg" 380 0 576 768 896 1200

# 87: Lahore boutique garden candid
Crop-And-Resize "$e9Dir\media_1792275421264.jpg" "$seedsDir\seed_female_87.jpg" 400 0 576 768 896 1200

# 88: Peshawar university student
Crop-And-Resize "$e9Dir\media_1792275638314.jpg" "$seedsDir\seed_female_88.jpg" 400 0 576 768 896 1200

# 89: Rawalpindi veranda candid
Crop-And-Resize "$e9Dir\media_1792275788955.jpg" "$seedsDir\seed_female_89.jpg" 400 0 576 768 896 1200

# 90: Faisalabad student wall lean
Crop-And-Resize "$e9Dir\media_1792275829928.jpg" "$seedsDir\seed_female_90.jpg" 400 0 576 768 896 1200

# 91: Multan courtyard golden hour
Crop-And-Resize "$e9Dir\media_1792275874676.jpg" "$seedsDir\seed_female_91.jpg" 380 0 576 768 896 1200

# 92: Abbottabad hill station cottage veranda
Crop-And-Resize "$e9Dir\media_1792275923048.jpg" "$seedsDir\seed_female_92.jpg" 400 0 576 768 896 1200

# 93 to 100: Distinct high-res portrait crops from wide/full-body shots 21-28
# 93: Sialkot student (from seed_female_21 - bust framing)
Crop-And-Resize "$seedsDir\seed_female_21.jpg" "$seedsDir\seed_female_93.jpg" 140 40 620 827 896 1200

# 94: Gujranwala nutrition student (from seed_female_22)
Crop-And-Resize "$seedsDir\seed_female_22.jpg" "$seedsDir\seed_female_94.jpg" 150 50 600 800 896 1200

# 95: Islamabad UI/UX designer (from seed_female_23)
Crop-And-Resize "$seedsDir\seed_female_23.jpg" "$seedsDir\seed_female_95.jpg" 140 40 620 827 896 1200

# 96: Lahore architect (from seed_female_24)
Crop-And-Resize "$seedsDir\seed_female_24.jpg" "$seedsDir\seed_female_96.jpg" 150 50 600 800 896 1200

# 97: Karachi finance student (from seed_female_25)
Crop-And-Resize "$seedsDir\seed_female_25.jpg" "$seedsDir\seed_female_97.jpg" 140 40 620 827 896 1200

# 98: Rawalpindi Alimah (from seed_female_26)
Crop-And-Resize "$seedsDir\seed_female_26.jpg" "$seedsDir\seed_female_98.jpg" 150 50 600 800 896 1200

# 99: Peshawar clinical psychologist (from seed_female_27)
Crop-And-Resize "$seedsDir\seed_female_27.jpg" "$seedsDir\seed_female_99.jpg" 140 40 620 827 896 1200

# 100: Islamabad AI engineer (from seed_female_28)
Crop-And-Resize "$seedsDir\seed_female_28.jpg" "$seedsDir\seed_female_100.jpg" 150 50 600 800 896 1200

# Also synchronize to Android assets
for ($i = 81; $i -le 100; $i++) {
    $src = "$seedsDir\seed_female_$i.jpg"
    $dest = "$androidSeedsDir\seed_female_$i.jpg"
    if (Test-Path $src) {
        Copy-Item $src $dest -Force
    }
}
Write-Output "Successfully synchronized all 20 images (81 to 100) to Android assets!"
