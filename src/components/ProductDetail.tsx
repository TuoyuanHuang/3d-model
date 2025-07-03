electedColor.images.length > 1 && (
              <div className="flex space-x-2">
                {selectedColor.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <LazyImage
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              {product.featured && (
                <div className="inline-flex items-center space-x-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                  <Star className="h-4 w-4 fill-current" />
                  <span>In Evidenza</span>
                </div>
              )}
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                {category?.name}
              </p>
              <div className="text-3xl font-bold text-blue-600">
                €{currentPrice.toFixed(2)}
              </div>
            </div>

            <div className="prose prose-gray max-w-none">
              <p>{product.description}</p>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifiche Tecniche</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Package className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Materiale</p>
                    <p className="font-medium">{material?.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Ruler className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Dimensioni</p>
                    <p className="font-medium">{selectedSize.dimensions}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Palette className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Colori disponibili</p>
                    <p className="font-medium">{product.colors.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Dimensioni
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSizeIndex(index)}
                    className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-colors ${
                      selectedSizeIndex === index
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <span className="block">{size.name}</span>
                    <span className="text-xs text-gray-500">{size.dimensions}</span>
                    {size.priceModifier > 0 && (
                      <span className="text-xs text-gray-500">+€{size.priceModifier.toFixed(2)}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Colori Disponibili
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColorIndex(index)}
                    className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-colors ${
                      selectedColorIndex === index
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {color.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantità</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  -
                </button>
                <span className="font-medium text-gray-900 w-12 text-center text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Caratteristiche
                </h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Customer Note */}
            <div>
              <label htmlFor="customerNote" className="block text-lg font-semibold text-gray-900 mb-3">
                Note per il Prodotto (opzionale)
              </label>
              <textarea
                id="customerNote"
                name="customerNote"
                rows={3}
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                placeholder="Es: 'Vorrei questo prodotto con una finitura opaca', 'Si prega di incidere le iniziali AB'"
              />
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding || cartLoading}
                  className="bg-gray-100 hover:bg-gray-200 disabled:bg-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  {isAdding ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
                      <span>Aggiunta...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-5 w-5" />
                      <span>Aggiungi al Carrello</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={cartLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Acquista Ora</span>
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>info@3dsumisura.it</span>
                </div>
                
                <div className="bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>+39 123 456 7890</span>
                </div>
              </div>
            </div>

            {/* Material Info */}
            {material && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Informazioni sul Materiale
                </h4>
                <p className="text-sm text-gray-600">
                  {material.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Back to Catalog */}
        <div className="mt-12 text-center">
          <Link
            to="/catalogo"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Torna al Catalogo</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;