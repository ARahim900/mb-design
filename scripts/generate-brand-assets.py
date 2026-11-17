#!/usr/bin/env python3
"""Generate the MB Design logo SVGs and app icons from the supplied artwork.

Source: scripts/mb-design-logo-source.png (white artwork on a solid #5C0D23 field).
The artwork is traced as-is with potrace; it is never redrawn or restyled.

Run from anywhere:  python3 scripts/generate-brand-assets.py
Requires: Pillow, numpy, potrace on PATH (or at /opt/homebrew/bin/potrace).
"""

from __future__ import annotations

import math
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "scripts" / "mb-design-logo-source.png"
BRAND_DIR = ROOT / "public" / "brand"
ICON_DIR = ROOT / "public" / "icons"

BURGUNDY = "#5C0D23"
BURGUNDY_RGB = (92, 13, 35)
TITLE = "MB Design"

# Luminance midway between the burgundy field (~47) and the white artwork (255).
THRESHOLD = 150
# Upscale before tracing so the thin "DESIGN" caps and fine script strokes survive.
UPSCALE = 4
# Even margin around the artwork bounding box, in source pixels.
MARGIN = 8
# Potrace: drop only specks of up to this many (upscaled) pixels.
TURDSIZE = 4


def find_potrace() -> str:
    found = shutil.which("potrace") or "/opt/homebrew/bin/potrace"
    if not Path(found).exists():
        sys.exit("potrace not found; install it (brew install potrace).")
    return found


def load_artwork() -> np.ndarray:
    """Return the cropped artwork as a float luminance array (0 = field, 255 = artwork)."""
    image = Image.open(SOURCE).convert("RGB")
    rgb = np.asarray(image).astype(np.float64)
    luminance = 0.2126 * rgb[..., 0] + 0.7152 * rgb[..., 1] + 0.0722 * rgb[..., 2]

    ys, xs = np.nonzero(luminance > THRESHOLD)
    if xs.size == 0:
        sys.exit("No artwork found above the luminance threshold.")

    top = max(int(ys.min()) - MARGIN, 0)
    bottom = min(int(ys.max()) + MARGIN + 1, luminance.shape[0])
    left = max(int(xs.min()) - MARGIN, 0)
    right = min(int(xs.max()) + MARGIN + 1, luminance.shape[1])
    return luminance[top:bottom, left:right]


def coverage(luminance: np.ndarray) -> np.ndarray:
    """Map luminance to 0..1 artwork coverage (the burgundy field becomes 0)."""
    field = 0.2126 * BURGUNDY_RGB[0] + 0.7152 * BURGUNDY_RGB[1] + 0.0722 * BURGUNDY_RGB[2]
    return np.clip((luminance - field) / (255.0 - field), 0.0, 1.0)


def trace(luminance: np.ndarray, potrace: str) -> tuple[str, int, int]:
    """Trace the artwork and return (path data, width, height) in cropped source pixels."""
    height, width = luminance.shape
    soft = Image.fromarray(np.clip(luminance, 0, 255).astype(np.uint8))
    upscaled = soft.resize((width * UPSCALE, height * UPSCALE), Image.Resampling.LANCZOS)
    # potrace traces black pixels, so the artwork must be black on white.
    bitmap = Image.fromarray(np.where(np.asarray(upscaled) > THRESHOLD, 0, 255).astype(np.uint8)).convert("1")

    with tempfile.TemporaryDirectory() as workdir:
        pbm = Path(workdir) / "artwork.pbm"
        svg = Path(workdir) / "artwork.svg"
        bitmap.save(pbm)
        subprocess.run(
            [
                potrace, str(pbm), "--backend", "svg", "--flat",
                "--turdsize", str(TURDSIZE), "--alphamax", "1.0", "--opttolerance", "0.2",
                "--unit", "10", "--output", str(svg),
            ],
            check=True,
        )
        traced = svg.read_text(encoding="utf-8")

    paths = re.findall(r'<path d="([^"]+)"', traced)
    if not paths:
        sys.exit("potrace produced no paths.")
    return " ".join(" ".join(p.split()) for p in paths), width, height


