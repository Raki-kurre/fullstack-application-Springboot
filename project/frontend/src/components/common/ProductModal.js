import React, { useState, useEffect } from 'react';

const EMPTY = { name: '', description: '', price: '', imageUrl: '' };

const ProductModal = ({ isOpen, onClose, onSubmit, product, loading }) => {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  // Populate form when editing an existing product
  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        imageUrl: product.imageUrl || '',
      });
    } else {
      setForm(EMPTY);
    }
    setErrors({});
  }, [product, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.price || isNaN(form.price) || parseFloat(form.price) <= 0)
      e.price = 'Valid price is required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit({ ...form, price: parseFloat(form.price) });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-gray-900">
            {product ? '✏️ Edit Product' : '➕ Add New Product'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">
            &times;
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="label">Product Name *</label>
            <input
              className="input-field"
              placeholder="e.g. Wireless Headphones"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && <p className="error-msg">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="label">Description</label>
            <textarea
              className="input-field resize-none"
              rows={3}
              placeholder="Short product description..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </div>

          {/* Price */}
          <div>
            <label className="label">Price ($) *</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              className="input-field"
              placeholder="0.00"
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
            />
            {errors.price && <p className="error-msg">{errors.price}</p>}
          </div>

          {/* Image URL */}
          <div>
            <label className="label">Image URL</label>
            <input
              className="input-field"
              placeholder="https://..."
              value={form.imageUrl}
              onChange={e => setForm({ ...form, imageUrl: e.target.value })}
            />
            {form.imageUrl && (
              <img src={form.imageUrl} alt="preview"
                className="mt-2 h-24 w-full object-cover rounded-lg border"
                onError={e => { e.target.style.display = 'none'; }} />
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 btn-secondary">
              Cancel
            </button>
            <button type="submit" className="flex-1 btn-primary" disabled={loading}>
              {loading ? 'Saving…' : product ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
