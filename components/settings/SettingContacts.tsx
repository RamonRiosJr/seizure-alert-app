import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Users, Plus, Trash2, Edit2 } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  relation: string;
  phone: string;
}

export const SettingContacts: React.FC = () => {
  const { t } = useTranslation();
  const [contacts, setContacts] = useLocalStorage<Contact[]>('emergency_contacts', []);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newContact, setNewContact] = useState<Omit<Contact, 'id'>>({
    name: '',
    relation: '',
    phone: '',
  });

  const handleSave = () => {
    if (!newContact.name || !newContact.phone) return;

    if (editingId) {
      setContacts(contacts.map((c) => (c.id === editingId ? { ...newContact, id: editingId } : c)));
      setEditingId(null);
    } else {
      setContacts([...contacts, { ...newContact, id: Date.now().toString() }]);
    }
    setIsAdding(false);
    setNewContact({ name: '', relation: '', phone: '' });
  };

  const handleEdit = (contact: Contact) => {
    setNewContact({ name: contact.name, relation: contact.relation, phone: contact.phone });
    setEditingId(contact.id);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    setContacts(contacts.filter((c) => c.id !== id));
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl space-y-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {t('settingsContacts', 'Emergency Contacts')}
          </h3>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
            aria-label="Add Contact"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>

      {isAdding ? (
        <div className="space-y-3 bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-600 animate-in fade-in slide-in-from-top-2">
          <input
            type="text"
            placeholder={t('settingsContactName', 'Name')}
            value={newContact.name}
            onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <input
            type="text"
            placeholder={t('settingsContactRelation', 'Relation')}
            value={newContact.relation}
            onChange={(e) => setNewContact({ ...newContact, relation: e.target.value })}
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <input
            type="tel"
            placeholder={t('settingsContactPhone', 'Phone')}
            value={newContact.phone}
            onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
              }}
              className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              {t('settingsCancel', 'Cancel')}
            </button>
            <button
              onClick={handleSave}
              disabled={!newContact.name || !newContact.phone}
              className="px-3 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {t('settingsSave', 'Save')}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {contacts.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
              {t('noContactsMessage', 'No contacts added.')}
            </p>
          ) : (
            contacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{contact.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {contact.relation} • {contact.phone}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(contact)}
                    className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    aria-label={`Edit ${contact.name}`}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    aria-label={`Delete ${contact.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
