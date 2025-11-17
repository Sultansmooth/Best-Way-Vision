# Fix remaining light grey text in app pages

$files = @(
    "src\app\events\page.tsx",
    "src\app\events\[id]\page.tsx"
)

foreach ($file in $files) {
    $path = Join-Path $PSScriptRoot $file
    if (Test-Path $path) {
        $content = Get-Content $path -Raw

        # Replace text-gray-400 and text-gray-500 with text-gray-800, but only for <p> tags
        # This preserves icon colors
        $content = $content -replace '<p className="text-gray-400', '<p className="text-gray-800'
        $content = $content -replace '<p className="text-gray-500', '<p className="text-gray-800'
        $content = $content -replace 'className="text-gray-500 text-lg"', 'className="text-gray-800 text-lg"'
        $content = $content -replace 'className="text-gray-500 mt-1"', 'className="text-gray-800 mt-1"'

        Set-Content -Path $path -Value $content -NoNewline
        Write-Host "Updated: $path"
    }
}

Write-Host "Grey text fixes complete!"
