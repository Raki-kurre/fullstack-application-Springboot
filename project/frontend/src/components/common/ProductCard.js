import React from 'react';
import { useAuth } from '../../context/AuthContext';

const PLACEHOLDER = 'https://via.placeholder.com/400x300?text=No+Image';

const ProductCard = ({ product, onEdit, onDelete }) => {
  const { isAdmin } = useAuth();

  return (
    <div className="card flex flex-col hover:shadow-md transition-shadow duration-200">
      {/* Product image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        <img
          src={product.imageUrl || PLACEHOLDER}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = PLACEHOLDER; }}
        />
        {isAdmin && (
          <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900
            text-xs font-bold px-2 py-0.5 rounded-full">
            ADMIN
          </span>
        )}
      </div>

      {/* Product details */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 text-base line-clamp-2 mb-1">
          {product.name}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2 flex-1 mb-3">
          {product.description || 'No description available.'}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-blue-600">
            ${parseFloat(product.price).toFixed(2)}
          </span>
          <span className="text-xs text-gray-400">
            #{product.id}
          </span>
        </div>

        {/* User: Add to Cart button — Admin: Edit/Delete */}
        {isAdmin ? (
          <div className="flex gap-2 mt-auto">
            <button
              onClick={() => onEdit(product)}
              className="flex-1 btn-secondary text-sm py-1.5"
            >
              ✏️ Edit
            </button>
            <button
              onClick={() => onDelete(product)}
              className="flex-1 btn-danger text-sm py-1.5"
            >
              🗑️ Delete
            </button>
          </div>
        ) : (
          <button className="w-full btn-primary text-sm py-2 mt-auto">
            🛒 Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
