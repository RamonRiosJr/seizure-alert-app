import React from 'react';
import { useBLEContext } from '../contexts/BLEContext';
import { Bluetooth, Activity, Smartphone, XCircle, Heart, Dumbbell } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const DeviceManager: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const {
    scan,
    isScanning,
    devices,
    connect,
    disconnect,
    connectedDevice,
    heartRate,
    error,
    isMock,
  } = useBLEContext();
  const [isWorkoutMode, setIsWorkoutMode] = useLocalStorage<boolean>('workout_mode', false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white dark:from-slate-800 dark:to-slate-900">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-300">
              <Bluetooth className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-gray-900 dark:text-white">Device Manager</h2>
              {isMock && (
                <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full font-medium">
                  Simulation Mode
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500"
            aria-label="Close Device Manager"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}

          {/* Connected State */}
          {connectedDevice ? (
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-100 dark:border-green-800 flex flex-col items-center text-center space-y-4">
                <div
                  className={`p-4 bg-white dark:bg-gray-800 rounded-full shadow-sm animate-pulse`}
                >
                  <Heart className={`w-8 h-8 text-red-500 ${heartRate ? 'fill-red-500' : ''}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {connectedDevice.name || 'Unknown Device'}
                  </h3>
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                    Connected & Monitoring
                  </p>
                </div>

                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white tabular-nums">
                    {heartRate ?? '--'}
                  </span>
                  <span className="text-sm text-gray-500 mb-1 font-medium">BPM</span>
                </div>

                <button
                  onClick={disconnect}
                  className="px-4 py-2 bg-white dark:bg-gray-800 text-red-600 border border-red-100 dark:border-red-900/50 rounded-lg text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shadow-sm"
                >
                  Disconnect Device
                </button>
              </div>

              {/* Workout Mode Toggle */}
              <div
                className={`p-4 rounded-xl border transition-all ${isWorkoutMode ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800' : 'bg-gray-50 border-gray-100 dark:bg-gray-800 dark:border-gray-700'}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${isWorkoutMode ? 'bg-amber-100 text-amber-600 dark:bg-amber-800 dark:text-amber-200' : 'bg-white text-gray-400 dark:bg-gray-700'}`}
                    >
                      <Dumbbell className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">Workout Mode</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Pause alerts during exercise
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsWorkoutMode(!isWorkoutMode)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isWorkoutMode ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                    aria-label={isWorkoutMode ? 'Disable Workout Mode' : 'Enable Workout Mode'}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${isWorkoutMode ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Scanning State
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                  Available Devices
                </h3>
                <button
                  onClick={scan}
                  disabled={isScanning}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${isScanning ? 'bg-gray-100 text-gray-400' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'}`}
                >
                  {isScanning ? 'Scanning...' : 'Scan for Devices'}
                </button>
              </div>

              {devices.length === 0 && !isScanning && (
                <div className="flex flex-col items-center py-8 text-gray-400">
                  <Smartphone className="w-12 h-12 mb-2 opacity-20" />
                  <p className="text-sm">No devices found. Tap Scan.</p>
                </div>
              )}

              <div className="space-y-2">
                {devices.map((device) => (
                  <button
                    key={device.deviceId}
                    onClick={() => connect(device)}
                    className="w-full p-3 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 border border-transparent hover:border-blue-100 dark:hover:border-blue-800 rounded-xl transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm text-gray-500 group-hover:text-blue-600">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {device.name || 'Unknown Device'}
                        </p>
                        <p className="text-xs text-gray-500">{device.deviceId}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      Connect
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
