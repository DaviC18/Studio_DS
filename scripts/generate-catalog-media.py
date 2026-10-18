#!/usr/bin/env python3
# Gera a mídia abstrata do catálogo em public/assets/catalog (autoria própria).
# Uso: python3 scripts/generate-catalog-media.py public/assets/catalog
#   depois os comandos ffmpeg do fim deste arquivo para fumaca.webm/.mp4.
import math, random, sys, os
from PIL import Image, ImageDraw, ImageFilter
out = sys.argv[1]
def comp(seed, w, h, palette):
    random.seed(seed)
    img = Image.new("RGB", (w, h), palette[0])
    d = ImageDraw.Draw(img)
    for i in range(7):
        r = random.randint(h//5, int(h/1.6))
        x, y = random.randint(-r//2, w), random.randint(-r//2, h)
        d.ellipse([x-r, y-r, x+r, y+r], fill=palette[1 + i % (len(palette)-1)])
    img = img.filter(ImageFilter.GaussianBlur(h//14))
    noise = Image.effect_noise((w, h), 22).convert("RGB")
    return Image.blend(img, noise, 0.06)
P = {
 "grao":   ["#2a1a12", "#6b3f24", "#b8743f", "#d9b48c"],
 "torra":  ["#140d0a", "#3b2418", "#8a4b2a", "#c8824f"],
 "crema":  ["#d8c3a5", "#efe3d0", "#a8754c", "#5a3a26"],
}
for name, pal in P.items():
    for ratio, (w, h) in {"16x9": (1600, 900), "4x5": (960, 1200)}.items():
        comp(sum(map(ord, name)), w, h, pal).save(f"{out}/{name}-{ratio}.webp", quality=72, method=6)
# quadros do vídeo: deriva lenta das formas
os.makedirs(f"{out}/_frames", exist_ok=True)
base = comp(7, 1280, 720, P["torra"])
for f in range(96):
    t = f / 96 * 2 * math.pi
    dx, dy = int(60 * math.cos(t)), int(30 * math.sin(t))
    fr = base.resize((1440, 810)).crop((80 + dx, 45 + dy, 80 + dx + 1280, 45 + dy + 720))
    fr.save(f"{out}/_frames/{f:03d}.png")
base.resize((1280, 720)).crop((0, 0, 1280, 720)).save(f"{out}/fumaca-poster.webp", quality=72)

# ffmpeg -framerate 24 -i _frames/%03d.png -c:v libvpx-vp9 -b:v 0 -crf 40 -an fumaca.webm
# ffmpeg -framerate 24 -i _frames/%03d.png -c:v libx264 -pix_fmt yuv420p -crf 28 -movflags +faststart -an fumaca.mp4
# rm -r _frames
