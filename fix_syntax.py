import re

with open("src/components/features/admin/product/organisms/product/ProductForm.tsx", "r") as f:
    content = f.read()

# The error was caused by my previous multi_replace that changed `})` to `)`.
# Let's fix the specific blocks.

content = content.replace('        return g;\n      )\n    );\n  };',
                          '        return g;\n      })\n    );\n  };')

with open("src/components/features/admin/product/organisms/product/ProductForm.tsx", "w") as f:
    f.write(content)

print("Fixed syntax")
