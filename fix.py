import os
import re

files = [
    'src/components/Dropzone.tsx',
    'src/pages/ImageToPdf.tsx',
    'src/pages/TextToPdf.tsx',
    'src/pages/CompressPdf.tsx',
    'src/pages/MergePdf.tsx',
    'src/pages/ExtractPages.tsx',
    'src/pages/Contact.tsx'
]

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    if 'alert(' in content:
        # Add import
        if 'import { toast } from \'sonner\';' not in content:
            content = "import { toast } from 'sonner';\n" + content
            
        if 'Contact.tsx' in f:
            content = content.replace("alert('Message sent successfully!');", "toast.success('Message sent successfully!');")
        else:
            content = re.sub(r'alert\((.*?)\)', r'toast.error(\1)', content)
            
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f'Updated {f}')
