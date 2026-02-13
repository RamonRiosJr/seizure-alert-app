import React from 'react';
import { Card } from '../ui/Card';
import { User, ShieldAlert, Users } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useTranslation } from 'react-i18next';
import { SettingContacts } from './SettingContacts';
import { useConfigContext } from '../../contexts/ConfigContext';

export const PeopleTab: React.FC = () => {
  const { t } = useTranslation();
  const { activeProfile, setProfileId, availableProfiles } = useConfigContext();
  const [patientInfo, setPatientInfo] = useLocalStorage<{
    name: string;
    bloodType: string;
    medicalConditions: string;
  }>('patient_info', {
    name: '',
    bloodType: '',
    medicalConditions: '',
  });

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center space-x-4 mb-6">
          <div className="h-12 w-12 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400">
            <User className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              {t('settingsPatientInfo', 'My Profile')}
            </h3>
            <p className="text-sm text-slate-400">
              {t('settingsAppModeDesc', 'Information for emergency responders')}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Application Mode */}
          <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-800/50 mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-semibold text-blue-200">
                  {t('settingsAppMode', 'Safety Mode')}
                </span>
              </div>
              <Badge variant="default">{activeProfile.name}</Badge>
            </div>
            <select
              value={activeProfile.id}
              onChange={(e) => setProfileId(e.target.value)}
              aria-label={t('settingsAppMode', 'Safety Mode')}
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {availableProfiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">
              {t('settingsPatientName', 'Full Name')}
            </label>
            <input
              type="text"
              value={patientInfo.name}
              onChange={(e) => setPatientInfo({ ...patientInfo, name: e.target.value })}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder={t('settingsPatientNamePlaceholder', 'e.g. John Doe')}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">
              {t('settingsBloodType', 'Blood Type')}
            </label>
            <select
              value={patientInfo.bloodType}
              onChange={(e) => setPatientInfo({ ...patientInfo, bloodType: e.target.value })}
              aria-label={t('settingsBloodType', 'Blood Type')}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              <option value="">{t('settingsBloodTypePlaceholder', 'Select Blood Type')}</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">
              {t('settingsMedicalConditions', 'Medical Conditions')}
            </label>
            <textarea
              value={patientInfo.medicalConditions}
              onChange={(e) =>
                setPatientInfo({ ...patientInfo, medicalConditions: e.target.value })
              }
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all h-24 resize-none"
              placeholder={t('settingsMedicalConditionsPlaceholder', 'e.g. Epilepsy, Allergies...')}
            />
          </div>
        </div>
      </Card>

      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Users className="w-6 h-6 text-green-400" />
          <h3 className="text-xl font-bold text-white">
            {t('settingsContacts', 'Emergency Contacts')}
          </h3>
        </div>
        <SettingContacts />
      </section>
    </div>
  );
};
