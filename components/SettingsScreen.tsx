import React, { useState, useEffect } from 'react';
import type { Language, EmergencyContact } from '../types';
import { translations } from '../constants';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { X, Trash2, UserPlus, Key, Save, Pencil, Check } from 'lucide-react';

interface SettingsScreenProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

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
                <div key={contact.id} className="bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
                  {editingContactId === contact.id ? (
                    <div className="space-y-2">
                      {editError && <p className="text-red-500 text-sm text-center">{editError}</p>}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input type="text" placeholder={t.settingsContactName} value={editingContactData?.name ?? ''} onChange={e => { setEditingContactData(d => ({ ...d!, name: e.target.value })); setEditError(null); }} className={`w-full px-3 py-2 border rounded-md dark:bg-gray-600 dark:border-gray-500 ${editError && !editingContactData?.name.trim() ? 'border-red-500' : ''}`} required />
                        <input type="text" placeholder={t.settingsContactRelation} value={editingContactData?.relation ?? ''} onChange={e => setEditingContactData(d => ({ ...d!, relation: e.target.value }))} className="w-full px-3 py-2 border rounded-md dark:bg-gray-600 dark:border-gray-500" />
                        <input type="tel" placeholder={t.settingsContactPhone} value={editingContactData?.phone ?? ''} onChange={e => { setEditingContactData(d => ({ ...d!, phone: e.target.value })); setEditError(null); }} className={`w-full px-3 py-2 border rounded-md dark:bg-gray-600 dark:border-gray-500 ${editError && !editingContactData?.phone.trim() ? 'border-red-500' : ''}`} required />
                      </div>
                      <div className="flex justify-end items-center gap-2">
                        <button onClick={handleCancelEditing} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600" aria-label="Cancel edit">
                          <X className="w-6 h-6" />
                        </button>
                        <button onClick={handleSaveEdit} className="text-green-500 hover:text-green-700 dark:hover:text-green-400 p-2 rounded-full hover:bg-green-100 dark:hover:bg-green-900/50" aria-label="Save contact">
                          <Check className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-gray-800 dark:text-gray-200">{contact.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{contact.relation} - {contact.phone}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleStartEditing(contact)} className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 p-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 disabled:opacity-50 disabled:cursor-not-allowed" disabled={!!editingContactId || isAddingContact} aria-label="Edit contact">
                          <Pencil className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDeleteContact(contact.id)} className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 disabled:opacity-50 disabled:cursor-not-allowed" disabled={!!editingContactId} aria-label="Delete contact">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {contacts.length === 0 && !editingContactId && !isAddingContact && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">{`No contacts added yet.`}</p>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              {isAddingContact ? (
                <form onSubmit={handleAddContact} className="space-y-3">
                  <h4 className="font-semibold text-gray-700 dark:text-gray-200">{t.settingsAddContact}</h4>
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

          {/* API Key Section */}
          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Key className="w-6 h-6" />
              {t.settingsAPIKey}
            </h3>
            <div className="space-y-3">
              <label htmlFor="api-key" className="font-medium text-gray-700 dark:text-gray-300">{t.settingsAPIKeyLabel}</label>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t.settingsAPIKeyDesc}</p>
              <div className="flex gap-2">
                <input id="api-key" type="password" value={apiKeyInput} onChange={e => setApiKeyInput(e.target.value)} placeholder={t.settingsAPIKeyPlaceholder} className="flex-grow px-3 py-2 border rounded-md dark:bg-gray-600 dark:border-gray-500" />
                <button onClick={handleSaveApiKey} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2">
                  <Save className="w-5 h-5" />
                  {t.settingsSave}
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default SettingsScreen;