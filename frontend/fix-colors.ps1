$path = "C:\Programming\Best Way Vision\frontend\src"

Get-ChildItem -Path $path -Recurse -Include *.tsx,*.ts | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $content = $content -replace 'text-gray-500', 'text-gray-700'
    $content = $content -replace 'text-gray-600\b', 'text-gray-800'
    $content = $content -replace "fill: '#9ca3af'", "fill: '#374151'"
    Set-Content -Path $_.FullName -Value $content -NoNewline
}

Write-Host "Text colors updated successfully!"
