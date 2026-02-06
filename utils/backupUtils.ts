export const generateBackup = () => {
    try {
        const backupData = {
            version: 1,
            timestamp: new Date().toISOString(),
            data: {
                appSettings: JSON.parse(localStorage.getItem('app_settings') || '{}'),
                emergencyContacts: JSON.parse(localStorage.getItem('emergency_contacts') || '[]'),
                patientInfo: JSON.parse(localStorage.getItem('patient_info') || '{}'),
                seizureLogs: JSON.parse(localStorage.getItem('seizure_logs') || '[]'),
                apiKey: JSON.parse(localStorage.getItem('gemini_api_key') || '""'),
                customAlertMessage: Object.keys(localStorage)
                    .filter(key => key.startsWith('seizure_alert_status_message_'))
                    .reduce((acc, key) => {
                        acc[key] = localStorage.getItem(key);
                        return acc;
                    }, {} as Record<string, string | null>)
            }
        };

        const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `aura-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return true;
    } catch (error) {
        console.error('Backup failed:', error);
        return false;
    }
};

export const restoreBackup = async (file: File): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const backup = JSON.parse(content);

                // Basic validation
                if (!backup.version || !backup.data) {
                    resolve({ success: false, message: 'Invalid backup file format.' });
                    return;
                }

                const { data } = backup;

                // Restore keys
                if (data.appSettings) localStorage.setItem('app_settings', JSON.stringify(data.appSettings));
                if (data.emergencyContacts) localStorage.setItem('emergency_contacts', JSON.stringify(data.emergencyContacts));
                if (data.patientInfo) localStorage.setItem('patient_info', JSON.stringify(data.patientInfo));
                if (data.seizureLogs) localStorage.setItem('seizure_logs', JSON.stringify(data.seizureLogs));
                if (data.apiKey) localStorage.setItem('gemini_api_key', JSON.stringify(data.apiKey));

                // Restore custom messages
                if (data.customAlertMessage) {
                    Object.entries(data.customAlertMessage).forEach(([key, value]) => {
                        if (typeof value === 'string') localStorage.setItem(key, value);
                    });
                }

                resolve({ success: true, message: 'Data restored successfully! The app will reload.' });
            } catch (error) {
                console.error('Restore failed:', error);
                resolve({ success: false, message: 'Failed to process backup file.' });
            }
        };
        reader.readAsText(file);
    });
};
