from pathlib import Path
from rembg import remove
from PIL import Image

src_dir = Path(__file__).resolve().parents[1] / "public" / "media" / "products"
out_dir = src_dir / "cutout"
out_dir.mkdir(exist_ok=True)

files = ["butter.jpg", "choco.jpg", "digestive.jpg", "wafer.jpg", "rings.jpg", "cracker.jpg"]

for name in files:
    src = src_dir / name
    if not src.exists():
        print("missing", name)
        continue
    out = out_dir / f"{src.stem}.png"
    result = remove(Image.open(src).convert("RGBA"))
    result.save(out, optimize=True)
    print("saved", out.name, out.stat().st_size)
