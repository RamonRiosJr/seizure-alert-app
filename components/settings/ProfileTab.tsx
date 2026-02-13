import React from 'react';
import { Card } from '../ui/Card';

import { User, Phone } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const ProfileTab: React.FC = () => {
  return (
    <>
      <Card>
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400">
            <User className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">Patient Profile</h3>
            <p className="text-sm text-slate-400">Manage your medical data</p>
          </div>
          <div className="ml-auto">
            <Badge variant="default">Basic</Badge>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-red-400" />
              <span className="text-slate-200">Emergency Contacts</span>
            </div>
            <Badge variant="warning">Not Set</Badge>
          </div>
          <p className="text-xs text-slate-500">Add contacts to notify during a seizure event.</p>
        </div>
      </Card>
    </>
  );
};