def artwork_group(path_data: str, height: float, fill: str, scale: float = 1.0, dx: float = 0.0, dy: float = 0.0) -> str:
    # potrace emits y-up coordinates in 1/10 of an upscaled pixel.
    unit = 0.1 / UPSCALE * scale
    return (
        f'<g transform="translate({dx:.3f} {dy + height * scale:.3f}) scale({unit:.6f} {-unit:.6f})" fill="{fill}">'
        f'<path d="{path_data}"/></g>'
    )


def write_svg(name: str, view_w: float, view_h: float, body: str) -> None:
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {view_w:g} {view_h:g}" role="img" aria-labelledby="title">\n'
        f'  <title id="title">{TITLE}</title>\n'
        f'  {body}\n'
        f'</svg>\n'
    )
    (BRAND_DIR / name).write_text(svg, encoding="utf-8")


def write_svgs(path_data: str, width: int, height: int) -> None:
    for name, fill in (
        ("mb-design-logo-light.svg", "#FFFFFF"),
        ("mb-design-logo-dark.svg", BURGUNDY),
        ("mb-design-logo-monochrome.svg", "#000000"),
    ):
        write_svg(name, width, height, artwork_group(path_data, height, fill))

    # Square symbol: artwork centred on the burgundy field with ~12% padding per side.
    side = 1000
    scale = side * 0.76 / max(width, height)
    dx = (side - width * scale) / 2
    dy = (side - height * scale) / 2
    body = f'<rect width="{side}" height="{side}" fill="{BURGUNDY}"/>' + artwork_group(path_data, height, "#FFFFFF", scale, dx, dy)
    write_svg("mb-design-symbol.svg", side, side, body)


def content_scale_for_circle(alpha: np.ndarray, radius: float) -> float:
    """Largest scale at which every artwork pixel, centred on its bounding box, lies inside the circle."""
    ys, xs = np.nonzero(alpha > 0.02)
    cy = (alpha.shape[0] - 1) / 2
    cx = (alpha.shape[1] - 1) / 2
    furthest = math.sqrt(float(((xs - cx) ** 2 + (ys - cy) ** 2).max())) + 1
    return radius / furthest


def write_icon(name: str, size: int, alpha: np.ndarray, padding: float, maskable: bool = False) -> None:
    height, width = alpha.shape
    scale = size * (1 - 2 * padding) / max(width, height)
    if maskable:
        # Maskable safe zone: a centred circle with a radius of 40% of the icon.
        scale = min(scale, content_scale_for_circle(alpha, size * 0.4))

    target_w = max(1, round(width * scale))
    target_h = max(1, round(height * scale))
    supersample = 4
    mask = Image.fromarray((alpha * 255).astype(np.uint8))
    mask = mask.resize((target_w * supersample, target_h * supersample), Image.Resampling.LANCZOS)
    mask = mask.resize((target_w, target_h), Image.Resampling.BOX)

    icon = Image.new("RGB", (size, size), BURGUNDY_RGB)
    white = Image.new("RGB", (target_w, target_h), (255, 255, 255))
    icon.paste(white, ((size - target_w) // 2, (size - target_h) // 2), mask)
    icon.save(ICON_DIR / name, optimize=True)


def main() -> None:
    potrace = find_potrace()
    BRAND_DIR.mkdir(parents=True, exist_ok=True)
    ICON_DIR.mkdir(parents=True, exist_ok=True)

    luminance = load_artwork()
    path_data, width, height = trace(luminance, potrace)
    write_svgs(path_data, width, height)

    alpha = coverage(luminance)
    write_icon("mb-design-favicon-32.png", 32, alpha, padding=0.06)
    write_icon("mb-design-apple-touch-icon.png", 180, alpha, padding=0.12)
    write_icon("mb-design-app-192.png", 192, alpha, padding=0.12)
    write_icon("mb-design-app-512.png", 512, alpha, padding=0.12, maskable=True)

    print(f"Artwork {width}x{height}px traced; SVGs in {BRAND_DIR.relative_to(ROOT)}, icons in {ICON_DIR.relative_to(ROOT)}.")


if __name__ == "__main__":
    main()
