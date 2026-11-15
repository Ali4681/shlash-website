from pathlib import Path
from PIL import Image

src_dir = Path(__file__).resolve().parents[1] / "public" / "media" / "products"
out_dir = src_dir / "cutout"
out_dir.mkdir(exist_ok=True)

files = ["butter.jpg", "choco.jpg", "digestive.jpg", "wafer.jpg", "rings.jpg", "cracker.jpg"]


def remove_studio_bg(im: Image.Image) -> Image.Image:
    im = im.convert("RGBA")
    w, h = im.size
    px = im.load()
    corners = [px[2, 2], px[w - 3, 2], px[2, h - 3], px[w - 3, h - 3]]

    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            mind = min(
                ((r - cr) ** 2 + (g - cg) ** 2 + (b - cb) ** 2) ** 0.5
                for cr, cg, cb, _ in corners
            )
            brightness = (r + g + b) / 3.0
            if mind < 38 and brightness > 175:
                px[x, y] = (r, g, b, 0)
            elif mind < 58 and brightness > 165:
                t = (mind - 38) / 20.0
                px[x, y] = (r, g, b, int(255 * min(1.0, max(0.0, t))))
            elif brightness > 245 and abs(r - g) < 12 and abs(g - b) < 12:
                px[x, y] = (r, g, b, 0)
    return im


for name in files:
    src = src_dir / name
    if not src.exists():
        print("missing", name)
        continue
    out = out_dir / f"{src.stem}.png"
    remove_studio_bg(Image.open(src)).save(out, optimize=True)
    print("saved", out.name, out.stat().st_size)
