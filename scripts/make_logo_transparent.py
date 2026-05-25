from collections import deque
from PIL import Image

path = r"assets/images/logo2.png"
im = Image.open(path).convert("RGBA")
pixels = im.load()
w, h = im.size
tv_zone_x = int(w * 0.725)


def is_outer_background(r: int, g: int, b: int) -> bool:
    return r > 232 and g > 232 and b > 232


def is_inner_white(r: int, g: int, b: int) -> bool:
    return r > 245 and g > 245 and b > 245


seen = bytearray(w * h)
q = deque()

for x in range(w):
    for y in (0, h - 1):
        if is_outer_background(*pixels[x, y][:3]):
            q.append((x, y))
            seen[y * w + x] = 1

for y in range(h):
    for x in (0, w - 1):
        idx = y * w + x
        if not seen[idx] and is_outer_background(*pixels[x, y][:3]):
            q.append((x, y))
            seen[idx] = 1

while q:
    x, y = q.popleft()
    r, g, b, _ = pixels[x, y]
    pixels[x, y] = (r, g, b, 0)
    for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
        if nx < 0 or ny < 0 or nx >= w or ny >= h:
            continue
        idx = ny * w + nx
        if seen[idx]:
            continue
        if not is_outer_background(*pixels[nx, ny][:3]):
            continue
        seen[idx] = 1
        q.append((nx, ny))

for y in range(h):
    for x in range(tv_zone_x):
        r, g, b, a = pixels[x, y]
        if a == 0:
            continue
        if is_inner_white(r, g, b):
            pixels[x, y] = (r, g, b, 0)

im.save(path)
print(f"Updated {path}: transparent background + e-hole cleanup (tv zone x>={tv_zone_x})")
