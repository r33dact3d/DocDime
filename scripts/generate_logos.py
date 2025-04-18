import os
from PIL import Image, ImageDraw, ImageFont

def create_logo(output_path, size, background_color, text_color, text_opacity=1.0, gradient=False):
    """
    Create a logo with specified parameters
    
    :param output_path: Full path where logo will be saved
    :param size: Tuple of (width, height)
    :param background_color: Background color
    :param text_color: Text color
    :param text_opacity: Opacity of text (0.0 to 1.0)
    :param gradient: Whether to add a gradient background
    """
    # Create image
    img = Image.new('RGBA', size, background_color)
    draw = ImageDraw.Draw(img)
    
    # Optional gradient background
    if gradient:
        for y in range(size[1]):
            # Create a gradient from darker to lighter shade
            r, g, b = background_color[:3]
            factor = y / size[1]
            grad_color = (
                int(r * (1 - factor * 0.2)),
                int(g * (1 - factor * 0.2)),
                int(b * (1 - factor * 0.2)),
                255
            )
            draw.line([(0, y), (size[0], y)], fill=grad_color)
    
    # Load a font
    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", size[0] // 4)
    except IOError:
        font = ImageFont.load_default()
    
    # Draw text
    text = "DocDime"
    text_bbox = draw.textbbox((0, 0), text, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]
    
    # Position text in center
    x = (size[0] - text_width) / 2
    y = (size[1] - text_height) / 2
    
    # Apply text opacity
    text_color_with_opacity = text_color + (int(255 * text_opacity),)
    draw.text((x, y), text, font=font, fill=text_color_with_opacity)
    
    # Save image
    img.save(output_path)

def generate_logos(base_path):
    """Generate all logo variations"""
    # Colors
    orange = (255, 153, 0)  # #ff9900
    black = (0, 0, 0)
    white = (255, 255, 255)
    
    # Logo sizes and variations
    logo_configs = [
        # Favicon
        {"path": "favicon-16.png", "size": (16, 16), "background_color": black, "text_color": white, "text_opacity": 0.8},
        {"path": "favicon-32.png", "size": (32, 32), "background_color": black, "text_color": white, "text_opacity": 0.9},
        {"path": "favicon-48.png", "size": (48, 48), "background_color": black, "text_color": white, "text_opacity": 1.0},
        
        # Small logos
        {"path": "logo-small.png", "size": (100, 100), "background_color": black, "text_color": orange, "text_opacity": 1.0, "gradient": True},
        
        # Medium logos
        {"path": "logo-medium.png", "size": (250, 250), "background_color": black, "text_color": orange, "text_opacity": 1.0, "gradient": True},
        
        # Large logos
        {"path": "logo-large.png", "size": (500, 500), "background_color": black, "text_color": orange, "text_opacity": 1.0, "gradient": True},
        
        # Mobile/Web App Icons
        {"path": "logo-android-192.png", "size": (192, 192), "background_color": black, "text_color": white, "text_opacity": 0.9, "gradient": True},
        {"path": "logo-android-512.png", "size": (512, 512), "background_color": black, "text_color": white, "text_opacity": 1.0, "gradient": True},
        
        # Apple Icons
        {"path": "logo-apple-180.png", "size": (180, 180), "background_color": black, "text_color": white, "text_opacity": 0.9, "gradient": True},
        {"path": "logo-apple-120.png", "size": (120, 120), "background_color": black, "text_color": white, "text_opacity": 0.8},
        
        # Social Media
        {"path": "logo-facebook.png", "size": (1200, 630), "background_color": black, "text_color": orange, "text_opacity": 1.0, "gradient": True},
        {"path": "logo-twitter.png", "size": (1200, 600), "background_color": black, "text_color": orange, "text_opacity": 1.0, "gradient": True}
    ]
    
    # Ensure base path exists
    os.makedirs(base_path, exist_ok=True)
    
    # Generate logos
    for config in logo_configs:
        full_path = os.path.join(base_path, config['path'])
        
        # Copy config to avoid modifying original
        logo_config = config.copy()
        del logo_config['path']
        
        create_logo(full_path, **logo_config)
        print(f"Generated {config['path']}")

# Run the generation
generate_logos("/home/robert/Documents/DocDime/DocDime/src/assets/logo")