from PIL import Image, ImageDraw

def process_tile(source_path, output_path, cols, rows, target_w=64, target_h=48):
    """Extract a tile from a grid, clip to isometric diamond, save as transparent PNG."""
    img = Image.open(source_path)
    w, h = img.size
    tw, th = w // cols, h // rows
    
    # Extract center tile from grid
    tile = img.crop((tw, th, tw*2, th*2))
    
    # Convert to RGBA
    tile = tile.convert('RGBA')
    data = tile.load()
    fw, fh = tile.size
    
    # Remove near-black background (threshold 20)
    for y in range(fh):
        for x in range(fw):
            r, g, b, a = data[x, y]
            if r < 20 and g < 20 and b < 20:
                data[x, y] = (0, 0, 0, 0)
    
    # Find content bounds
    min_x, min_y = fw, fh
    max_x, max_y = 0, 0
    for y in range(fh):
        for x in range(fw):
            if data[x, y][3] > 0:
                min_x = min(min_x, x)
                min_y = min(min_y, y)
                max_x = max(max_x, x)
                max_y = max(max_y, y)
    
    # Crop to content
    cropped = tile.crop((min_x, min_y, max_x + 1, max_y + 1))
    
    # Resize to target
    resized = cropped.resize((target_w, target_h), Image.NEAREST)
    
    # Create diamond mask
    mask = Image.new('L', (target_w, target_h), 0)
    draw = ImageDraw.Draw(mask)
    draw.polygon([
        (target_w // 2, 0),
        (target_w, target_h // 2),
        (target_w // 2, target_h),
        (0, target_h // 2)
    ], fill=255)
    
    # Apply mask
    result = Image.new('RGBA', (target_w, target_h), (0, 0, 0, 0))
    result.paste(resized, (0, 0), mask)
    
    # Draw diamond border
    draw = ImageDraw.Draw(result)
    draw.polygon([
        (target_w // 2, 0),
        (target_w, target_h // 2),
        (target_w // 2, target_h),
        (0, target_h // 2)
    ], outline=(74, 125, 47, 150))
    
    result.save(output_path)
    print(f'{output_path}: {result.size}')

# Process grass (no black bg - just clip and resize)
def process_grass(source_path, output_path, target_w=64, target_h=48):
    img = Image.open(source_path)
    w, h = img.size
    # The grass is a seamless texture, just resize the whole thing
    resized = img.resize((target_w, target_h), Image.NEAREST).convert('RGBA')
    
    # Diamond mask
    mask = Image.new('L', (target_w, target_h), 0)
    draw = ImageDraw.Draw(mask)
    draw.polygon([
        (target_w // 2, 0),
        (target_w, target_h // 2),
        (target_w // 2, target_h),
        (0, target_h // 2)
    ], fill=255)
    
    result = Image.new('RGBA', (target_w, target_h), (0, 0, 0, 0))
    result.paste(resized, (0, 0), mask)
    
    draw = ImageDraw.Draw(result)
    draw.polygon([
        (target_w // 2, 0),
        (target_w, target_h // 2),
        (target_w // 2, target_h),
        (0, target_h // 2)
    ], outline=(74, 125, 47, 150))
    
    result.save(output_path)
    print(f'{output_path}: {result.size}')

# Run
process_grass('assets/tilesets/grass.jpeg', 'assets/tilesets/grass_diamond.png')
process_tile('assets/tilesets/dirt.jpeg', 'assets/tilesets/dirt_diamond.png', 4, 3)
print('Done!')
