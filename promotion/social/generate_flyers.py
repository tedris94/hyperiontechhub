"""Generate Hyperion Tech Hub WhatsApp Status flyers (1080x1920)."""
from __future__ import annotations

import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageFilter

WIDTH, HEIGHT = 1080, 1920
ROOT = Path(__file__).resolve().parent
PROJECT = ROOT.parent.parent
ASSETS_CURSOR = Path(
    os.environ.get(
        "CURSOR_ASSETS",
        r"C:\Users\USTAZ-IDRIS\.cursor\projects\c-wamp64-www-hmis-com\assets",
    )
)

BRAND_BLUE = (26, 43, 194)
DEEP_NAVY = (13, 13, 82)
DARK_CHARCOAL = (27, 28, 30)
WHITE = (255, 255, 255)
LIGHT_GRAY = (200, 210, 230)

FLYERS = [
    {
        "file": "01-ai-native-coding.png",
        "bg": "01-ai-native-coding.png",
        "headline": "Build Smarter Software with AI",
        "highlights": [
            "AI-powered applications",
            "Custom software development",
            "Automation solutions",
            "Scalable architecture",
        ],
        "cta": "Let's Build Your Next Solution",
    },
    {
        "file": "02-wordpress-web-development.png",
        "bg": "02-wordpress-web-development.png",
        "headline": "Transform Your Online Presence",
        "highlights": [
            "Corporate websites",
            "School portals",
            "E-commerce solutions",
            "Business websites",
        ],
        "cta": "Get Your Website Today",
    },
    {
        "file": "03-cloud-services.png",
        "bg": "03-cloud-services.png",
        "headline": "Move Your Business to the Cloud",
        "highlights": [
            "Cloud migration",
            "Hosting solutions",
            "Data backup",
            "Secure infrastructure",
        ],
        "cta": "Scale Without Limits",
    },
    {
        "file": "04-android-development.png",
        "bg": "04-android-development.png",
        "headline": "Your Business in Every Pocket",
        "highlights": [
            "Mobile applications",
            "Business apps",
            "School apps",
            "Enterprise solutions",
        ],
        "cta": "Launch Your Mobile App",
    },
    {
        "file": "05-corporate-training.png",
        "bg": "05-corporate-training.png",
        "headline": "Empower Your Workforce",
        "highlights": [
            "Staff ICT training",
            "Digital transformation",
            "AI productivity",
            "Technology workshops",
        ],
        "cta": "Train Your Team Today",
    },
    {
        "file": "06-online-courses.png",
        "bg": "06-online-courses.png",
        "headline": "Learn Future-Proof Skills",
        "highlights": [
            "Software development",
            "Web development",
            "Cloud computing",
            "Cybersecurity",
        ],
        "cta": "Enroll Now",
    },
    {
        "file": "07-computer-laptop-repairs.png",
        "bg": "07-computer-laptop-repairs.png",
        "headline": "Fast & Reliable Repairs",
        "highlights": [
            "Hardware repairs",
            "Software troubleshooting",
            "Upgrades",
            "Maintenance",
        ],
        "cta": "Bring Your Device Back to Life",
    },
    {
        "file": "08-graphic-design-printing.png",
        "bg": "08-graphic-design-printing.png",
        "headline": "Designs That Make an Impact",
        "highlights": [
            "Branding",
            "Flyers",
            "Business cards",
            "Large format printing",
        ],
        "cta": "Elevate Your Brand",
    },
    {
        "file": "09-cybersecurity.png",
        "bg": "09-cybersecurity.png",
        "headline": "Protect What Matters Most",
        "highlights": [
            "Security assessments",
            "Threat protection",
            "Data security",
            "Network security",
        ],
        "cta": "Secure Your Business Today",
    },
]

OVERVIEW = {
    "file": "10-company-overview.png",
    "bg": "10-company-overview.png",
    "headline": "Elevate Your Business Digitally",
    "subheading": "Technology Solutions for Businesses, Schools, Organizations, and Individuals.",
    "services": [
        "AI & Native Coding",
        "WordPress & Web Development",
        "Cloud Services",
        "Android Development",
        "Corporate Training",
        "Online Courses",
        "Computer & Laptop Repairs",
        "Graphic Design & Printing",
        "Cybersecurity",
    ],
    "cta": "Contact Hyperion Tech Hub Today",
}

