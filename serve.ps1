# Server lokal untuk slide crootss, tanpa instal apa pun.
#
# Jalankan di folder slide:
#   irm https://crootss.if.co.id/serve.ps1 | iex
#
# Browser menolak memuat ES module dari file://, dan juga menolaknya bila
# server tidak mengirim Content-Type JavaScript ("Strict MIME type checking").
# Skrip ini menyajikan folder saat ini di http://localhost:8080/ dengan
# Content-Type yang benar. Tutup jendela PowerShell (atau Ctrl+C) untuk berhenti.
#
# Sengaja hanya berisi karakter ASCII supaya aman dibaca Windows PowerShell 5.1.

$port = 8080
$root = $pwd.Path
$types = @{
  '.html' = 'text/html; charset=utf-8'; '.css' = 'text/css; charset=utf-8'
  '.js' = 'text/javascript; charset=utf-8'; '.mjs' = 'text/javascript; charset=utf-8'
  '.json' = 'application/json'; '.svg' = 'image/svg+xml'; '.ico' = 'image/x-icon'
  '.png' = 'image/png'; '.jpg' = 'image/jpeg'; '.jpeg' = 'image/jpeg'
  '.gif' = 'image/gif'; '.webp' = 'image/webp'; '.woff2' = 'font/woff2'
  '.txt' = 'text/plain; charset=utf-8'; '.mp4' = 'video/mp4'; '.pdf' = 'application/pdf'
}

$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add("http://localhost:$port/")
try {
  $listener.Start()
} catch {
  Write-Host "Port $port sedang dipakai program lain. Tutup program itu lalu jalankan ulang." -ForegroundColor Red
  return
}

Write-Host "Menyajikan $root"
Write-Host "Buka http://localhost:$port/  (tutup jendela atau Ctrl+C untuk berhenti)" -ForegroundColor Green
try { Start-Process "http://localhost:$port/" } catch { }

try {
  while ($listener.IsListening) {
    $context = $listener.GetContext()
    $response = $context.Response
    $path = Join-Path $root ([System.Uri]::UnescapeDataString($context.Request.Url.AbsolutePath).TrimStart('/'))
    if (Test-Path $path -PathType Container) { $path = Join-Path $path 'index.html' }
    if (Test-Path $path -PathType Leaf) {
      $type = $types[[System.IO.Path]::GetExtension($path).ToLower()]
      if ($type) { $response.ContentType = $type }
      $bytes = [System.IO.File]::ReadAllBytes($path)
      $response.ContentLength64 = $bytes.Length
      $response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $response.StatusCode = 404
    }
    $response.Close()
  }
} finally {
  $listener.Stop()
}
