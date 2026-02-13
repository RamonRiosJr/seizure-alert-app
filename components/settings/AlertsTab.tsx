import React from 'react';
import { Card } from '../ui/Card';
import { Switch } from '../ui/Switch';

import { Bell, Activity } from 'lucide-react';

export const AlertsTab: React.FC = () => {

    // Placeholder state - in real implementation, these would come from a specific hook or context
    const [sirenEnabled, setSirenEnabled] = React.useState(true);


    return (
        <>
            <Card>
                <div className="flex items-center space-x-4 mb-4">
                    <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">
                        <Bell className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-white">Emergency Alerts</h3>
                        <p className="text-sm text-slate-400">Configure siren and notifications</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-slate-200">Loud Siren</span>
                        <Switch checked={sirenEnabled} onCheckedChange={setSirenEnabled} />
                    </div>
                    <p className="text-xs text-slate-500">
                        Play a loud alarm sound even when the device is in Do Not Disturb mode.
                    </p>
                </div>
            </Card>

            <Card>
                <div className="flex items-center space-x-4 mb-4">
                    <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <Activity className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-white">Fall Detection</h3>
                        <p className="text-sm text-slate-400">Sensitivity and automated triggers</p>
                    </div>
                </div>

                <div className="p-4 bg-slate-800 rounded-lg border border-slate-700 text-center">
                    <p className="text-sm text-slate-400">Sensitivity Calibration</p>
                    <div className="mt-2 text-2xl font-bold text-blue-400">Normal</div>
                </div>
            </Card>
        </>
    );
};
