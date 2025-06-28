import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';

const CookieBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setShowBanner(false);
  };

  const rejectCookies = () => {
    // Store rejection but still hide banner
    localStorage.setItem('cookiesRejected', 'true');
    setShowBanner(false);
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-4">
          <div className="mb-4 md:mb-0 text-gray-700 text-center md:text-left">
            <p className="mb-2">
              Questo sito utilizza i cookie per migliorare la tua esperienza. 
              Continuando a navigare, accetti il nostro utilizzo dei cookie.
            </p>
            <button 
              onClick={toggleDetails}
              className="text-blue-600 hover:text-blue-800 font-medium underline"
            >
              {showDetails ? 'Nascondi dettagli' : 'Maggiori informazioni'}
            </button>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <Link 
              to="/privacy-policy" 
              className="text-blue-600 hover:text-blue-800 font-medium text-center"
            >
              Privacy Policy
            </Link>
            <button 
              onClick={rejectCookies}
              className="border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
            >
              Rifiuta
            </button>
            <button 
              onClick={acceptCookies}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
            >
              Accetta
            </button>
          </div>
        </div>
        
        {showDetails && (
          <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 mt-2">
            <h4 className="font-bold mb-2">Informazioni sui Cookie</h4>
            <p className="mb-2">I cookie sono piccoli file di testo che vengono memorizzati sul tuo dispositivo quando visiti un sito web. Utilizziamo diversi tipi di cookie:</p>
            
            <ul className="list-disc pl-5 mb-2 space-y-1">
              <li><strong>Cookie necessari:</strong> Essenziali per il funzionamento del sito web.</li>
              <li><strong>Cookie di preferenza:</strong> Permettono al sito di ricordare le tue preferenze e scelte.</li>
              <li><strong>Cookie statistici:</strong> Ci aiutano a capire come i visitatori interagiscono con il sito.</li>
              <li><strong>Cookie di marketing:</strong> Utilizzati per mostrarti annunci pertinenti in base ai tuoi interessi.</li>
            </ul>
            
            <p>Puoi modificare le tue preferenze sui cookie in qualsiasi momento visitando la nostra pagina sulla Privacy Policy. Rifiutando i cookie non essenziali, alcune funzionalità del sito potrebbero non essere disponibili.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CookieBanner;