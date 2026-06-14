from PIL import Image

img = Image.open('assets/tilesets/grass.jpeg')
w, h = img.size

# Each tile in the 3x3 grid
tw = w // 3
th = h // 3

# Extract one tile from the center of the grid
tile = img.crop((tw, th, tw*2, th*2))
print(f'Extracted single tile: {tile.size}')

# Remove white background and make transparent
img_rgba = tile.convert('RGBA')
data = img_rgba.load()
fw, fh = img_rgba.size

# White pixels become transparent
for y in range(fh):
    for x in range(fw):
        r, g, b, a = data[x, y]
        if r > 240 and g > 240 and b > 240:
            data[x, y] = (r, g, b, 0)

# Find bounding box of non-transparent content
min_x, min_y = fw, fh
max_x, max_y = 0, 0
for y in range(fh):
    for x in range(fw):
        if data[x, y][3] > 0:
            min_x = min(min_x, x)
            min_y = min(min_y, y)
            max_x = max(max_x, x)
            max_y = max(max_y, y)

print(f'Content bounds: ({min_x},{min_y}) to ({max_x},{max_y})')

# Crop to content
cropped = img_rgba.crop((min_x, min_y, max_x + 1, max_y + 1))
cropped.save('assets/tilesets/grass_tile_raw.png')
print(f'Cropped tile: {cropped.size}')

# Scale down: target 64px wide, maintain aspect ratio
target_w = 64
ratio = target_w / cropped.size[0]
target_h = int(cropped.size[1] * ratio)
resized = cropped.resize((target_w, target_h), Image.NEAREST)
resized.save('assets/tilesets/grass_tile.png')
print(f'Final tile: {resized.size}')
print('Done!')
