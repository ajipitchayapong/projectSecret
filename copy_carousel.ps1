$srcDir = 'C:/Users/pitchayapong_saelim/.gemini/antigravity/brain/c66a3f80-5b78-4abb-b6f7-29e8446d83f6'
$destDir = 'd:/React/polygon-animals/public/carousel'

if (-not (Test-Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir -Force
}

Get-ChildItem -Path $srcDir -Filter *.png | ForEach-Object {
    if ($_.Name -match '^(.*)_([12])_(\d+)\.png$') {
        $newName = $Matches[1] + "_" + $Matches[2] + ".png"
        $destPath = Join-Path $destDir $newName
        Copy-Item $_.FullName -Destination $destPath -Force
        Write-Output "Copied $($_.Name) to $newName"
    }
}
