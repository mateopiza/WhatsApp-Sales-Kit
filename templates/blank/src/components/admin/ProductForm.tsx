import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAdmin } from '../../context/AdminContext';
import { Product, Category, Material, Availability } from '../../types/catalog';
import { ProductFormData, FormValidationErrors } from '../../types/admin';
import { validateProductForm, generateSlug } from '../../utils/validation';
import { Check, X, ArrowLeft, Sparkles } from 'lucide-react';

// Seed suggestions only — Category and Material are free text. Replace these
// with the categories and materials/attributes that fit your own catalog.
const CATEGORY_SUGGESTIONS: { id: Category; label: string }[] = [
  { id: 'categoria-1', label: 'Categoría 1' },
  { id: 'categoria-2', label: 'Categoría 2' },
  { id: 'categoria-3', label: 'Categoría 3' },
];

const MATERIAL_SUGGESTIONS: Material[] = ['Estándar', 'Premium', 'Edición Limitada'];

export const ProductForm: React.FC = () => {
  const { products, addProduct, updateProduct, collectionsList } = useApp();
  const { editingProduct, setActiveTab } = useAdmin();

  const isEditing = Boolean(editingProduct);

  const [formData, setFormData] = useState<ProductFormData>(() => {
    if (editingProduct) {
      return {
        id: editingProduct.id,
        name: editingProduct.name,
        slug: editingProduct.slug,
        reference: editingProduct.reference,
        category: editingProduct.category,
        collection: editingProduct.collection,
        price: editingProduct.price,
        currency: editingProduct.currency,
        short_description: editingProduct.short_description,
        description: editingProduct.description,
        material: editingProduct.material,
        cover_image: editingProduct.cover_image,
        images: [...editingProduct.images],
        availability: editingProduct.availability,
        featured: editingProduct.featured,
        badge: editingProduct.badge || '',
        specifications: { ...editingProduct.specifications },
      };
    }

    return {
      name: '',
      slug: '',
      reference: '',
      category: 'categoria-1',
      collection: 'Colección General',
      price: '',
      currency: 'USD',
      short_description: '',
      description: '',
      material: 'Estándar',
      cover_image: '/assets/products/placeholder-1.svg',
      images: ['/assets/products/placeholder-1.svg'],
      availability: 'disponible',
      featured: false,
      badge: '',
      specifications: {
        weight: '',
        dimensions: '',
      },
    };
  });

  const [errors, setErrors] = useState<FormValidationErrors>({});
  const [activeFormTab, setActiveFormTab] = useState<'general' | 'pricing' | 'narrative' | 'media' | 'specs'>('general');
  const [isCustomCollection, setIsCustomCollection] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Auto generate slug when name changes (if not manually editing slug)
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => {
      const generated = generateSlug(val);
      return {
        ...prev,
        name: val,
        slug: !isEditing ? generated : prev.slug,
      };
    });
    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
  };

  const handleAddImage = () => {
    if (newImageUrl.trim() && !formData.images.includes(newImageUrl.trim())) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()],
      }));
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => {
      const updated = prev.images.filter((_, i) => i !== index);
      return {
        ...prev,
        images: updated.length > 0 ? updated : [prev.cover_image],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateProductForm(formData, products, editingProduct?.id);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    const payload: Product = {
      id: editingProduct?.id || `prod-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      name: formData.name.trim(),
      slug: formData.slug.trim(),
      reference: formData.reference.trim().toUpperCase(),
      category: formData.category,
      collection: formData.collection.trim(),
      price: typeof formData.price === 'string' ? parseFloat(formData.price) : formData.price,
      currency: formData.currency,
      short_description: formData.short_description.trim(),
      description: formData.description.trim(),
      material: formData.material,
      cover_image: formData.cover_image.trim(),
      images: formData.images.length > 0 ? formData.images : [formData.cover_image.trim()],
      availability: formData.availability,
      featured: Boolean(formData.featured),
      badge: formData.badge?.trim() || undefined,
      specifications: {
        weight: formData.specifications.weight?.trim() || undefined,
        dimensions: formData.specifications.dimensions?.trim() || undefined,
      },
    };

    if (isEditing && editingProduct) {
      await updateProduct(editingProduct.id, payload);
    } else {
      await addProduct(payload);
    }

    setActiveTab('catalog');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-cream p-4 sm:p-5 rounded-md border border-taupe/25 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('catalog')}
            className="p-2 text-taupe-contrast hover:text-ink hover:bg-cream-200 border border-taupe/20 rounded-full transition-colors cursor-pointer active:scale-95"
            aria-label="Volver al catálogo"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-display text-xl sm:text-2xl text-ink font-semibold tracking-wide">
              {isEditing ? `Editar Producto: ${editingProduct?.name}` : 'Crear Nuevo Producto'}
            </h2>
            <p className="text-xs text-taupe-contrast mt-0.5 font-light">
              {isEditing ? `Referencia SKU: ${editingProduct?.reference}` : 'Complete la ficha del producto'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('catalog')}
            className="px-4 py-2.5 text-xs uppercase tracking-wider text-taupe-contrast hover:text-ink font-semibold border border-taupe/25 rounded-sm hover:bg-cream-200 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 bg-ink text-cream text-xs uppercase tracking-wider font-semibold rounded-sm hover:bg-ink-dark transition-all shadow-md active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4 text-gold" />
            {isEditing ? 'Guardar Cambios' : 'Publicar Producto'}
          </button>
        </div>
      </div>

      {/* Form Sub-navigation Tabs - Segmented Control Bar */}
      <div className="flex items-center gap-2 border-b border-taupe/25 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'general', label: '1. General' },
          { id: 'pricing', label: '2. Precio & Estado' },
          { id: 'narrative', label: '3. Descripción' },
          { id: 'media', label: '4. Galería' },
          { id: 'specs', label: '5. Ficha Técnica' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveFormTab(tab.id as any)}
            className={`px-4 py-2.5 text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-all rounded-sm border ${
              activeFormTab === tab.id
                ? 'bg-ink text-cream border-ink shadow-md'
                : 'bg-cream text-taupe-contrast hover:text-ink hover:bg-cream-200 border-taupe/20'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: General Info */}
      {activeFormTab === 'general' && (
        <div className="space-y-4 bg-cream p-5 rounded-sm border border-taupe/15 shadow-sm animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1">
                Nombre del Producto *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={handleNameChange}
                placeholder="Ej. Producto Demo"
                className={`w-full px-3 py-2 text-xs bg-cream-200/50 border rounded-sm focus:outline-none focus:border-gold text-ink ${
                  errors.name ? 'border-status-error' : 'border-taupe/20'
                }`}
              />
              {errors.name && <p className="text-[11px] text-status-error mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1">
                Slug URL *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, slug: e.target.value }));
                  if (errors.slug) setErrors((prev) => ({ ...prev, slug: undefined }));
                }}
                placeholder="ej. producto-demo"
                className={`w-full px-3 py-2 text-xs bg-cream-200/50 border rounded-sm focus:outline-none focus:border-gold text-ink font-mono ${
                  errors.slug ? 'border-status-error' : 'border-taupe/20'
                }`}
              />
              {errors.slug && <p className="text-[11px] text-status-error mt-1">{errors.slug}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1">
                Referencia SKU *
              </label>
              <input
                type="text"
                value={formData.reference}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, reference: e.target.value }));
                  if (errors.reference) setErrors((prev) => ({ ...prev, reference: undefined }));
                }}
                placeholder="REF-0101"
                className={`w-full px-3 py-2 text-xs bg-cream-200/50 border rounded-sm focus:outline-none focus:border-gold text-ink font-mono uppercase ${
                  errors.reference ? 'border-status-error' : 'border-taupe/20'
                }`}
              />
              {errors.reference && <p className="text-[11px] text-status-error mt-1">{errors.reference}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1">
                Categoría *
              </label>
              <input
                type="text"
                list="category-suggestions"
                value={formData.category}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, category: e.target.value }));
                  if (errors.category) setErrors((prev) => ({ ...prev, category: undefined }));
                }}
                placeholder="Ej. categoria-1"
                className="w-full px-3 py-2 text-xs bg-cream-200/50 border border-taupe/20 rounded-sm focus:outline-none focus:border-gold text-ink"
              />
              <datalist id="category-suggestions">
                {CATEGORY_SUGGESTIONS.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </datalist>
              {errors.category && <p className="text-[11px] text-status-error mt-1">{errors.category}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1">
              Colección *
            </label>
            {!isCustomCollection ? (
              <div className="flex gap-2">
                <select
                  value={formData.collection}
                  onChange={(e) => setFormData((prev) => ({ ...prev, collection: e.target.value }))}
                  className="flex-1 px-3 py-2 text-xs bg-cream-200/50 border border-taupe/20 rounded-sm focus:outline-none focus:border-gold text-ink"
                >
                  {collectionsList.map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setIsCustomCollection(true)}
                  className="px-3 py-2 text-xs border border-taupe/30 text-taupe-contrast hover:text-ink rounded-sm"
                >
                  + Nueva Colección
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.collection}
                  onChange={(e) => setFormData((prev) => ({ ...prev, collection: e.target.value }))}
                  placeholder="Nombre de la nueva colección..."
                  className="flex-1 px-3 py-2 text-xs bg-cream-200/50 border border-taupe/20 rounded-sm focus:outline-none focus:border-gold text-ink"
                />
                <button
                  type="button"
                  onClick={() => setIsCustomCollection(false)}
                  className="px-3 py-2 text-xs border border-taupe/30 text-taupe-contrast hover:text-ink rounded-sm"
                >
                  Seleccionar Existente
                </button>
              </div>
            )}
            {errors.collection && <p className="text-[11px] text-status-error mt-1">{errors.collection}</p>}
          </div>
        </div>
      )}

      {/* TAB 2: Pricing & Status */}
      {activeFormTab === 'pricing' && (
        <div className="space-y-4 bg-cream p-5 rounded-sm border border-taupe/15 shadow-sm animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1">
                Precio *
              </label>
              <input
                type="number"
                min="1"
                step="any"
                value={formData.price}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, price: e.target.value }));
                  if (errors.price) setErrors((prev) => ({ ...prev, price: undefined }));
                }}
                placeholder="99"
                className={`w-full px-3 py-2 text-xs bg-cream-200/50 border rounded-sm focus:outline-none focus:border-gold text-ink font-mono ${
                  errors.price ? 'border-status-error' : 'border-taupe/20'
                }`}
              />
              {errors.price && <p className="text-[11px] text-status-error mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1">
                Moneda
              </label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData((prev) => ({ ...prev, currency: e.target.value as any }))}
                className="w-full px-3 py-2 text-xs bg-cream-200/50 border border-taupe/20 rounded-sm focus:outline-none focus:border-gold text-ink"
              >
                <option value="USD">USD ($ Dólares)</option>
                <option value="COP">COP ($ Pesos)</option>
                <option value="EUR">EUR (€ Euros)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1">
                Disponibilidad
              </label>
              <select
                value={formData.availability}
                onChange={(e) => setFormData((prev) => ({ ...prev, availability: e.target.value as Availability }))}
                className="w-full px-3 py-2 text-xs bg-cream-200/50 border border-taupe/20 rounded-sm focus:outline-none focus:border-gold text-ink"
              >
                <option value="disponible">Disponible</option>
                <option value="bajo-pedido">Bajo Pedido</option>
                <option value="pieza-unica">Pieza Única</option>
                <option value="agotado">Agotado</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-taupe/10">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1">
                Etiqueta / Badge Especial (Opcional)
              </label>
              <input
                type="text"
                value={formData.badge || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, badge: e.target.value }))}
                placeholder="Ej. Nuevo, Más Vendido, Oferta"
                className="w-full px-3 py-2 text-xs bg-cream-200/50 border border-taupe/20 rounded-sm focus:outline-none focus:border-gold text-ink"
              />
            </div>

            <div className="flex items-center gap-3 pt-6">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))}
                  className="w-4 h-4 accent-ink rounded"
                />
                <span className="text-xs uppercase tracking-wider font-semibold text-ink flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
                  Destacar en Portada
                </span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Description & Material */}
      {activeFormTab === 'narrative' && (
        <div className="space-y-4 bg-cream p-5 rounded-sm border border-taupe/15 shadow-sm animate-fade-in">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1">
              Material *
            </label>
            <input
              type="text"
              list="material-suggestions"
              value={formData.material}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, material: e.target.value }));
                if (errors.material) setErrors((prev) => ({ ...prev, material: undefined }));
              }}
              placeholder="Ej. Estándar"
              className="w-full px-3 py-2 text-xs bg-cream-200/50 border border-taupe/20 rounded-sm focus:outline-none focus:border-gold text-ink"
            />
            <datalist id="material-suggestions">
              {MATERIAL_SUGGESTIONS.map((mat) => (
                <option key={mat} value={mat} />
              ))}
            </datalist>
            {errors.material && <p className="text-[11px] text-status-error mt-1">{errors.material}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1">
              Descripción Corta (Máximo 200 caracteres) *
            </label>
            <textarea
              rows={2}
              value={formData.short_description}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, short_description: e.target.value }));
                if (errors.short_description) setErrors((prev) => ({ ...prev, short_description: undefined }));
              }}
              placeholder="Resumen para tarjetas de catálogo..."
              className={`w-full px-3 py-2 text-xs bg-cream-200/50 border rounded-sm focus:outline-none focus:border-gold text-ink leading-relaxed ${
                errors.short_description ? 'border-status-error' : 'border-taupe/20'
              }`}
            />
            <div className="flex justify-between items-center text-[10px] text-taupe-contrast mt-0.5">
              <span>{errors.short_description ? <span className="text-status-error">{errors.short_description}</span> : 'Mínimo 10 caracteres'}</span>
              <span>{formData.short_description.length}/200</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1">
              Descripción Completa *
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, description: e.target.value }));
                if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }));
              }}
              placeholder="Historia del producto, detalles de confección, casos de uso..."
              className={`w-full px-3 py-2 text-xs bg-cream-200/50 border rounded-sm focus:outline-none focus:border-gold text-ink leading-relaxed ${
                errors.description ? 'border-status-error' : 'border-taupe/20'
              }`}
            />
            {errors.description && <p className="text-[11px] text-status-error mt-1">{errors.description}</p>}
          </div>
        </div>
      )}

      {/* TAB 4: Media & Image Gallery */}
      {activeFormTab === 'media' && (
        <div className="space-y-5 bg-cream p-5 rounded-sm border border-taupe/15 shadow-sm animate-fade-in">
          {/* Cover image */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1">
              Imagen de Portada Principal (Cover) *
            </label>
            <div className="flex items-center gap-3">
              <img
                src={formData.cover_image}
                alt="Cover Preview"
                className="w-16 h-16 object-cover rounded-sm border border-taupe/20 bg-stone/20 shrink-0"
              />
              <input
                type="text"
                value={formData.cover_image}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, cover_image: e.target.value }));
                  if (errors.cover_image) setErrors((prev) => ({ ...prev, cover_image: undefined }));
                }}
                placeholder="/assets/products/placeholder-1.svg"
                className="flex-1 px-3 py-2 text-xs bg-cream-200/50 border border-taupe/20 rounded-sm focus:outline-none focus:border-gold text-ink font-mono"
              />
            </div>
            {errors.cover_image && <p className="text-[11px] text-status-error mt-1">{errors.cover_image}</p>}
          </div>

          {/* Gallery images */}
          <div className="pt-3 border-t border-taupe/10">
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-2">
              Imágenes Secundarias de Galería ({formData.images.length})
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
              {formData.images.map((imgUrl, idx) => (
                <div key={idx} className="relative group border border-taupe/20 rounded-sm overflow-hidden bg-cream-200">
                  <img src={imgUrl} alt={`Foto ${idx + 1}`} className="w-full h-24 object-cover" />
                  <div className="absolute inset-0 bg-ink/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, cover_image: imgUrl }))}
                      className="px-2 py-1 bg-cream text-ink text-[10px] uppercase font-semibold rounded-sm"
                    >
                      Cover
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="p-1 bg-status-error text-cream rounded-sm"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Añadir URL de imagen adicional..."
                className="flex-1 px-3 py-2 text-xs bg-cream-200/50 border border-taupe/20 rounded-sm focus:outline-none focus:border-gold text-ink font-mono"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-2 bg-cream-200 border border-taupe/30 text-ink text-xs uppercase font-medium rounded-sm hover:bg-cream-300 transition-colors"
              >
                + Añadir Foto
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Technical Specs */}
      {activeFormTab === 'specs' && (
        <div className="space-y-4 bg-cream p-5 rounded-sm border border-taupe/15 shadow-sm animate-fade-in">
          <p className="text-xs text-taupe-contrast font-light mb-2">
            Especificaciones opcionales para la ficha técnica del producto.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1">
                Peso Estimado (Weight)
              </label>
              <input
                type="text"
                value={formData.specifications.weight || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    specifications: { ...prev.specifications, weight: e.target.value },
                  }))
                }
                placeholder="Ej. 250 g"
                className="w-full px-3 py-2 text-xs bg-cream-200/50 border border-taupe/20 rounded-sm focus:outline-none focus:border-gold text-ink"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1">
                Dimensiones (Dimensions)
              </label>
              <input
                type="text"
                value={formData.specifications.dimensions || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    specifications: { ...prev.specifications, dimensions: e.target.value },
                  }))
                }
                placeholder="Ej. 20 x 10 x 5 cm"
                className="w-full px-3 py-2 text-xs bg-cream-200/50 border border-taupe/20 rounded-sm focus:outline-none focus:border-gold text-ink"
              />
            </div>
          </div>
        </div>
      )}
    </form>
  );
};
