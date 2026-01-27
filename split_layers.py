import re

def split_svg_layers(input_path):
    with open(input_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract header and footer
    header_match = re.match(r'(<svg[^>]*>)(.*)', content, re.DOTALL)
    if not header_match:
        print("Could not parse SVG header")
        return

    header_tag = header_match.group(1)
    body = content.replace(header_tag, '').replace('</svg>', '').strip()
    
    # Simple heuristic: Split by <path tags
    # We look for "/>" which closes a path, or "</path>"
    # Given the file view, it seems they are mostly <path ... />
    
    # Let's just find all occurrences of "<path" and split reasonably
    # This is a basic text split, assuming well-formatted SVG from the tool output
    
    paths = re.split(r'(<path[^>]*/>)', body)
    # Filter out empty strings and whitespace
    paths = [p for p in paths if p.strip()]
    
    total_paths = len(paths)
    print(f"Found approximately {total_paths} elements")

    # Split into 3 chunks
    # Back: 0 - 35%
    # Mid: 35% - 75%
    # Front: 75% - 100%
    
    split1 = int(total_paths * 0.35)
    split2 = int(total_paths * 0.75)
    
    layer_back_paths = "".join(paths[:split1])
    layer_mid_paths = "".join(paths[split1:split2])
    layer_front_paths = "".join(paths[split2:])
    
    # Save files
    base_path = input_path.replace('Artboard 1.svg', '')
    
    with open(f"{base_path}layer-1-back.svg", 'w', encoding='utf-8') as f:
        f.write(f"{header_tag}\n{layer_back_paths}\n</svg>")
        
    with open(f"{base_path}layer-2-mid.svg", 'w', encoding='utf-8') as f:
        f.write(f"{header_tag}\n{layer_mid_paths}\n</svg>")
        
    with open(f"{base_path}layer-3-front.svg", 'w', encoding='utf-8') as f:
        f.write(f"{header_tag}\n{layer_front_paths}\n</svg>")

    print("Created 3 layers successfully")

split_svg_layers(r'd:\React\polygon-animals\src\assets\Artboard 1.svg')
