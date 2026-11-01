# Prepares web copies of the ZENITH '26 hero background elements.
#
# The brand pack ships print-resolution PNGs (0.4-6 MB each) with wide
# transparent margins. For each asset this:
#   1. trims the fully transparent border, so the file *is* the shape and CSS
#      positioning maps directly onto what you see, and
#   2. downscales to roughly 1.5x its on-screen size.
#
# The shapes are soft organic gradients with no fine detail, so 1.5x holds up
# on high-DPI screens. No WebP/AVIF encoder exists on this machine, so output
# stays PNG; re-encoding these to WebP would cut roughly 70% more.
#
# Textures\bg-texture.png (6 MB, opaque, portrait) becomes the hero's cover
# background. It is rotated to landscape (2512x2010) and exported as a
# quality-95 JPEG: full size, visually lossless, a fraction of the PNG's weight.
#
# Run under Windows PowerShell, which resolves System.Drawing for Add-Type
# without the extra GDI+ assembly references PowerShell 7 requires:
#   powershell -NoProfile -File scripts/prepare-hero-assets.ps1

$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing @'
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.Drawing.Drawing2D;
using System.Runtime.InteropServices;

public static class HeroAsset
{
    // Bounding box of every pixel whose alpha clears the threshold.
    private static Rectangle AlphaBounds(Bitmap bmp, byte threshold)
    {
        var rect = new Rectangle(0, 0, bmp.Width, bmp.Height);
        BitmapData data = bmp.LockBits(rect, ImageLockMode.ReadOnly, PixelFormat.Format32bppArgb);
        int stride = data.Stride;
        byte[] buf = new byte[stride * bmp.Height];
        Marshal.Copy(data.Scan0, buf, 0, buf.Length);
        bmp.UnlockBits(data);

        int minX = bmp.Width, minY = bmp.Height, maxX = -1, maxY = -1;
        for (int y = 0; y < bmp.Height; y++)
        {
            int row = y * stride;
            for (int x = 0; x < bmp.Width; x++)
            {
                if (buf[row + x * 4 + 3] > threshold)
                {
                    if (x < minX) minX = x;
                    if (x > maxX) maxX = x;
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
                }
            }
        }
        if (maxX < 0) return rect; // fully transparent, leave as-is
        return Rectangle.FromLTRB(minX, minY, maxX + 1, maxY + 1);
    }

    // Opaque photographic textures: JPEG compresses noise far better than PNG.
    // landscape: rotate a portrait source 90 degrees so it is wider than tall
    // (lossless: every pixel is kept, unlike cropping).
    public static string ToJpeg(string inPath, string outPath, int targetWidth, long quality, bool landscape)
    {
        using (var src = new Bitmap(inPath))
        {
            if (landscape && src.Height > src.Width)
                src.RotateFlip(RotateFlipType.Rotate90FlipNone);
            int w = targetWidth;
            int h = (int)Math.Round(src.Height * ((double)targetWidth / src.Width));
            using (var dst = new Bitmap(w, h, PixelFormat.Format24bppRgb))
            {
                using (var g = Graphics.FromImage(dst))
                {
                    g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                    g.PixelOffsetMode = PixelOffsetMode.HighQuality;
                    g.DrawImage(src, new Rectangle(0, 0, w, h));
                }
                ImageCodecInfo jpeg = null;
                foreach (var codec in ImageCodecInfo.GetImageEncoders())
                    if (codec.MimeType == "image/jpeg") { jpeg = codec; break; }
                var args = new EncoderParameters(1);
                args.Param[0] = new EncoderParameter(System.Drawing.Imaging.Encoder.Quality, quality);
                dst.Save(outPath, jpeg, args);
            }
            return string.Format("{0}x{1} -> out {2}x{3} q{4}", src.Width, src.Height, w, h, quality);
        }
    }

