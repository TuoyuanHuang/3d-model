import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white shadow-sm rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        <div className="prose prose-gray max-w-none">
          <p className="font-semibold">Privacy Policy di 3D su Misura</p>
          <p>Questa Applicazione raccoglie alcuni Dati Personali dei propri Utenti.</p>
          <p>Questo documento può essere stampato utilizzando il comando di stampa presente nelle impostazioni di qualsiasi browser.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">Titolare del Trattamento dei Dati</h2>
          <p>3DLAB - via U. Foscolo 219 A - Varese - Italia</p>
          <p>Indirizzo email del Titolare: clientcustom3dlab@gmail.com</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">Tipologie di Dati raccolti</h2>
          <p>Fra i Dati Personali raccolti da questa Applicazione, in modo autonomo o tramite terze parti, ci sono: Strumento di Tracciamento; Dati di utilizzo; nome; cognome; email; CAP; città; Codice Fiscale.</p>
          <p>Dettagli completi su ciascuna tipologia di Dati Personali raccolti sono forniti nelle sezioni dedicate di questa privacy policy o mediante specifici testi informativi visualizzati prima della raccolta dei Dati stessi.</p>
          <p>I Dati Personali possono essere liberamente forniti dall'Utente o, nel caso di Dati di Utilizzo, raccolti automaticamente durante l'uso di questa Applicazione.</p>
          <p>Se non diversamente specificato, tutti i Dati richiesti da questa Applicazione sono obbligatori. Se l'Utente rifiuta di comunicarli, potrebbe essere impossibile per questa Applicazione fornire il Servizio. Nei casi in cui questa Applicazione indichi alcuni Dati come facoltativi, gli Utenti sono liberi di astenersi dal comunicare tali Dati, senza che ciò abbia alcuna conseguenza sulla disponibilità del Servizio o sulla sua operatività.</p>
          <p>Gli Utenti che dovessero avere dubbi su quali Dati siano obbligatori sono incoraggiati a contattare il Titolare.</p>
          <p>L'eventuale utilizzo di Cookie - o di altri strumenti di tracciamento - da parte di questa Applicazione o dei titolari dei servizi terzi utilizzati da questa Applicazione ha la finalità di fornire il Servizio richiesto dall'Utente, oltre alle ulteriori finalità descritte nel presente documento e nella Cookie Policy.</p>
          <p>L'Utente si assume la responsabilità dei Dati Personali di terzi ottenuti, pubblicati o condivisi mediante questa Applicazione.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">Modalità e luogo del trattamento dei Dati raccolti</h2>
          <h3 className="text-lg font-medium mt-4 mb-2">Modalità di trattamento</h3>
          <p>Il Titolare adotta le opportune misure di sicurezza volte ad impedire l'accesso, la divulgazione, la modifica o la distruzione non autorizzate dei Dati Personali.</p>
          <p>Il trattamento viene effettuato mediante strumenti informatici e/o telematici, con modalità organizzative e con logiche strettamente correlate alle finalità indicate. Oltre al Titolare, in alcuni casi, potrebbero avere accesso ai Dati altri soggetti coinvolti nell'organizzazione di questa Applicazione (personale amministrativo, commerciale, marketing, legali, amministratori di sistema) ovvero soggetti esterni (come fornitori di servizi tecnici terzi, corrieri postali, hosting provider, società informatiche, agenzie di comunicazione) nominati anche, se necessario, Responsabili del Trattamento da parte del Titolare. L'elenco aggiornato dei Responsabili potrà sempre essere richiesto al Titolare del Trattamento.</p>
          
          <h3 className="text-lg font-medium mt-4 mb-2">Luogo</h3>
          <p>I Dati sono trattati presso le sedi operative del Titolare ed in ogni altro luogo in cui le parti coinvolte nel trattamento siano localizzate. Per ulteriori informazioni, contatta il Titolare.</p>
          <p>I Dati Personali dell'Utente potrebbero essere trasferiti in un paese diverso da quello in cui l'Utente si trova. Per ottenere ulteriori informazioni sul luogo del trattamento l'Utente può fare riferimento alla sezione relativa ai dettagli sul trattamento dei Dati Personali.</p>
          
          <h3 className="text-lg font-medium mt-4 mb-2">Periodo di conservazione</h3>
          <p>Se non diversamente indicato in questo documento, i Dati Personali sono trattati e conservati per il tempo richiesto dalla finalità per la quale sono stati raccolti e potrebbero essere conservati per un periodo più lungo a causa di eventuali obbligazioni legali o sulla base del consenso degli Utenti.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">Diritti dell'Utente sulla base del Regolamento Generale sulla Protezione dei Dati (GDPR)</h2>
          <p>Gli Utenti possono esercitare determinati diritti con riferimento ai Dati trattati dal Titolare.</p>
          <p>In particolare, nei limiti previsti dalla legge, l'Utente ha il diritto di:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>revocare il consenso in ogni momento</li>
            <li>opporsi al trattamento dei propri Dati</li>
            <li>accedere ai propri Dati</li>
            <li>verificare e chiedere la rettificazione</li>
            <li>ottenere la limitazione del trattamento</li>
            <li>ottenere la cancellazione o rimozione dei propri Dati Personali</li>
            <li>ricevere i propri Dati o farli trasferire ad altro titolare</li>
            <li>proporre reclamo</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">Come esercitare i diritti</h2>
          <p>Eventuali richieste di esercizio dei diritti dell'Utente possono essere indirizzate al Titolare attraverso i recapiti forniti in questo documento. La richiesta è gratuita e il Titolare risponderà nel più breve tempo possibile, in ogni caso entro un mese.</p>
          
          <p className="mt-8 pt-4 border-t border-gray-200 text-sm text-gray-600">Ultimo aggiornamento: 1 Luglio 2024</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;