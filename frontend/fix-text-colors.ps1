# Fix light grey text colors to darker greys for better readability

$directories = @(
    "src\components\feeds",
    "src\app\feeds",
    "src\app\admin",
    "src\components\admin"
)

foreach ($dir in $directories) {
    $path = Join-Path $PSScriptRoot $dir
    if (Test-Path $path) {
        Get-ChildItem -Path $path -Filter *.tsx -Recurse | ForEach-Object {
            $content = Get-Content $_.FullName -Raw
            $content = $content -replace 'text-gray-600', 'text-gray-800'
            $content = $content -replace 'text-gray-500', 'text-gray-700'
            Set-Content -Path $_.FullName -Value $content -NoNewline
            Write-Host "Updated: $($_.FullName)"
        }
    }
}

Write-Host "Text color fixes complete!"