    public static string Convert(string inPath, string outPath, int targetWidth, bool trim)
    {
        using (var src = new Bitmap(inPath))
        {
            Rectangle crop = trim ? AlphaBounds(src, 8) : new Rectangle(0, 0, src.Width, src.Height);
            double ratio = (double)targetWidth / crop.Width;
            int w = targetWidth;
            int h = (int)Math.Round(crop.Height * ratio);

            using (var dst = new Bitmap(w, h, PixelFormat.Format32bppArgb))
            {
                using (var g = Graphics.FromImage(dst))
                {
                    g.CompositingMode = CompositingMode.SourceCopy;
                    g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                    g.PixelOffsetMode = PixelOffsetMode.HighQuality;
                    g.DrawImage(src, new Rectangle(0, 0, w, h), crop, GraphicsUnit.Pixel);
                }
                dst.Save(outPath, ImageFormat.Png);
            }

            return string.Format("{0}x{1} -> crop {2}x{3} -> out {4}x{5}",
                src.Width, src.Height, crop.Width, crop.Height, w, h);
        }
    }
}
'@

$src = 'C:\Users\SATWIK\Downloads\drive-download-20261101T165329Z-1-001'
$out = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\public\assets'))

New-Item -ItemType Directory -Force (Join-Path $out 'hero') | Out-Null
New-Item -ItemType Directory -Force (Join-Path $out 'patterns') | Out-Null

$jobs = @(
    # Widths are ~1.5x each shape's on-screen size at a 1440 viewport. The left
    # ribbon is tall and narrow once trimmed (467x1706), so it is sized by the
    # ~150px width it actually occupies, not by its source width.
    # The shapes now render much larger (see Hero.css), so these are exported
    # at ~1.3-1.5x their widest on-screen size (~700 / ~300 / ~380 px at 1440).
    @{ In = "$src\Elements\Bakcground\elements-bg-top.png";   Out = 'hero\bg-top.png';   W = 900;  Trim = $true  },
    @{ In = "$src\Elements\Bakcground\elements-bg-left.png";  Out = 'hero\bg-left.png';  W = 340;  Trim = $true  },
    @{ In = "$src\Elements\Bakcground\elements-bg-right.png"; Out = 'hero\bg-right.png'; W = 560;  Trim = $true  }
)

$total = 0
foreach ($job in $jobs) {
    if (-not (Test-Path $job.In)) { Write-Host "MISSING $($job.In)"; continue }
    $target = Join-Path $out $job.Out
    $info = [HeroAsset]::Convert($job.In, $target, $job.W, $job.Trim)
    $kb = [math]::Round((Get-Item $target).Length / 1KB)
    $total += $kb
    Write-Host ("{0,-20} {1,-46} {2,5} KB" -f (Split-Path $job.Out -Leaf), $info, $kb)
}
Write-Host ("{0,-20} {1,-46} {2,5} KB" -f 'TOTAL', '', $total)

# Cover background texture
New-Item -ItemType Directory -Force (Join-Path $out 'hero') | Out-Null
$texIn  = "$src\Textures\bg-texture.png"
$texOut = Join-Path $out 'hero\bg-texture.jpg'
if (Test-Path $texIn) {
    # The source is portrait (2010x2512). Rotated to landscape it is 2512x2010;
    # that native width is kept (no resampling) at quality 95, so the texture is
    # not visibly compressed and can span the hero's full width.
    $info = [HeroAsset]::ToJpeg($texIn, $texOut, 2512, 95, $true)
    $kb = [math]::Round((Get-Item $texOut).Length / 1KB)
    Write-Host ("{0,-20} {1,-46} {2,5} KB" -f 'bg-texture.jpg', $info, $kb)
}

# Remove the oversized PNG attempt from an earlier pass, if present.
$stale = Join-Path $out 'hero\bg-texture.png'
if (Test-Path $stale) { Remove-Item $stale; Write-Host 'removed hero\bg-texture.png (stale)' }
