import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Info, ShoppingCart, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  material: string;
  colors: string[];
  dimensions: string;
  description: string;
  images: string[];
  featured?: boolean;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { user } = useAuth();
  const { addToCart, loading } = useCart();
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      window.location.href = '/login';
      return;
    }

    try {
      setIsAdding(true);
      await addToCart(product.id, product.name, product.price, 1, selectedColor);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group">
      <div className="relative overflow-hidden">
        <Link to={`/prodotto/${product.id}`}>
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        {product.featured && (
          <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
            <Star className="h-3 w-3 fill-current" />
            <span>In Evidenza</span>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white bg-opacity-90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-gray-700">
          €{product.price.toFixed(2)}
        </div>
      </div>

      <div className="p-4">
        <Link to={`/prodotto/${product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
            {product.material.toUpperCase()}
          </span>
          <span className="text-xs text-gray-500">
            {product.dimensions}
          </span>
        </div>

        {/* Color Selection */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs text-gray-500">Colore:</span>
            <span className="text-xs font-medium text-gray-700">{selectedColor}</span>
          </div>
          <div className="flex space-x-1">
            {product.colors.slice(0, 4).map((color, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedColor(color);
                }}
                className={`w-6 h-6 rounded-full border-2 transition-all ${
                  selectedColor === color 
                    ? 'border-blue-500 scale-110' 
                    : 'border-gray-300 hover:border-gray-400'
                } bg-gradient-to-br from-gray-200 to-gray-400`}
                title={color}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-gray-500 ml-1 flex items-center">
                +{product.colors.length - 4}
              </span>
            )}
          </div>
        </div>

        <div className="flex space-x-2">
          <Link
            to={`/prodotto/${product.id}`}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Info className="h-4 w-4" />
            <span>Dettagli</span>
          </Link>
          
          <button
            onClick={handleAddToCart}
            disabled={isAdding || loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 group"
          >
            {isAdding ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Aggiunta...</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                <span>Carrello</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;