#!/usr/bin/env python3
import re

# Read the file
with open('/src/imports/HomeDesktop.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace all instances of text-[rgba(18,21,14,0.71)] with dark mode support
content = content.replace('text-[rgba(18,21,14,0.71)]', 'text-[rgba(18,21,14,0.71)] dark:text-[rgba(200,200,200,0.9)]')

# Write back
with open('/src/imports/HomeDesktop.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Successfully updated all text colors!")
