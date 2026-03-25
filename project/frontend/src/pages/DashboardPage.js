import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import MainLayout from '../components/layout/MainLayout';
import ProductCard from '../components/common/ProductCard';
import ProductModal from '../components/common/ProductModal';
import Spinner from '../components/common/Spinner';
import { productService } from '../services/productService';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { isAdmin } = useAuth();

  const [products, setProducts]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [saving, setSaving]             = useState(false);
  const [search, setSearch]             = useState('');
  const [debouncedSearch, setDebounced] = useState('');

  // Modal state
  const [modalOpen, setModalOpen]       = useState(false);
  const [editProduct, setEditProduct]   = useState(null);

  // Confirm-delete state
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ── Debounce search input (300 ms) ────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  // ── Fetch products ────────────────────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productService.getAll(debouncedSearch);
      setProducts(data);
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // ── CRUD handlers ─────────────────────────────────────────────────────────
  const handleCreate = async (formData) => {
    setSaving(true);
    try {
      await productService.create(formData);
      toast.success('Product created ✅');
      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create product');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (formData) => {
    setSaving(true);
    try {
      await productService.update(editProduct.id, formData);
      toast.success('Product updated ✅');
      setModalOpen(false);
      setEditProduct(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await productService.delete(deleteTarget.id);
      toast.success('Product deleted');
      setDeleteTarget(null);
      fetchProducts();
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const openEdit = (product) => {
    setEditProduct(product);
    setModalOpen(true);
  };

  const openCreate = () => {
    setEditProduct(null);
    setModalOpen(true);
  };

  return (
    <MainLayout>
      {/* ── Page Header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isAdmin ? '🛠️ Product Management' : '🛒 Our Products'}
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {products.length} product{products.length !== 1 ? 's' : ''} available
          </p>
        </div>

        <div className="flex gap-3 items-center">
          {/* Search */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              className="input-field pl-9 w-48 sm:w-64"
              placeholder="Search products…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Add product (admin only) */}
          {isAdmin && (
            <button onClick={openCreate} className="btn-primary whitespace-nowrap">
              + Add Product
            </button>
          )}
        </div>
      </div>

      {/* ── Product Grid ─────────────────────────────────────────────────── */}
      {loading ? (
        <Spinner />
      ) : products.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <p className="text-5xl mb-4">📦</p>
          <p className="text-lg font-medium">No products found</p>
          {isAdmin && (
            <button onClick={openCreate} className="btn-primary mt-4">
              Add your first product
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {/* ── Create / Edit Modal ───────────────────────────────────────────── */}
      <ProductModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditProduct(null); }}
        onSubmit={editProduct ? handleUpdate : handleCreate}
        product={editProduct}
        loading={saving}
      />

      {/* ── Delete Confirm Dialog ─────────────────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="text-center">
              <p className="text-4xl mb-3">🗑️</p>
              <h3 className="text-lg font-bold text-gray-900">Delete Product?</h3>
              <p className="text-gray-500 text-sm mt-2">
                Are you sure you want to delete{' '}
                <strong>"{deleteTarget.name}"</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button onClick={handleDelete} className="flex-1 btn-danger">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default DashboardPage;
