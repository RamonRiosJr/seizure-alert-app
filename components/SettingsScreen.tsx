
import React, { useState, useEffect } from 'react';
import type { Language, EmergencyContact } from '../types';
import { translations } from '../constants';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { X, Trash2, UserPlus, Key, Save, Pencil, Check, ExternalLink, ShieldAlert, Smartphone } from 'lucide-react';

interface SettingsScreenProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

// Sub-component for message editing to handle its own state/effect logic cleanly
const AlertMessageEditor = ({ language, t }: { language: Language, t: any }) => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(`seizure_alert_status_message_${language}`);
    setMessage(saved || t.alertStatus);
  }, [language, t.alertStatus]);

  const handleSave = () => {
    localStorage.setItem(`seizure_alert_status_message_${language}`, message);
    alert('Message saved!');
  };

  return (
    <div className="flex flex-col gap-2">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full px-3 py-2 border rounded-md dark:bg-gray-600 dark:border-gray-500 h-24 resize-none"
        placeholder="Enter custom alert message..."
      />
      <button
        onClick={handleSave}
        className="self-end px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
      >
        <Save className="w-4 h-4" />
        {t.settingsSave}
      </button>
    </div>
  );
};

const SettingsScreen: React.FC<SettingsScreenProps> = ({ isOpen, onClose, language }) => {
  const [contacts, setContacts] = useLocalStorage<EmergencyContact[]>('emergency_contacts', []);
  const [apiKey, setApiKey] = useLocalStorage<string>('gemini_api_key', '');

  const [newContact, setNewContact] = useState({ name: '', relation: '', phone: '' });
  const [apiKeyInput, setApiKeyInput] = useState(apiKey);

  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [editingContactData, setEditingContactData] = useState<{ name: string; relation: string; phone: string } | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [isAddingContact, setIsAddingContact] = useState(false);

  const t = translations[language];

  useEffect(() => {
    if (!isOpen) {
      setEditingContactId(null);
      setEditingContactData(null);
      setEditError(null);
      setIsAddingContact(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (newContact.name.trim() && newContact.phone.trim()) {
      setContacts([...contacts, { ...newContact, id: Date.now().toString() }]);
      setNewContact({ name: '', relation: '', phone: '' });
      setIsAddingContact(false);
    }
  };

  const handleCancelAdd = () => {
    setIsAddingContact(false);
    setNewContact({ name: '', relation: '', phone: '' });
  };

  const handleDeleteContact = (id: string) => {
    setContacts(contacts.filter(c => c.id !== id));
  };

  const handleSaveApiKey = () => {
    setApiKey(apiKeyInput);
  };

  const handleStartEditing = (contact: EmergencyContact) => {
    setEditingContactId(contact.id);
    setEditingContactData({ name: contact.name, relation: contact.relation, phone: contact.phone });
    setEditError(null);
    setIsAddingContact(false);
  };

  const handleCancelEditing = () => {
    setEditingContactId(null);
    setEditingContactData(null);
    setEditError(null);
  };

  const handleSaveEdit = () => {
    if (!editingContactId || !editingContactData) return;

    if (!editingContactData.name.trim() || !editingContactData.phone.trim()) {
      setEditError('Name and Phone Number are required fields.');
      return;
    }

    setContacts(contacts.map(c => c.id === editingContactId ? { ...c, ...editingContactData } : c));
    handleCancelEditing();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl h-[90vh] max-h-[800px] flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t.settingsTitle}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-grow p-6 overflow-y-auto space-y-8">
          {/* Emergency Contacts Section */}
          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <UserPlus className="w-6 h-6" />
              {t.emergencyContacts}
            </h3>
            <div className="space-y-3">
              {contacts.map(contact => (
                <div key={contact.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{contact.name} ({contact.relation})</p>
                    <p className="text-gray-600 dark:text-gray-400">{contact.phone}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => {
                      setNewContact({ name: contact.name, relation: contact.relation, phone: contact.phone });
                      setIsAddingContact(true);
                      setEditingContactId(contact.id);
                    }} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full">
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleDeleteContact(contact.id!)} className="p-2 text-red-600 hover:bg-red-100 rounded-full">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}

              {isAddingContact ? (
                <form onSubmit={handleAddContact} className="space-y-3 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input type="text" placeholder={t.settingsContactName} value={newContact.name} onChange={e => setNewContact({ ...newContact, name: e.target.value })} className="w-full px-3 py-2 border rounded-md dark:bg-gray-600 dark:border-gray-500" required />
                    <input type="text" placeholder={t.settingsContactRelation} value={newContact.relation} onChange={e => setNewContact({ ...newContact, relation: e.target.value })} className="w-full px-3 py-2 border rounded-md dark:bg-gray-600 dark:border-gray-500" />
                    <input type="tel" placeholder={t.settingsContactPhone} value={newContact.phone} onChange={e => setNewContact({ ...newContact, phone: e.target.value })} className="w-full px-3 py-2 border rounded-md dark:bg-gray-600 dark:border-gray-500" required />
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <button type="submit" disabled={!newContact.name.trim() || !newContact.phone.trim()} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 w-full sm:w-auto">{t.settingsSave}</button>
                    <button type="button" onClick={handleCancelAdd} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 w-full sm:w-auto">{t.settingsCancel}</button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setIsAddingContact(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                  disabled={!!editingContactId}
                >
                  <UserPlus className="w-5 h-5" />
                  <span>{t.settingsAddContact}</span>
                </button>
              )}
            </div>


          </section>

          {/* Custom Alert Message Section */}
          < section >
            <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Pencil className="w-6 h-6" />
              Custom Alert Message
            </h3>
            <div className="space-y-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This message will be displayed on the screen during an emergency.
              </p>
              <AlertMessageEditor language={language} t={t} />
            </div>
          </section>

          {/* API Key Section */}
          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Key className="w-6 h-6" />
              {t.settingsAPIKey}
            </h3>
            <div className="space-y-3">
              <label htmlFor="api-key" className="font-medium text-gray-700 dark:text-gray-300">{t.settingsAPIKeyLabel}</label>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t.settingsAPIKeyDesc}
                <br />
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors inline-flex items-center gap-1 mt-1"
                >
                  Get your free API Key from Google AI Studio <ExternalLink className="w-3 h-3" />
                </a>
              </p>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md border border-yellow-200 dark:border-yellow-800/50 text-sm text-yellow-800 dark:text-yellow-200 flex gap-2 items-start">
                <ShieldAlert className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Your API key is stored <strong>locally</strong> on your device. It is used directly to communicate with Google's servers and is never shared with us.</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input id="api-key" type="password" value={apiKeyInput} onChange={e => setApiKeyInput(e.target.value)} placeholder={t.settingsAPIKeyPlaceholder} className="w-full px-3 py-2 border rounded-md dark:bg-gray-600 dark:border-gray-500" />
                <button onClick={handleSaveApiKey} className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center gap-2">
                  <Save className="w-5 h-5" />
                  {t.settingsSave}
                </button>
              </div>
            </div>
          </section>

          {/* NFC Activation Section */}
          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Smartphone className="w-6 h-6" />
              NFC Activation (Tap-to-Alert)
            </h3>
            <div className="space-y-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Program an NFC tag to instantly launch this app in Emergency Mode when tapped.
              </p>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-2">How to use:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700 dark:text-blue-300">
                  <li>Tap the button below.</li>
                  <li>When prompted, hold your phone near a writable NFC tag.</li>
                  <li>The tag will be programmed with the "Emergency Link".</li>
                </ol>
              </div>

              <button
                onClick={async () => {
                  try {
                    if (!('NDEFReader' in window)) {
                      alert('NFC is not supported on this device/browser. Try using Chrome on Android, or a dedicated NFC Tools app to write this URL: ' + window.location.href + '?emergency=true');
                      return;
                    }

                    // @ts-ignore - Web NFC API is experimental
                    const ndef = new window.NDEFReader();
                    await ndef.write({
                      records: [{ recordType: "url", data: window.location.origin + window.location.pathname + "?emergency=true" }]
                    });
                    alert("✅ Success! Tag programmed. Tap it to test.");
                  } catch (error) {
                    console.error(error);
                    alert("❌ Write failed. Make sure NFC is on and the tag is unlocked.");
                  }
                }}
                className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
              >
                Start NFC Programming
              </button>
            </div>
          </section>
        </main>
      </div>
    </div >
  );
};

export default SettingsScreen;