PHONE = "+234 906 495 1938"
TAGLINE = "A One-Stop Destination for Tech Solutions, Education, and Innovation."


def load_font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        "C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf",
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
    ]
    for path in candidates:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def load_logo(width: int = 520) -> Image.Image:
    png_path = ROOT / "hth-logo.png"
    if not png_path.exists():
        png_path = PROJECT / "assets" / "img" / "hth-logo.png"
    logo = Image.open(png_path).convert("RGBA")
    if logo.width != width:
        ratio = width / logo.width
        logo = logo.resize(
            (width, int(logo.height * ratio)),
            Image.Resampling.LANCZOS,
        )
    return logo


def vertical_gradient(size: tuple[int, int]) -> Image.Image:
    w, h = size
    img = Image.new("RGB", size, DEEP_NAVY)
    draw = ImageDraw.Draw(img)
    for y in range(h):
        t = y / h
        r = int(DEEP_NAVY[0] + (DARK_CHARCOAL[0] - DEEP_NAVY[0]) * t)
        g = int(DEEP_NAVY[1] + (DARK_CHARCOAL[1] - DEEP_NAVY[1]) * t)
        b = int(DEEP_NAVY[2] + (DARK_CHARCOAL[2] - DEEP_NAVY[2]) * t)
        draw.line([(0, y), (w, y)], fill=(r, g, b))
    return img


def fit_background(path: Path, size: tuple[int, int]) -> Image.Image:
    w, h = size
    if not path.exists():
        return vertical_gradient(size)

    src = Image.open(path).convert("RGB")
    sw, sh = src.size
    scale = max(w / sw, h / sh)
    nw, nh = int(sw * scale), int(sh * scale)
    resized = src.resize((nw, nh), Image.Resampling.LANCZOS)
    left = (nw - w) // 2
    top = (nh - h) // 2
    cropped = resized.crop((left, top, left + w, top + h))
    return cropped.filter(ImageFilter.GaussianBlur(radius=1))


def overlay_dark(img: Image.Image, top_alpha: float = 0.55, bottom_alpha: float = 0.92) -> Image.Image:
    w, h = img.size
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    for y in range(h):
        t = y / h
        alpha = int(255 * (top_alpha + (bottom_alpha - top_alpha) * t))
        draw.line([(0, y), (w, y)], fill=(13, 13, 52, alpha))
    return Image.alpha_composite(img.convert("RGBA"), overlay)


def draw_neon_accent(draw: ImageDraw.ImageDraw, y: int) -> None:
    draw.line([(80, y), (WIDTH - 80, y)], fill=(*BRAND_BLUE, 180), width=3)
    draw.line([(120, y + 6), (WIDTH - 120, y + 6)], fill=(*BRAND_BLUE, 90), width=1)


