import React, { useState } from 'react';
import { useAuthStore } from '../state/auth';
import { cn } from '../utils/cn';

export const LoginScreen = () => {
  const [email, setEmail] = useState('max.mustermann@hrthis.de');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Bitte füllen Sie alle Felder aus.');
      return;
    }

    try {
      await login(email, password);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Ein unbekannter Fehler ist aufgetreten.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-center text-blue-600 mb-2">
            HRdiese
          </h1>
          <p className="text-lg text-gray-600 text-center">
            Mitarbeiter Portal
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              E-Mail
            </label>
            <input
              type="email"
              className="border border-gray-300 rounded-lg px-4 py-3 text-base w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="ihre.email@firma.de"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoCapitalize="none"
              autoCorrect="off"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Passwort
            </label>
            <input
              type="password"
              className="border border-gray-300 rounded-lg px-4 py-3 text-base w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Passwort eingeben"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className={cn(
              "bg-blue-600 rounded-lg py-4 w-full text-white font-semibold text-base transition-opacity",
              isLoading && "opacity-50 cursor-not-allowed"
            )}
            disabled={isLoading}
          >
            {isLoading ? 'Anmeldung läuft...' : 'Anmelden'}
          </button>
        </form>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2 font-medium">Demo-Anmeldedaten:</p>
          <p className="text-xs text-gray-500">Mitarbeiter: max.mustermann@hrthis.de</p>
          <p className="text-xs text-gray-500">Admin: anna.admin@hrthis.de</p>
          <p className="text-xs text-gray-500">Passwort: password</p>
        </div>
      </div>
    </div>
  );
};