import React, { createContext, useContext, ReactNode } from 'react';
import { useBLE as useBLEHook, BleDevice } from '../hooks/useBLE';

interface BLEContextType {
    scan: () => Promise<void>;
    connect: (device: BleDevice) => Promise<void>;
    disconnect: () => Promise<void>;
    isScanning: boolean;
    devices: BleDevice[];
    connectedDevice: BleDevice | null;
    heartRate: number | null;
    error: string | null;
    isMock: boolean;
}

const BLEContext = createContext<BLEContextType | null>(null);

export const BLEProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const bleState = useBLEHook();

    return (
        <BLEContext.Provider value={bleState}>
            {children}
        </BLEContext.Provider>
    );
};

export const useBLEContext = () => {
    const context = useContext(BLEContext);
    if (!context) {
        throw new Error('useBLEContext must be used within a BLEProvider');
    }
    return context;
};
