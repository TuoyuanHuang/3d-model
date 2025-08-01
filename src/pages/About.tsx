import React from 'react';
import { Users, Award, Clock, MapPin, Target, Heart } from 'lucide-react';

const About: React.FC = () => {
  const stats = [
    { label: 'Progetti Completati', value: '500+', icon: Award },
    { label: 'Clienti Soddisfatti', value: '200+', icon: Users },
    { label: 'Anni di Esperienza', value: '5+', icon: Clock },
    { label: 'Materiali Disponibili', value: '10+', icon: MapPin },
  ];

  const team = [
    {
      name: 'Marco Rossi',
      role: 'Fondatore & CEO',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg',
      description: 'Ingegnere meccanico con una passione per l\'innovazione e la tecnologia 3D.'
    },
    {
      name: 'Laura Bianchi',
      role: 'Designer Tecnico',
      image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg',
      description: 'Esperta in design industriale e modellazione 3D con 8 anni di esperienza.'
    },
    {
      name: 'Alessandro Verdi',
      role: 'Specialista Materiali',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg',
      description: 'Chimico dei materiali specializzato in polimeri e tecnologie di stampa 3D.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Technology Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Le Nostre Tecnologie
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Utilizziamo le tecnologie di stampa 3D più avanzate del momento, accostate a tecniche di finitura manuale, per garantire risultati eccellenti e caratteristici del migliore artigianato italiano.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">FDM/FFF</h3>
              <p className="text-gray-600 text-sm">
                Stampa a deposizione fusa per oggetti funzionali e prototipi
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">SLA/DLP</h3>
              <p className="text-gray-600 text-sm">
                Stereolitografia per dettagli ultra-precisi e superfici lisce
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">SLS</h3>
              <p className="text-gray-600 text-sm">
                Sinterizzazione laser per parti meccaniche resistenti
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Multi-Material</h3>
              <p className="text-gray-600 text-sm">
                Stampa multi-materiale per progetti complessi
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="flex items-center mb-6">
                <Target className="h-8 w-8 text-blue-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">La Nostra Missione</h2>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Rendere accessibile la tecnologia di stampa 3D a tutti, dalle aziende ai privati, 
                offrendo servizi di alta qualità, consulenza personalizzata e soluzioni innovative. 
                Crediamo che ogni idea meriti di essere realizzata con precisione e cura.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm">
              <div className="flex items-center mb-6">
                <Heart className="h-8 w-8 text-red-500 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">I Nostri Valori</h2>
              </div>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <span><strong>Qualità:</strong> Utilizziamo solo materiali premium e tecnologie all'avanguardia</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <span><strong>Innovazione:</strong> Sempre alla ricerca di nuove soluzioni e miglioramenti</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <span><strong>Servizio:</strong> Supporto personalizzato per ogni cliente e progetto</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;