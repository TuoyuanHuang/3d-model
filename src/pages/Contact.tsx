import React from 'react';
import ContactForm from '../components/ContactForm';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';

const Contact: React.FC = () => {
  const contactInfo = [
    {
      icon: Phone,
      label: 'Telefono',
      value: '+39 123 456 7890',
      description: 'Lun-Ven 9:00-18:00'
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'info@print3dpro.it',
      description: 'Risposta entro 24h'
    },
    {
      icon: MapPin,
      label: 'Indirizzo',
      value: 'Via Roma 123, 20121 Milano',
      description: 'Su appuntamento'
    },
    {
      icon: Clock,
      label: 'Orari',
      value: 'Lun-Ven 9:00-18:00',
      description: 'Sab 9:00-13:00'
    }
  ];

  const faqs = [
    {
      question: 'Quali materiali utilizzate?',
      answer: 'Utilizziamo una vasta gamma di materiali tra cui PLA, ABS, PETG, TPU, resine fotopolimeriche e materiali speciali come fibra di carbonio e metallo.'
    },
    {
      question: 'Quanto tempo richiede un progetto?',
      answer: 'I tempi variano in base alla complessità del progetto. Oggetti semplici possono essere pronti in 24-48 ore, mentre progetti complessi possono richiedere 1-2 settimane.'
    },
    {
      question: 'Offrite servizi di progettazione?',
      answer: 'Sì, il nostro team di designer può aiutarti a sviluppare il tuo progetto da zero o ottimizzare modelli esistenti per la stampa 3D.'
    },
    {
      question: 'Quali sono i costi?',
      answer: 'I costi dipendono dalle dimensioni, materiale, complessità e quantità. Contattaci per un preventivo personalizzato gratuito.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Contattaci per servizi e prodotti personalizzati
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Siamo qui per rispondere alle tue domande e aiutarti a realizzare i tuoi progetti. 
              Contattaci per una consulenza gratuita.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{info.label}</h3>
                  <p className="text-blue-600 font-medium mb-1">{info.value}</p>
                  <p className="text-sm text-gray-600">{info.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Domande Frequenti
            </h2>
            <p className="text-xl text-gray-600">
              Trova rapidamente le risposte alle domande più comuni
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default Contact;