def wrap_headline(text: str, font: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        trial = f"{current} {word}".strip()
        bbox = font.getbbox(trial)
        if bbox[2] - bbox[0] <= max_width:
            current = trial
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def draw_logo_header(base: Image.Image, logo: Image.Image) -> None:
    lw, lh = logo.size
    x = (WIDTH - lw) // 2
    y = 56
    base.alpha_composite(logo, (x, y))


def draw_cta_button(
    base: Image.Image,
    text: str,
    y: int,
    font: ImageFont.FreeTypeFont,
) -> int:
    bbox = font.getbbox(text)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    pad_x, pad_y = 42, 22
    btn_w = tw + pad_x * 2
    btn_h = th + pad_y * 2
    x = (WIDTH - btn_w) // 2
    draw = ImageDraw.Draw(base)
    draw.rounded_rectangle(
        [(x, y), (x + btn_w, y + btn_h)],
        radius=28,
        fill=BRAND_BLUE,
    )
    draw.text((x + pad_x, y + pad_y - 2), text, fill=WHITE, font=font)
    return y + btn_h


def create_service_flyer(spec: dict, logo: Image.Image, bg_path: Path) -> Image.Image:
    bg = fit_background(bg_path, (WIDTH, HEIGHT))
    canvas = overlay_dark(bg)
    draw = ImageDraw.Draw(canvas)

    draw_neon_accent(draw, 180)

    draw_logo_header(canvas, logo)

    headline_font = load_font(58, bold=True)
    body_font = load_font(34)
    cta_font = load_font(30, bold=True)
    phone_font = load_font(32, bold=True)
    tag_font = load_font(22)

    y = 210
    for line in wrap_headline(spec["headline"], headline_font, WIDTH - 140):
        bbox = headline_font.getbbox(line)
        tw = bbox[2] - bbox[0]
        draw.text(((WIDTH - tw) // 2, y), line, fill=WHITE, font=headline_font)
        y += 68

    y += 18
    draw_neon_accent(draw, y)
    y += 36

    for item in spec["highlights"]:
        bullet = f"•  {item}"
        draw.text((90, y), bullet, fill=LIGHT_GRAY, font=body_font)
        y += 52

    y += 28
    y = draw_cta_button(canvas, spec["cta"], y, cta_font)

    y += 34
    phone_text = f"📞  {PHONE}"
    bbox = phone_font.getbbox(PHONE)
    tw = bbox[2] - bbox[0]
    draw.text(((WIDTH - tw) // 2 + 18, y), PHONE, fill=WHITE, font=phone_font)
    draw.text(((WIDTH - tw) // 2 - 28, y + 2), "📞", fill=WHITE, font=tag_font)

    y += 56
    bbox = tag_font.getbbox(TAGLINE)
    tw = bbox[2] - bbox[0]
    draw.text(((WIDTH - tw) // 2, y), TAGLINE, fill=(*BRAND_BLUE, 255), font=tag_font)

    return canvas.convert("RGB")


def create_overview_flyer(spec: dict, logo: Image.Image, bg_path: Path) -> Image.Image:
    bg = fit_background(bg_path, (WIDTH, HEIGHT))
    canvas = overlay_dark(bg, top_alpha=0.62, bottom_alpha=0.95)
    draw = ImageDraw.Draw(canvas)

    draw_logo_header(canvas, logo)

    headline_font = load_font(52, bold=True)
    sub_font = load_font(28)
    service_font = load_font(30)
    cta_font = load_font(30, bold=True)
    phone_font = load_font(34, bold=True)

    y = 205
    for line in wrap_headline(spec["headline"], headline_font, WIDTH - 120):
        bbox = headline_font.getbbox(line)
        tw = bbox[2] - bbox[0]
        draw.text(((WIDTH - tw) // 2, y), line, fill=WHITE, font=headline_font)
        y += 62

    y += 10
    for line in wrap_headline(spec["subheading"], sub_font, WIDTH - 100):
        bbox = sub_font.getbbox(line)
        tw = bbox[2] - bbox[0]
        draw.text(((WIDTH - tw) // 2, y), line, fill=LIGHT_GRAY, font=sub_font)
        y += 40

    y += 20
    draw_neon_accent(draw, y)
    y += 34

    for service in spec["services"]:
        text = f"✓  {service}"
        draw.text((88, y), text, fill=WHITE, font=service_font)
        y += 48

    y += 18
    y = draw_cta_button(canvas, spec["cta"], y, cta_font)

    y += 30
    bbox = phone_font.getbbox(PHONE)
    tw = bbox[2] - bbox[0]
    draw.text(((WIDTH - tw) // 2, y), PHONE, fill=WHITE, font=phone_font)

    return canvas.convert("RGB")


def main() -> None:
    logo = load_logo(500)
    ROOT.mkdir(parents=True, exist_ok=True)

    for spec in FLYERS:
        bg_path = ASSETS_CURSOR / spec["bg"]
        if not bg_path.exists():
            bg_path = ROOT / spec["bg"]
        img = create_service_flyer(spec, logo, bg_path)
        out = ROOT / spec["file"]
        img.save(out, "PNG", optimize=True)
        print(f"Created {out} ({img.width}x{img.height})")

    bg_path = ASSETS_CURSOR / OVERVIEW["bg"]
    if not bg_path.exists():
        bg_path = ROOT / OVERVIEW["bg"]
    overview = create_overview_flyer(OVERVIEW, logo, bg_path)
    out = ROOT / OVERVIEW["file"]
    overview.save(out, "PNG", optimize=True)
    print(f"Created {out} ({overview.width}x{overview.height})")


if __name__ == "__main__":
    main()
