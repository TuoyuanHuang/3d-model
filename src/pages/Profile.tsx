import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Phone, MapPin, Save, Edit, CheckCircle } from 'lucide-react';

interface UserProfile {
  id?: string;
  full_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
}

const Profile: React.FC = () => {
  const { user, supabase } = useAuth();
  const [profile, setProfile] = useState<UserProfile>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user?.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
          throw error;
        }

        setProfile(data || {
          full_name: user?.user_metadata?.full_name || '',
          country: 'IT'
        });
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Errore nel caricamento del profilo');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadProfile();
    }
  }, [user, supabase]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      const profileData = {
        user_id: user?.id,
        full_name: profile.full_name,
        phone: profile.phone,
        address: profile.address,
        city: profile.city,
        postal_code: profile.postal_code,
        country: profile.country || 'IT'
      };

      const { error } = await supabase
        .from('user_profiles')
        .upsert(profileData, { onConflict: 'user_id' });

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Errore nel salvataggio del profilo');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento profilo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <User className="h-8 w-8 mr-3" />
            Il Mio Profilo
          </h1>
          <p className="text-gray-600">Gestisci le tue informazioni personali</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Account Info */}
          <div className="mb-8 pb-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informazioni Account</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Membro dal</p>
                  <p className="font-medium text-gray-900">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString('it-IT') : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Informazioni Personali</h2>
              <Edit className="h-5 w-5 text-gray-400" />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <p className="text-green-700">Profilo aggiornato con successo!</p>
              </div>
            )}

            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={profile.full_name || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Mario Rossi"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Telefono
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={profile.phone || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+39 123 456 7890"
              />
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Indirizzo
              </h3>

              <div className="space-y-4">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Via e Numero Civico
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={profile.address || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Via Roma 123"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                      Città
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={profile.city || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Milano"
                    />
                  </div>

                  <div>
                    <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-2">
                      CAP
                    </label>
                    <input
                      type="text"
                      id="postal_code"
                      name="postal_code"
                      value={profile.postal_code || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="20121"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                    Paese
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={profile.country || 'IT'}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="IT"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Salvataggio...</span>
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>Salva Modifiche</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;