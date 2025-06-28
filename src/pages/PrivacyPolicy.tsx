import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="bg-white">
      {/* Header/Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center">Privacy Policy</h1>
          <p className="mt-4 text-xl text-center text-blue-100">
            Informazioni sul trattamento dei dati personali
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
            Questa Applicazione raccoglie alcuni Dati Personali dei propri Utenti.
          </p>
          
          <p className="text-sm text-gray-500">
            Questo documento può essere stampato utilizzando il comando di stampa presente nelle impostazioni di qualsiasi browser.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Titolare del Trattamento dei Dati</h2>
          <p>
            3D su Misura - via Roma 123 - Milano - Italia
          </p>
          <p>
            Indirizzo email del Titolare: <a href="mailto:info@3dsumisura.it" className="text-blue-600 hover:text-blue-800">info@3dsumisura.it</a>
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Tipologie di Dati raccolti</h2>
          <p>
            Fra i Dati Personali raccolti da questa Applicazione, in modo autonomo o tramite terze parti, ci sono: Strumento di Tracciamento; Dati di utilizzo; nome; cognome; email; CAP; città; indirizzo; numero di telefono.
          </p>
          <p>
            Dettagli completi su ciascuna tipologia di Dati Personali raccolti sono forniti nelle sezioni dedicate di questa privacy policy o mediante specifici testi informativi visualizzati prima della raccolta dei Dati stessi.
            I Dati Personali possono essere liberamente forniti dall'Utente o, nel caso di Dati di Utilizzo, raccolti automaticamente durante l'uso di questa Applicazione.
          </p>
          <p>
            Se non diversamente specificato, tutti i Dati richiesti da questa Applicazione sono obbligatori. Se l'Utente rifiuta di comunicarli, potrebbe essere impossibile per questa Applicazione fornire il Servizio. Nei casi in cui questa Applicazione indichi alcuni Dati come facoltativi, gli Utenti sono liberi di astenersi dal comunicare tali Dati, senza che ciò abbia alcuna conseguenza sulla disponibilità del Servizio o sulla sua operatività.
          </p>
          <p>
            Gli Utenti che dovessero avere dubbi su quali Dati siano obbligatori sono incoraggiati a contattare il Titolare.
            L'eventuale utilizzo di Cookie - o di altri strumenti di tracciamento - da parte di questa Applicazione o dei titolari dei servizi terzi utilizzati da questa Applicazione ha la finalità di fornire il Servizio richiesto dall'Utente, oltre alle ulteriori finalità descritte nel presente documento e nella Cookie Policy.
          </p>
          <p>
            L'Utente si assume la responsabilità dei Dati Personali di terzi ottenuti, pubblicati o condivisi mediante questa Applicazione.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Modalità e luogo del trattamento dei Dati raccolti</h2>
          
          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Modalità di trattamento</h3>
          <p>
            Il Titolare adotta le opportune misure di sicurezza volte ad impedire l'accesso, la divulgazione, la modifica o la distruzione non autorizzate dei Dati Personali.
            Il trattamento viene effettuato mediante strumenti informatici e/o telematici, con modalità organizzative e con logiche strettamente correlate alle finalità indicate. Oltre al Titolare, in alcuni casi, potrebbero avere accesso ai Dati altri soggetti coinvolti nell'organizzazione di questa Applicazione (personale amministrativo, commerciale, marketing, legali, amministratori di sistema) ovvero soggetti esterni (come fornitori di servizi tecnici terzi, corrieri postali, hosting provider, società informatiche, agenzie di comunicazione) nominati anche, se necessario, Responsabili del Trattamento da parte del Titolare. L'elenco aggiornato dei Responsabili potrà sempre essere richiesto al Titolare del Trattamento.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Luogo</h3>
          <p>
            I Dati sono trattati presso le sedi operative del Titolare ed in ogni altro luogo in cui le parti coinvolte nel trattamento siano localizzate. Per ulteriori informazioni, contatta il Titolare.
            I Dati Personali dell'Utente potrebbero essere trasferiti in un paese diverso da quello in cui l'Utente si trova. Per ottenere ulteriori informazioni sul luogo del trattamento l'Utente può fare riferimento alla sezione relativa ai dettagli sul trattamento dei Dati Personali.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Periodo di conservazione</h3>
          <p>
            Se non diversamente indicato in questo documento, i Dati Personali sono trattati e conservati per il tempo richiesto dalla finalità per la quale sono stati raccolti e potrebbero essere conservati per un periodo più lungo a causa di eventuali obbligazioni legali o sulla base del consenso degli Utenti.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Finalità del Trattamento dei Dati raccolti</h2>
          <p>
            I Dati dell'Utente sono raccolti per consentire al Titolare di fornire il Servizio, adempiere agli obblighi di legge, rispondere a richieste o azioni esecutive, tutelare i propri diritti ed interessi (o quelli di Utenti o di terze parti), individuare eventuali attività dolose o fraudolente, nonché per le seguenti finalità: Statistica, Visualizzazione di contenuti da piattaforme esterne, Gestione dei tag e Contattare l'Utente.
          </p>
          <p>
            Per ottenere informazioni dettagliate sulle finalità del trattamento e sui Dati Personali trattati per ciascuna finalità, l'Utente può fare riferimento alla sezione "Dettagli sul trattamento dei Dati Personali".
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Ulteriori informazioni sul tempo di conservazione</h2>
          <p>
            Se non diversamente indicato in questo documento, i Dati Personali sono trattati e conservati per il tempo richiesto dalla finalità per la quale sono stati raccolti e potrebbero essere conservati per un periodo più lungo a causa di eventuali obbligazioni legali o sulla base del consenso degli Utenti.
          </p>
          <p>
            Pertanto:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>I Dati Personali raccolti per scopi collegati all'esecuzione di un contratto tra il Titolare e l'Utente saranno trattenuti sino a quando sia completata l'esecuzione di tale contratto.</li>
            <li>I Dati Personali raccolti per finalità riconducibili all'interesse legittimo del Titolare saranno trattenuti sino al soddisfacimento di tale interesse. L'Utente può ottenere ulteriori informazioni in merito all'interesse legittimo perseguito dal Titolare nelle relative sezioni di questo documento o contattando il Titolare.</li>
            <li>Quando il trattamento è basato sul consenso dell'Utente, il Titolare può conservare i Dati Personali più a lungo sino a quando detto consenso non venga revocato. Inoltre, il Titolare potrebbe essere obbligato a conservare i Dati Personali per un periodo più lungo per adempiere ad un obbligo di legge o per ordine di un'autorità.</li>
          </ul>
          <p>
            Al termine del periodo di conservazione i Dati Personali saranno cancellati. Pertanto, allo spirare di tale termine il diritto di accesso, cancellazione, rettificazione ed il diritto alla portabilità dei Dati non potranno più essere esercitati.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Diritti dell'Utente sulla base del Regolamento Generale sulla Protezione dei Dati (GDPR)</h2>
          <p>
            Gli Utenti possono esercitare determinati diritti con riferimento ai Dati trattati dal Titolare.
          </p>
          <p>
            In particolare, nei limiti previsti dalla legge, l'Utente ha il diritto di:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Revocare il consenso in ogni momento.</strong> L'Utente può revocare il consenso al trattamento dei propri Dati Personali precedentemente espresso.</li>
            <li><strong>Opporsi al trattamento dei propri Dati.</strong> L'Utente può opporsi al trattamento dei propri Dati quando esso avviene in virtù di una base giuridica diversa dal consenso.</li>
            <li><strong>Accedere ai propri Dati.</strong> L'Utente ha diritto ad ottenere informazioni sui Dati trattati dal Titolare, su determinati aspetti del trattamento ed a ricevere una copia dei Dati trattati.</li>
            <li><strong>Verificare e chiedere la rettificazione.</strong> L'Utente può verificare la correttezza dei propri Dati e richiederne l'aggiornamento o la correzione.</li>
            <li><strong>Ottenere la limitazione del trattamento.</strong> L'Utente può richiedere la limitazione del trattamento dei propri Dati. In tal caso il Titolare non tratterà i Dati per alcun altro scopo se non la loro conservazione.</li>
            <li><strong>Ottenere la cancellazione o rimozione dei propri Dati Personali.</strong> L'Utente può richiedere la cancellazione dei propri Dati da parte del Titolare.</li>
            <li><strong>Ricevere i propri Dati o farli trasferire ad altro titolare.</strong> L'Utente ha diritto di ricevere i propri Dati in formato strutturato, di uso comune e leggibile da dispositivo automatico e, ove tecnicamente fattibile, di ottenerne il trasferimento senza ostacoli ad un altro titolare.</li>
            <li><strong>Proporre reclamo.</strong> L'Utente può proporre un reclamo all'autorità di controllo della protezione dei dati personali competente o agire in sede giudiziale.</li>
          </ul>
          
          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Dettagli sul diritto di opposizione</h3>
          <p>
            Quando i Dati Personali sono trattati nell'interesse pubblico, nell'esercizio di pubblici poteri di cui è investito il Titolare oppure per perseguire un interesse legittimo del Titolare, gli Utenti hanno diritto ad opporsi al trattamento per motivi connessi alla loro situazione particolare.
          </p>
          <p>
            Si fa presente agli Utenti che, ove i loro Dati fossero trattati con finalità di marketing diretto, possono opporsi al trattamento in qualsiasi momento, gratuitamente e senza fornire alcuna motivazione. Qualora gli Utenti si oppongano al trattamento per finalità di marketing diretto, i Dati Personali non sono più oggetto di trattamento per tali finalità. Per scoprire se il Titolare tratti Dati con finalità di marketing diretto gli Utenti possono fare riferimento alle rispettive sezioni di questo documento.
          </p>
          
          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Come esercitare i diritti</h3>
          <p>
            Eventuali richieste di esercizio dei diritti dell'Utente possono essere indirizzate al Titolare attraverso i recapiti forniti in questo documento. La richiesta è gratuita e il Titolare risponderà nel più breve tempo possibile, in ogni caso entro un mese, fornendo all'Utente tutte le informazioni previste dalla legge. Eventuali rettifiche, cancellazioni o limitazioni del trattamento saranno comunicate dal Titolare a ciascuno dei destinatari, se esistenti, a cui sono stati trasmessi i Dati Personali, salvo che ciò si riveli impossibile o implichi uno sforzo sproporzionato. Il Titolare comunica all'Utente tali destinatari qualora egli lo richieda.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Informative specifiche</h2>
          <p>
            Su richiesta dell'Utente, in aggiunta alle informazioni contenute in questa privacy policy, questa Applicazione potrebbe fornire all'Utente delle informative aggiuntive e contestuali riguardanti Servizi specifici, o la raccolta ed il trattamento di Dati Personali.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Modifiche a questa privacy policy</h2>
          <p>
            Il Titolare del Trattamento si riserva il diritto di apportare modifiche alla presente privacy policy in qualunque momento notificandolo agli Utenti su questa pagina e, se possibile, su questa Applicazione nonché, qualora tecnicamente e legalmente fattibile, inviando una notifica agli Utenti attraverso uno degli estremi di contatto di cui è in possesso. Si prega dunque di consultare con frequenza questa pagina, facendo riferimento alla data di ultima modifica indicata in fondo.
          </p>
          <p>
            Qualora le modifiche interessino trattamenti la cui base giuridica è il consenso, il Titolare provvederà a raccogliere nuovamente il consenso dell'Utente, se necessario.
          </p>
          
          <div className="mt-12 pt-6 border-t border-gray-200 text-sm text-gray-500">
            <p>Ultimo aggiornamento: 27 giugno 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;