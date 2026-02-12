import React, { useState } from 'react';
import { SettingFallDetection } from './settings/SettingFallDetection';
import { useSettings } from '../contexts/SettingsContext';
import { Battery } from 'lucide-react';
import { SettingHeartRate } from './settings/SettingHeartRate';
import type { EmergencyContact } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
  X,
  Trash2,
  UserPlus,
  Key,
  Save,
  Pencil,
  Check,
  ExternalLink,
  ShieldAlert,
  Smartphone,
  Download,
  Share,
  PlusSquare,
  Upload,
  Cloud,
  Activity,
  Eye,
  EyeOff,
} from 'lucide-react';
import { ApiKeyHelpModal } from './settings/ApiKeyHelpModal';
import { generateBackup, restoreBackup } from '../utils/backupUtils';
import { useLanguage } from '../contexts/LanguageContext';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useTranslation } from 'react-i18next';
import { useShake } from '../hooks/useShake';
import { DeviceManager } from './DeviceManager';
import { useConfigContext } from '../contexts/ConfigContext';

interface SettingsScreenProps {
  isOpen: boolean;
  onClose: () => void;
}

// Sub-component for message editing to handle its own state/effect logic cleanly
const AlertMessageEditor = () => {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const [message, setMessage] = useState('');

  // Initialize state only once or when language/defaults change.
  // We use a key-based approach for localStorage initial value to avoid effect sync issues if possible,
  // but since we need to support dynamic language changes, an effect is okay IF we avoid the loop.
  // The persistent linter error "Calling setState synchronously" is because we are calling it immediately.
  // We can wrap it in a condition or use `useLayoutEffect` or just ignore if it's actually safe.
  // Better: Initialize state lazily.
  // const [initialized, setInitialized] = useState(false); // Removed unused state

  React.useEffect(() => {
    const saved = localStorage.getItem(`seizure_alert_status_message_${language}`);
    setMessage(saved || t('alertStatus'));
  }, [language, t]);

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
        {t('settingsSave')}
      </button>
    </div>
  );
};

