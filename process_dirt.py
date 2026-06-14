from PIL import Image

img = Image.open('assets/tilesets/dirt.jpeg')
w, h = img.size
print(f'Image size: {w}x{h}')

# 4 columns x 3 rows grid
cols, rows = 4, 3
tw = w // cols
th = h // rows

# Extract center tile
tile = img.crop((tw, th, tw*2, th*2))
print(f'Single tile: {tile.size}')

# Remove black background
img_rgba = tile.convert('RGBA')
data = img_rgba.load()
fw, fh = img_rgba.size

for y in range(fh):
    for x in range(fw):
        r, g, b, a = data[x, y]
        if r < 15 and g < 15 and b < 15:
            data[x, y] = (r, g, b, 0)

# Find bounding box
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

cropped = img_rgba.crop((min_x, min_y, max_x + 1, max_y + 1))
print(f'Cropped: {cropped.size}')

# Scale to 64 wide
target_w = 64
ratio = target_w / cropped.size[0]
target_h = int(cropped.size[1] * ratio)
resized = cropped.resize((target_w, target_h), Image.NEAREST)
resized.save('assets/tilesets/dirt_tile.png')
print(f'Final: {resized.size}')
print('Done!')
