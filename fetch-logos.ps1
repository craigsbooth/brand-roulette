# Fetch logo URLs from Logopedia (logos.fandom.com) for all brands
# This queries the wiki API to find the latest logo image for each brand

$brands = @()
$content = Get-Content brands.js -Raw
$matches = [regex]::Matches($content, '\{name:\s*"([^"]+)"')
foreach ($m in $matches) {
    $brands += $m.Groups[1].Value
}

Write-Host "Found $($brands.Count) brands to look up"

$results = @{}
$batchSize = 20
$count = 0

foreach ($brand in $brands) {
    $count++
    if ($count % 50 -eq 0) { Write-Host "Processing $count / $($brands.Count)..." }
    
    # Search for the brand page
    $searchUrl = "https://logos.fandom.com/api.php?action=query&format=json&list=search&srsearch=$([uri]::EscapeDataString($brand))&srlimit=1"
    try {
        $search = Invoke-RestMethod $searchUrl -ErrorAction Stop
        $page = $search.query.search | Select-Object -First 1
        if (-not $page) { continue }
        
        # Get images from that page
        $imagesUrl = "https://logos.fandom.com/api.php?action=parse&format=json&pageid=$($page.pageid)&prop=images"
        $imagesResult = Invoke-RestMethod $imagesUrl -ErrorAction Stop
        $images = $imagesResult.parse.images
        
        if (-not $images -or $images.Count -eq 0) { continue }
        
        # Pick the last image (usually the most current logo)
        # Filter out info/icon images
        $logoImages = $images | Where-Object { $_ -notmatch "Info|icon|Flag|Map" }
        if (-not $logoImages -or $logoImages.Count -eq 0) { $logoImages = $images }
        $latestImage = $logoImages | Select-Object -Last 1
        
        # Get the direct URL
        $fileUrl = "https://logos.fandom.com/api.php?action=query&format=json&prop=imageinfo&titles=File:$([uri]::EscapeDataString($latestImage))&iiprop=url"
        $fileResult = Invoke-RestMethod $fileUrl -ErrorAction Stop
        $pages = $fileResult.query.pages
        $pageData = $pages.PSObject.Properties | Select-Object -First 1
        $url = $pageData.Value.imageinfo[0].url
        
        if ($url) {
            $results[$brand] = $url
        }
    } catch {
        # Skip failures silently
    }
    
    # Small delay to be respectful
    Start-Sleep -Milliseconds 200
}

Write-Host "`nGot logos for $($results.Count) / $($brands.Count) brands"

# Output as JSON
$results | ConvertTo-Json | Set-Content "logo-urls.json"
Write-Host "Saved to logo-urls.json"
