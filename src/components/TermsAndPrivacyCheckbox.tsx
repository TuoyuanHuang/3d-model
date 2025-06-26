import React from 'react';
import { AlertCircle } from 'lucide-react';

interface TermsAndPrivacyCheckboxProps {
  isChecked: boolean;
  onCheckedChange: (checked: boolean) => void;
  hasError: boolean;
  errorMessage?: string;
}

const TermsAndPrivacyCheckbox: React.FC<TermsAndPrivacyCheckboxProps> = ({
  isChecked,
  onCheckedChange,
  hasError,
  errorMessage = "Devi accettare i termini e le condizioni per procedere",
}) => {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCheckedChange(e.target.checked);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center">
        <input
          type="checkbox"
          id="terms-checkbox"
          name="terms-checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          required
          aria-required="true"
          aria-invalid={hasError ? "true" : "false"}
          className={`
            h-5 w-5 text-blue-600 border-gray-300 rounded
            focus:ring-blue-500
            ${hasError ? 'border-red-500 ring-red-500' : ''}
            hover:border-blue-500
          `}
        />
        <label
          htmlFor="terms-checkbox"
          className={`ml-3 text-sm font-medium text-gray-700 cursor-pointer ${hasError ? 'text-red-700' : ''}`}
        >
          Accetto le{' '}
          <a
            href="/condizioni-generali"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 underline"
            aria-label="Leggi le Condizioni generali di acquisto"
          >
            Condizioni generali di acquisto
          </a>{' '}
          e la{' '}
          <a
            href="/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 underline"
            aria-label="Leggi la Privacy Policy"
          >
            Privacy Policy di 3D su Misura
          </a>
        </label>
      </div>
      {hasError && (
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default TermsAndPrivacyCheckbox;