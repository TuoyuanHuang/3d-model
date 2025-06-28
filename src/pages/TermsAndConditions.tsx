import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, Truck, CreditCard } from 'lucide-react';

const TermsAndConditions = () => {
  return (
    <div className="bg-white">
      {/* Header/Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center">Termini e Condizioni</h1>
          <p className="mt-4 text-xl text-center text-blue-100">
            Regole di utilizzo del servizio 3D su Misura
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium">
            <ArrowLeft className="h-4 w-4" />
            <span>Torna alla Home</span>
          </Link>
        </div>
        
        <div className="prose prose-lg prose-blue mx-auto">
          <p className="text-lg">
            I presenti Termini e Condizioni ("Termini") regolano l'utilizzo del sito web 3D su Misura ("Sito") e i servizi di stampa 3D offerti da 3D su Misura ("Servizi"). Utilizzando il Sito o i Servizi, l'utente accetta di essere vincolato dai presenti Termini.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 flex items-center">
            <FileText className="h-6 w-6 mr-2 text-blue-600" />
            Definizioni
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>"Utente"</strong>: qualsiasi persona che accede o utilizza il Sito o i Servizi.</li>
            <li><strong>"Contenuti"</strong>: tutti i materiali, informazioni, testi, grafica, loghi, design, immagini, fotografie, video, musica, suoni, dati, software e altri materiali presenti sul Sito.</li>
            <li><strong>"Modelli 3D"</strong>: file digitali tridimensionali caricati dagli Utenti o forniti da 3D su Misura per la stampa.</li>
            <li><strong>"Prodotti"</strong>: oggetti fisici creati tramite i Servizi di stampa 3D.</li>
          </ul>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 flex items-center">
            <Shield className="h-6 w-6 mr-2 text-blue-600" />
            Registrazione e Account
          </h2>
          <p>
            Per utilizzare alcuni dei Servizi, potrebbe essere necessario registrarsi e creare un account. L'Utente si impegna a fornire informazioni accurate, complete e aggiornate durante il processo di registrazione e a mantenere aggiornate tali informazioni.
          </p>
          <p>
            L'Utente è responsabile del mantenimento della riservatezza delle proprie credenziali di accesso e di tutte le attività che si verificano sotto il proprio account. L'Utente accetta di notificare immediatamente a 3D su Misura qualsiasi utilizzo non autorizzato del proprio account o qualsiasi altra violazione della sicurezza.
          </p>
          <p>
            3D su Misura si riserva il diritto di disattivare qualsiasi account, in qualsiasi momento, se ritiene che l'Utente abbia violato qualsiasi disposizione dei presenti Termini.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 flex items-center">
            <CreditCard className="h-6 w-6 mr-2 text-blue-600" />
            Ordini e Pagamenti
          </h2>
          <p>
            Effettuando un ordine tramite il Sito, l'Utente dichiara di avere almeno 18 anni o di avere il consenso di un genitore o tutore legale.
          </p>
          <p>
            I prezzi dei Prodotti sono indicati sul Sito e possono essere soggetti a modifiche senza preavviso. I prezzi sono comprensivi di IVA, ove applicabile.
          </p>
          <p>
            Il pagamento può essere effettuato tramite i metodi di pagamento indicati sul Sito. Effettuando un ordine, l'Utente autorizza 3D su Misura o i suoi fornitori di servizi di pagamento di terze parti a addebitare l'importo corrispondente sul metodo di pagamento selezionato.
          </p>
          <p>
            3D su Misura si riserva il diritto di rifiutare o annullare qualsiasi ordine per qualsiasi motivo, inclusi errori nei prezzi o nella disponibilità dei Prodotti, sospetto di frode o altre attività sospette.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 flex items-center">
            <Truck className="h-6 w-6 mr-2 text-blue-600" />
            Consegna e Spedizione
          </h2>
          <p>
            3D su Misura si impegna a rispettare i tempi di consegna stimati, ma non garantisce tempi di consegna specifici. I tempi di consegna possono variare in base a diversi fattori, tra cui la complessità del Prodotto, il volume di ordini e la disponibilità dei materiali.
          </p>
          <p>
            L'Utente è responsabile di fornire informazioni di spedizione accurate e complete. 3D su Misura non è responsabile per ritardi o mancate consegne dovuti a informazioni di spedizione errate o incomplete fornite dall'Utente.
          </p>
          <p>
            Il rischio di perdita e il titolo di proprietà dei Prodotti passano all'Utente al momento della consegna al vettore di spedizione.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Proprietà Intellettuale</h2>
          <p>
            Tutti i Contenuti presenti sul Sito, ad eccezione dei Modelli 3D caricati dagli Utenti, sono di proprietà di 3D su Misura o dei suoi licenzianti e sono protetti dalle leggi sulla proprietà intellettuale.
          </p>
          <p>
            Caricando Modelli 3D sul Sito, l'Utente concede a 3D su Misura una licenza non esclusiva, mondiale, royalty-free, sublicenziabile e trasferibile per utilizzare, riprodurre, distribuire, preparare opere derivate, visualizzare ed eseguire i Modelli 3D in relazione alla fornitura dei Servizi.
          </p>
          <p>
            L'Utente dichiara e garantisce di possedere o di avere i diritti necessari per concedere la licenza di cui sopra per qualsiasi Modello 3D caricato sul Sito.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contenuti Proibiti</h2>
          <p>
            L'Utente non può caricare, pubblicare o altrimenti trasmettere attraverso il Sito qualsiasi Modello 3D o contenuto che:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Violi qualsiasi legge o regolamento applicabile;</li>
            <li>Infranga i diritti di proprietà intellettuale di terzi;</li>
            <li>Sia diffamatorio, calunnioso, pornografico, osceno, offensivo, molesto o discriminatorio;</li>
            <li>Promuova attività illegali o dannose;</li>
            <li>Contenga virus, malware o altri codici dannosi;</li>
            <li>Rappresenti armi da fuoco, loro componenti o altri oggetti la cui produzione o possesso sia vietato dalla legge.</li>
          </ul>
          <p>
            3D su Misura si riserva il diritto di rimuovere qualsiasi contenuto che violi questa politica e di sospendere o terminare l'account dell'Utente.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Limitazione di Responsabilità</h2>
          <p>
            Nei limiti consentiti dalla legge applicabile, 3D su Misura non sarà responsabile per danni indiretti, incidentali, speciali, consequenziali o punitivi, inclusi perdita di profitti, dati, uso, avviamento o altre perdite intangibili, derivanti da o in relazione all'utilizzo o all'impossibilità di utilizzare il Sito o i Servizi.
          </p>
          <p>
            La responsabilità totale di 3D su Misura derivante da o in relazione ai presenti Termini o dall'utilizzo o impossibilità di utilizzare il Sito o i Servizi non supererà l'importo pagato dall'Utente a 3D su Misura nei sei mesi precedenti l'evento che ha dato origine alla responsabilità, o 100 euro se non è stato effettuato alcun pagamento.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Indennizzo</h2>
          <p>
            L'Utente accetta di indennizzare, difendere e manlevare 3D su Misura e i suoi funzionari, direttori, dipendenti, agenti, licenzianti e fornitori da e contro qualsiasi reclamo, responsabilità, danno, giudizio, premio, perdita, costo, spesa o onorario (inclusi ragionevoli onorari legali) derivanti da o in relazione alla violazione dei presenti Termini da parte dell'Utente o all'utilizzo del Sito o dei Servizi da parte dell'Utente.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Modifiche ai Termini</h2>
          <p>
            3D su Misura si riserva il diritto di modificare o sostituire questi Termini in qualsiasi momento a sua esclusiva discrezione. La versione più aggiornata sarà sempre disponibile sul Sito con la data di efficacia. È responsabilità dell'Utente controllare periodicamente eventuali modifiche. L'uso continuato del Sito o dei Servizi dopo la pubblicazione di eventuali modifiche costituisce accettazione di tali modifiche.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Legge Applicabile e Foro Competente</h2>
          <p>
            I presenti Termini sono regolati e interpretati in conformità con le leggi italiane, senza riguardo ai principi di conflitto di leggi.
          </p>
          <p>
            Qualsiasi controversia derivante da o in relazione ai presenti Termini sarà soggetta alla giurisdizione esclusiva dei tribunali di Milano, Italia.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Disposizioni Generali</h2>
          <p>
            Se una qualsiasi disposizione dei presenti Termini è ritenuta non valida o inapplicabile, tale disposizione sarà limitata o eliminata nella misura minima necessaria e le restanti disposizioni dei Termini rimarranno in pieno vigore ed effetto.
          </p>
          <p>
            Il mancato esercizio o applicazione da parte di 3D su Misura di qualsiasi diritto o disposizione dei Termini non costituirà una rinuncia a tale diritto o disposizione.
          </p>
          <p>
            I presenti Termini costituiscono l'intero accordo tra l'Utente e 3D su Misura riguardo all'utilizzo del Sito e dei Servizi e sostituiscono qualsiasi accordo precedente tra l'Utente e 3D su Misura.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contatti</h2>
          <p>
            Per domande sui presenti Termini, contattare 3D su Misura all'indirizzo email: <a href="mailto:info@3dsumisura.it" className="text-blue-600 hover:text-blue-800">info@3dsumisura.it</a>
          </p>
          
          <div className="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-500">
            <p>Ultimo aggiornamento: 27 giugno 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;