const SettingsScreen: React.FC<SettingsScreenProps> = ({ isOpen, onClose }) => {
  const { activeProfile, setProfileId, availableProfiles } = useConfigContext();
  // Unused language import removed
  const [contacts, setContacts] = useLocalStorage<EmergencyContact[]>('emergency_contacts', []);
  const [patientInfo, setPatientInfo] = useLocalStorage<{
    name: string;
    bloodType: string;
    medicalConditions: string;
  }>('patient_info', {
    name: '',
    bloodType: '',
    medicalConditions: '',
  });
  const [apiKey, setApiKey] = useLocalStorage<string>('gemini_api_key', '');

  const { t } = useTranslation();

  const [newContact, setNewContact] = useState({ name: '', relation: '', phone: '' });
  const [apiKeyInput, setApiKeyInput] = useState(apiKey);

  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [editingContactData, setEditingContactData] = useState<{
    name: string;
    relation: string;
    phone: string;
  } | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [isDeviceManagerOpen, setIsDeviceManagerOpen] = useState(false);
  const [isApiKeyHelpOpen, setIsApiKeyHelpOpen] = useState(false);
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);

  const { isInstallable, isAppInstalled, installApp, isIOS } = usePWAInstall();
  const {
    isEnabled: isShakeEnabled,
    setIsEnabled: setShakeEnabled,
    isSupported: isShakeSupported,
    permissionGranted: shakePermissionGranted,
    requestPermission: requestShakePermission,
  } = useShake(() => {});

  const { lowPowerMode, setLowPowerMode } = useSettings();

  const resetEditingState = () => {
    setEditingContactId(null);
    setEditingContactData(null);
    setEditError(null);
    setIsAddingContact(false);
  };

  const handleClose = () => {
    resetEditingState();
    onClose();
  };

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
    setContacts(contacts.filter((c) => c.id !== id));
  };

  const handleSaveApiKey = () => {
    setApiKey(apiKeyInput);
  };

  const handleStartEditing = (contact: EmergencyContact) => {
    setEditingContactId(contact.id);
    setEditingContactData({ name: contact.name, relation: contact.relation, phone: contact.phone });
    setEditError(null);
    setIsAddingContact(true); // Re-use the add contact form
  };

  const handleCancelEditing = () => {
    resetEditingState();
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContactId || !editingContactData) return;

    if (!editingContactData.name.trim() || !editingContactData.phone.trim()) {
      setEditError('Name and Phone Number are required fields.');
      return;
    }

    setContacts(
      contacts.map((c) =>
        c.id === editingContactId ? { ...c, ...editingContactData, id: c.id } : c
      )
    );
    resetEditingState();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl h-[90vh] max-h-[800px] flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {t('settingsTitle')}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
            aria-label="Close settings"
          >
            <X className="w-6 h-6" />
          </button>
        </header>

        <main className="flex-grow p-6 overflow-y-auto space-y-8">
          {/* Patient Info Section */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            {/* --- NEW: Application Profile Mode --- */}
            <div className="mb-6 bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800">
              <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-200 mb-2 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" />
                Application Mode
              </h3>
              <p className="text-sm text-indigo-800 dark:text-indigo-300 mb-3">
                Choose the safety mode that matches your needs. This changes the alerts and
                terminology.
              </p>

              <div className="relative">
                <select
                  value={activeProfile.id}
                  onChange={(e) => setProfileId(e.target.value)}
                  className="w-full p-3 bg-white dark:bg-gray-800 border border-indigo-200 dark:border-indigo-700 rounded-lg shadow-sm text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none cursor-pointer"
                >
                  {availableProfiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                {/* Custom Arrow Icon */}
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-indigo-600 dark:text-indigo-400">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-500" />
              {t('settingsPatientInfo')}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
                  {t('settingsPatientName')}
                </label>
                <input
                  type="text"
                  value={patientInfo.name}
                  onChange={(e) => setPatientInfo({ ...patientInfo, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div>
                <label
                  htmlFor="blood-type"
                  className="block text-sm font-medium mb-1 text-gray-900 dark:text-white"
                >
                  {t('settingsBloodType')}
                </label>
                <select
                  id="blood-type"
                  value={patientInfo.bloodType}
                  onChange={(e) => setPatientInfo({ ...patientInfo, bloodType: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                >
                  <option value="">{t('settingsBloodTypePlaceholder')}</option>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'].map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-900 dark:text-white">
                  {t('settingsMedicalConditions')}
                </label>
                <textarea
                  value={patientInfo.medicalConditions}
                  onChange={(e) =>
                    setPatientInfo({ ...patientInfo, medicalConditions: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-600 dark:border-gray-500 h-24 resize-none dark:text-white"
                  placeholder="e.g. Epilepsy, Peanut Allergy..."
                />
              </div>
            </div>
          </div>

          {/* Emergency Contacts Section */}
          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <UserPlus className="w-6 h-6" />
              {t('emergencyContacts')}
            </h3>
            <div className="space-y-3">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md"
                >
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                      {contact.name} ({contact.relation})
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">{contact.phone}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStartEditing(contact)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"
                      aria-label="Edit Contact"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteContact(contact.id!)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-full"
                      aria-label="Delete Contact"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}

              {editError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md text-sm border border-red-200 dark:border-red-800">
                  {editError}
                </div>
              )}

              {isAddingContact ? (
                <form
                  onSubmit={editingContactId ? handleSaveEdit : handleAddContact}
                  className="space-y-3 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder={t('settingsContactName')}
                      value={editingContactId ? editingContactData?.name : newContact.name}
                      onChange={(e) =>
                        editingContactId
                          ? setEditingContactData({ ...editingContactData!, name: e.target.value })
                          : setNewContact({ ...newContact, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-600 dark:border-gray-500"
                      required
                    />
                    <input
                      type="text"
                      placeholder={t('settingsContactRelation')}
                      value={editingContactId ? editingContactData?.relation : newContact.relation}
                      onChange={(e) =>
                        editingContactId
                          ? setEditingContactData({
                              ...editingContactData!,
                              relation: e.target.value,
                            })
                          : setNewContact({ ...newContact, relation: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-600 dark:border-gray-500"
                    />
                    <input
                      type="tel"
                      placeholder={t('settingsContactPhone')}
                      value={editingContactId ? editingContactData?.phone : newContact.phone}
                      onChange={(e) =>
                        editingContactId
                          ? setEditingContactData({ ...editingContactData!, phone: e.target.value })
                          : setNewContact({ ...newContact, phone: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-600 dark:border-gray-500"
                      required
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full sm:w-auto"
                    >
                      {t('settingsSave')}
                    </button>
                    <button
                      type="button"
                      onClick={editingContactId ? handleCancelEditing : handleCancelAdd}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 w-full sm:w-auto"
                    >
                      {t('settingsCancel')}
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setIsAddingContact(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                  disabled={!!editingContactId}
                >
                  <UserPlus className="w-5 h-5" />
                  <span>{t('settingsAddContact')}</span>
                </button>
              )}
            </div>
          </section>

          {/* Shake to Alert Section */}
          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Activity className="w-6 h-6" />
              {t('settingsShakeTitle')}
            </h3>
            <div className="space-y-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('settingsShakeDesc')}</p>

              {!isShakeSupported ? (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-md border border-red-200 dark:border-red-800">
                  Device motion not supported on this device.
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <span className="font-medium text-gray-900 dark:text-white">
                    Enable Shake to Alert
                  </span>
                  <button
                    onClick={() => setShakeEnabled(!isShakeEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isShakeEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${isShakeEnabled ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                </div>
              )}

              {isShakeEnabled && !shakePermissionGranted && (
                <button
                  onClick={async () => {
                    const granted = await requestShakePermission();
                    if (!granted) alert('Permission denied or not supported.');
                  }}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {t('settingsShakePermissionBtn')}
                </button>
              )}
            </div>
          </section>

          {/* Fall Detection Section */}
          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Activity className="w-6 h-6 text-orange-500" />
              Fall Detection
            </h3>
            <div className="space-y-3">
              <SettingFallDetection />
            </div>
          </section>

          {/* Heart Rate Safety Section */}
          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Activity className="w-6 h-6" />
              Heart Rate Safety
            </h3>
            <div className="space-y-3">
              <SettingHeartRate />
            </div>
          </section>

          {/* Power & Performance Section */}
          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Battery className="w-6 h-6 text-green-500" />
              Power & Performance
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900 dark:text-white">Low Power Mode</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Reduces visualizer updates and background checks to save battery.
                  </span>
                </div>
                <button
                  onClick={() => setLowPowerMode(!lowPowerMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${lowPowerMode ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-600'}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${lowPowerMode ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Custom Alert Message Section */}
          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Pencil className="w-6 h-6" />
              Custom Alert Message
            </h3>
            <div className="space-y-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                This message will be displayed on the screen during an emergency.
              </p>
              {/* Alert Message Editor */}
              <AlertMessageEditor />
            </div>
          </section>

          {/* API Key Section */}
          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Key className="w-6 h-6" />
              {t('settingsAPIKey')}
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label htmlFor="api-key" className="font-medium text-gray-700 dark:text-gray-300">
                  {t('settingsAPIKeyLabel')}
                </label>
                <button
                  onClick={() => setIsApiKeyHelpOpen(true)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  {t('settingsAPIKeyHelp')}
                </button>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400">{t('settingsAPIKeyDesc')}</p>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md border border-yellow-200 dark:border-yellow-800/50 text-sm text-yellow-800 dark:text-yellow-200 flex gap-2 items-start">
                <ShieldAlert className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  Your API key is stored <strong>locally</strong> on your device. It is never shared
                  with us.
                </span>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <input
                    id="api-key"
                    type={isApiKeyVisible ? 'text' : 'password'}
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder={t('settingsAPIKeyPlaceholder')}
                    className={`w-full px-3 py-2 border rounded-md dark:bg-gray-600 dark:border-gray-500 pr-10 ${
                      apiKeyInput && apiKeyInput.startsWith('AIza')
                        ? 'border-green-500 focus:ring-green-500'
                        : apiKeyInput && !apiKeyInput.startsWith('AIza')
                          ? 'border-red-500 focus:ring-red-500'
                          : ''
                    }`}
                  />
                  <button
                    onClick={() => setIsApiKeyVisible(!isApiKeyVisible)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    aria-label={isApiKeyVisible ? 'Hide API Key' : 'Show API Key'}
                  >
                    {isApiKeyVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Validation Feedback */}
                {apiKeyInput && (
                  <div
                    className={`text-xs flex items-center gap-1 ${
                      apiKeyInput.startsWith('AIza')
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {apiKeyInput.startsWith('AIza') ? (
                      <>
                        <Check className="w-3 h-3" /> {t('apiKeyValidationValid')}
                      </>
                    ) : (
                      <>
                        <X className="w-3 h-3" /> {t('apiKeyValidationInvalid')}
                      </>
                    )}
                  </div>
                )}

                <button
                  onClick={handleSaveApiKey}
                  disabled={!apiKeyInput.startsWith('AIza') && apiKeyInput.length > 0}
                  className={`w-full sm:w-auto px-4 py-2 text-white rounded-md flex items-center justify-center gap-2 transition-colors ${
                    !apiKeyInput.startsWith('AIza') && apiKeyInput.length > 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  <Save className="w-5 h-5" />
                  {t('settingsSave')}
                </button>
              </div>
            </div>
          </section>

          {/* App Installation Section */}
          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Smartphone className="w-6 h-6" />
              App Installation
            </h3>
            <div className="space-y-3">
              {isAppInstalled ? (
                <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-md flex items-center gap-2 border border-green-200 dark:border-green-800">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">App is installed and offline-ready.</span>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Install this app on your device for quick access and offline capabilities.
                  </p>

                  {isInstallable && (
                    <button
                      onClick={installApp}
                      className="w-full sm:w-auto px-4 py-3 bg-gray-800 dark:bg-gray-700 text-white rounded-md hover:bg-gray-900 dark:hover:bg-gray-600 flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
                    >
                      <Download className="w-5 h-5" />
                      Install App
                    </button>
                  )}

                  {isIOS && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                      <h4 className="font-bold text-blue-800 dark:text-blue-200 mb-3 flex items-center gap-2">
                        <Smartphone className="w-5 h-5" />
                        Install on iPhone / iPad:
                      </h4>
                      <ol className="space-y-4 text-sm text-blue-900 dark:text-blue-100">
                        <li className="flex items-center gap-3">
                          <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-blue-200 dark:bg-blue-800 rounded-full font-bold text-xs">
                            1
                          </span>
                          <span>
                            Tap the <Share className="w-4 h-4 inline mx-1" /> <strong>Share</strong>{' '}
                            button in your browser toolbar.
                          </span>
                        </li>
                        <li className="flex items-center gap-3">
                          <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-blue-200 dark:bg-blue-800 rounded-full font-bold text-xs">
                            2
                          </span>
                          <span>
                            Scroll down and tap{' '}
                            <strong className="whitespace-nowrap">Add to Home Screen</strong>{' '}
                            <PlusSquare className="w-4 h-4 inline mx-1" />.
                          </span>
                        </li>
                        <li className="flex items-center gap-3">
                          <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-blue-200 dark:bg-blue-800 rounded-full font-bold text-xs">
                            3
                          </span>
                          <span>
                            Confirm by tapping <strong>Add</strong> in the top corner.
                          </span>
                        </li>
                      </ol>
                    </div>
                  )}

                  {!isInstallable && !isIOS && !isAppInstalled && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg text-sm text-gray-600 dark:text-gray-400">
                      <p className="font-semibold mb-2">Can't see the install button?</p>
                      <p>Try installing manually via your browser menu:</p>
                      <ul className="list-disc list-inside mt-1 ml-1 space-y-1">
                        <li>
                          <span className="font-bold">Chrome (Android):</span> Tap{' '}
                          <span className="font-bold">⋮</span> (three dots) &rarr;{' '}
                          <span className="font-bold">Install App</span> or{' '}
                          <span className="font-bold">Add to Home screen</span>.
                        </li>
                        <li>
                          <span className="font-bold">Safari (iOS):</span> Tap{' '}
                          <span className="font-bold">Share</span> &rarr;{' '}
                          <span className="font-bold">Add to Home Screen</span>.
                        </li>
                        <li>
                          <span className="font-bold">Desktop:</span> Look for an install icon in
                          the address bar.
                        </li>
                      </ul>
                    </div>
                  )}
                </>
              )}
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
                      alert(
                        'NFC is not supported on this device/browser. Try using Chrome on Android, or a dedicated NFC Tools app to write this URL: ' +
                          window.location.href +
                          '?emergency=true'
                      );
                      return;
                    }

                    // @ts-ignore - Web NFC API is experimental
                    const ndef = new window.NDEFReader();
                    await ndef.write({
                      records: [
                        {
                          recordType: 'url',
                          data:
                            window.location.origin + window.location.pathname + '?emergency=true',
                        },
                      ],
                    });
                    alert('✅ Success! Tag programmed. Tap it to test.');
                  } catch (error) {
                    console.error(error);
                    alert('❌ Write failed. Make sure NFC is on and the tag is unlocked.');
                  }
                }}
                className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
              >
                Start NFC Programming
              </button>
            </div>
          </section>

          {/* Data Management Section */}
          <section>
            <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Cloud className="w-6 h-6" />
              Data Management
            </h3>
            <div className="space-y-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Export your data to a file for safekeeping, or transfer it to another device.
                <br />
                <span className="text-xs italic opacity-80">
                  Note: Data is exported as a plain JSON file. Keep it safe.
                </span>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    const success = generateBackup();
                    if (success) alert('Backup file generated! Please save it.');
                    else alert('Backup generation failed.');
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Backup Data (Export)
                </button>

                <div className="relative">
                  <input
                    type="file"
                    accept=".json"
                    aria-label="Restore Backup File"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      if (
                        confirm(
                          'WARNING: This will overwrite your current app data with the backup file. Are you sure?'
                        )
                      ) {
                        const result = await restoreBackup(file);
                        alert(result.message);
                        if (result.success) {
                          window.location.reload();
                        }
                      }
                      // Reset input
                      e.target.value = '';
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors pointer-events-none">
                    <Upload className="w-5 h-5" />
                    Restore Data (Import)
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
      {isDeviceManagerOpen && <DeviceManager onClose={() => setIsDeviceManagerOpen(false)} />}
      <ApiKeyHelpModal isOpen={isApiKeyHelpOpen} onClose={() => setIsApiKeyHelpOpen(false)} />
    </div>
  );
};

export default SettingsScreen;
