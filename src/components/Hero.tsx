import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Clock } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-900 opacity-50"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Trasformiamo le tue
                <span className="text-blue-300 block">idee in realtà</span>
              </h1>
              <p className="text-xl lg:text-2xl text-blue-100">
                Stampa 3D professionale di alta qualità per ogni esigenza
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-500 bg-opacity-30 p-2 rounded-lg">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Velocità</h3>
                  <p className="text-sm text-blue-200">Consegna rapida</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="bg-blue-500 bg-opacity-30 p-2 rounded-lg">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Qualità</h3>
                  <p className="text-sm text-blue-200">Materiali premium</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="bg-blue-500 bg-opacity-30 p-2 rounded-lg">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Precisione</h3>
                  <p className="text-sm text-blue-200">Dettagli perfetti</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/catalogo"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center space-x-2 group"
              >
                <span>Esplora il Catalogo</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/contatti"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors duration-200 flex items-center justify-center"
              >
                Richiedi Preventivo
              </Link>
            </div>
          </div>

          
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full opacity-10 animate-pulse delay-1000"></div>
      </div>
    </section>
  );
};

export default Hero;