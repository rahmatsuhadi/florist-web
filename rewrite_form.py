import re

with open("src/components/features/admin/product/organisms/product/ProductForm.tsx", "r") as f:
    content = f.read()

# 1. Imports
content = content.replace('"use client";\n\nimport React, { useState } from "react";', 
                          '"use client";\n\nimport React, { useState, useActionState, useEffect } from "react";')
content = content.replace('import { Product, ProductVariantGroup, deleteProduct } from "@/services/admin/productService";',
                          'import { Product, ProductVariantGroup, deleteProduct } from "@/services/admin/productService";\nimport { saveProductAction } from "@/services/actions/productActions";')

# 2. Interface
content = content.replace('interface ProductFormProps {\n  initialData?: Product | null;\n  onSave: (data: Omit<Product, "id">) => Promise<any>;\n}', 
                          'interface ProductFormProps {\n  initialData?: Product | null;\n}')

# 3. Component signature and hooks
content = re.sub(r'export const ProductForm: React\.FC<ProductFormProps> = \(\{ initialData, onSave \}\) => \{',
                 'export const ProductForm: React.FC<ProductFormProps> = ({ initialData }) => {', content)

# 4. State replacements
state_old = """  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<{ localUrl: string }[]>([]);
  const [uploadingOptions, setUploadingOptions] = useState<Record<string, boolean>>({});

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    basePrice: initialData?.basePrice || "",
    category: initialData?.category || "",
    description: initialData?.description || "",
    images: initialData?.images || [],
    variantGroups: initialData?.variantGroups || [],
  });"""

state_new = """  const [state, formAction, isPending] = useActionState(saveProductAction, {
    success: false,
    message: "",
    errors: {}
  });

  useEffect(() => {
    if (state?.message && !state.success) {
      toast.error(state.message);
    }
  }, [state]);

  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<{ localUrl: string }[]>([]);
  const [uploadingOptions, setUploadingOptions] = useState<Record<string, boolean>>({});

  const [images, setImages] = useState(initialData?.images || []);
  const [variantGroups, setVariantGroups] = useState(initialData?.variantGroups || []);"""
content = content.replace(state_old, state_new)

# 5. Fix all setFormData references for images and variantGroups
content = content.replace('setFormData((prev) => ({\n            ...prev,\n            images: [...prev.images, url],\n          }));',
                          'setImages((prev) => [...prev, url]);')
content = content.replace('setFormData((prev) => ({\n      ...prev,\n      images: prev.images.filter((_, index) => index !== indexToRemove),\n    }));',
                          'setImages((prev) => prev.filter((_, index) => index !== indexToRemove));')
content = content.replace('setFormData((prev) => ({\n      ...prev,\n      variantGroups: [\n        ...prev.variantGroups,',
                          'setVariantGroups((prev) => [\n        ...prev,')
content = content.replace('setFormData((prev) => ({\n      ...prev,\n      variantGroups: prev.variantGroups.filter((g) => g.id !== groupId),\n    }));',
                          'setVariantGroups((prev) => prev.filter((g) => g.id !== groupId));')

content = content.replace('setFormData((prev) => ({\n      ...prev,\n      variantGroups: prev.variantGroups.map((g) => {',
                          'setVariantGroups((prev) => prev.map((g) => {')
content = content.replace('setFormData((prev) => ({\n      ...prev,\n      variantGroups: prev.variantGroups.map((g) =>\n        g.id === groupId ? { ...g, [field]: value } : g\n      ),\n    }));',
                          'setVariantGroups((prev) => prev.map((g) =>\n        g.id === groupId ? { ...g, [field]: value } : g\n      ));')

content = content.replace('formData.images', 'images')
content = content.replace('formData.variantGroups', 'variantGroups')

# 6. Remove handleSubmit entirely, it's replaced by formAction
handle_submit_regex = r'const handleSubmit = async \(\) => \{[\s\S]*?finally \{[\s\S]*?setIsSaving\(false\);\n    \}\n  \};'
content = re.sub(handle_submit_regex, '', content)

# 7. Replace motion.div wrapper with motion.form
content = content.replace('<motion.div\n      initial={{ opacity: 0, x: 20 }}',
                          '<motion.form\n      action={formAction}\n      initial={{ opacity: 0, x: 20 }}')
content = content.replace('</motion.div>\n  );\n};', '</motion.form>\n  );\n};')

# 8. Hidden inputs & Error messages
# In the Header Bar, update the button to submit
content = content.replace('onClick={handleSubmit}\n            disabled={isSaving}',
                          'type="submit"\n            disabled={isPending}')
content = content.replace('{isSaving ? "Menyimpan..." : "Simpan Produk"}',
                          '{isPending ? "Menyimpan..." : "Simpan Produk"}')

# 9. Add hidden inputs right after the sticky header
hidden_inputs = """      {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}
      <input type="hidden" name="images" value={JSON.stringify(images)} />
      <input type="hidden" name="variantGroups" value={JSON.stringify(variantGroups)} />
"""
content = content.replace('<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">',
                          hidden_inputs + '\n      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">')

# 10. Update text inputs (remove value, onChange, add name, defaultValue, errors)
def replace_input(name_field, title, original_input, is_textarea=False):
    global content
    # This is a bit tricky, let's just do precise string replacements
    pass

content = content.replace('value={formData.name}\n                onChange={(e) =>\n                  setFormData({ ...formData, name: e.target.value })\n                }',
                          f'name="name"\n                defaultValue={{initialData?.name || ""}}')
content = content.replace('value={formData.category}\n                onChange={(e) =>\n                  setFormData({ ...formData, category: e.target.value })\n                }',
                          f'name="category"\n                defaultValue={{initialData?.category || ""}}')
content = content.replace('value={formData.basePrice}\n                onChange={(e) =>\n                  setFormData({ ...formData, basePrice: e.target.value })\n                }',
                          f'name="basePrice"\n                defaultValue={{initialData?.basePrice || ""}}')
content = content.replace('value={formData.description}\n                onChange={(e) =>\n                  setFormData({ ...formData, description: e.target.value })\n                }',
                          f'name="description"\n                defaultValue={{initialData?.description || ""}}')

# Add error spans
content = content.replace('placeholder="Contoh: Classic Red Rose"\n              />',
                          'placeholder="Contoh: Classic Red Rose"\n              />\n              {state.errors?.name && <p className="text-red-500 text-xs mt-1">{state.errors.name[0]}</p>}')
content = content.replace('</select>',
                          '</select>\n              {state.errors?.category && <p className="text-red-500 text-xs mt-1">{state.errors.category[0]}</p>}')
content = content.replace('placeholder="0"\n              />',
                          'placeholder="0"\n              />\n              {state.errors?.basePrice && <p className="text-red-500 text-xs mt-1">{state.errors.basePrice[0]}</p>}')
content = content.replace('placeholder="Tuliskan deskripsi produk..."\n              ></textarea>',
                          'placeholder="Tuliskan deskripsi produk..."\n              ></textarea>\n              {state.errors?.description && <p className="text-red-500 text-xs mt-1">{state.errors.description[0]}</p>}')

# formData.name in delete modal
content = content.replace('formData.name || "ini"', 'initialData?.name || "ini"')

with open("src/components/features/admin/product/organisms/product/ProductForm.tsx", "w") as f:
    f.write(content)

print("ProductForm updated successfully.")
