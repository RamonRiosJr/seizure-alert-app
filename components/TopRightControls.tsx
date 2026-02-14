import {
  Settings,
  ClipboardList,
  AlertTriangle,
  Heart,
  Coffee,
  Battery,
  Zap,
  Bluetooth,
  BluetoothSearching,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUI } from '../contexts/UIContext';
import { useBattery } from '../hooks/useBattery';
import { useSettings } from '../contexts/SettingsContext';
import { useBLEContext } from '../contexts/BLEContext';

interface TopRightControlsProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const buttonClasses =
  'p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full shadow-lg transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 hover:scale-105 active:scale-95';

const specializedButtonClasses = (colorClass: string) =>
  `p-3 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full shadow-lg transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 ${colorClass} hover:scale-105 active:scale-95`;

export default function TopRightControls(_props: TopRightControlsProps) {
  const { openModal } = useUI();
  const { t } = useTranslation();

  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-3">
      {/* Top Row: Story, Coffee, Disclosure */}
      <div className="flex items-center gap-3">
        {/* 1. My Story - High Priority */}
        <button
          onClick={() => openModal('about')}
          className={specializedButtonClasses(
            'focus-visible:ring-rose-500 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 hover:bg-rose-200 dark:hover:bg-rose-900/50'
          )}
          aria-label={t('aboutTitle') || 'About Aura'}
        >
          <Heart className="w-7 h-7 animate-pulse fill-rose-600 dark:fill-rose-400" />
        </button>

        {/* 2. Buy me a coffee */}
        <a
          href="https://buymeacoffee.com/RamonRiosJr"
          target="_blank"
          rel="noopener noreferrer"
          className={specializedButtonClasses(
            'focus-visible:ring-yellow-500 bg-[#FFDD00] text-black hover:bg-[#FFEA00]'
          )}
          aria-label="Buy me a coffee"
        >
          <Coffee className="w-6 h-6" />
        </a>

        {/* 3. Disclaimer */}
        <button
          onClick={() => openModal('disclaimer')}
          className={specializedButtonClasses(
            'focus-visible:ring-amber-500 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50'
          )}
          aria-label="Medical Disclaimer"
        >
          <AlertTriangle className="w-6 h-6" />
        </button>
      </div>

      {/* Dropping Down: Reports */}
      <button
        onClick={() => openModal('reports')}
        className={buttonClasses}
        aria-label={t('openReports') || 'View Reports'}
      >
        <ClipboardList className="w-6 h-6" />
      </button>

      {/* Dropping Down: Settings */}
      <button
        onClick={() => openModal('settings')}
        className={buttonClasses}
        aria-label={t('settings') || 'Settings'}
      >
        <Settings className="w-6 h-6" />
      </button>

      {/* Bluetooth Status Indicator */}
      <BluetoothIndicator />

      {/* Battery Indicator */}
      <BatteryIndicator />
    </div>
  );
}

function BluetoothIndicator() {
  const { connectedDevice, isReconnecting, scan } = useBLEContext();
  const { t } = useTranslation();

  // Decide Icon & Color
  let icon = <Bluetooth className="w-6 h-6 text-gray-400" />;
  let statusText = t('bluetoothDisconnected') || 'Bluetooth Disconnected';
  let classes = 'bg-gray-200 dark:bg-gray-700 focus-visible:ring-gray-400';

  if (isReconnecting) {
    icon = <BluetoothSearching className="w-6 h-6 text-yellow-600 animate-pulse" />;
    statusText = t('bluetoothReconnecting') || 'Bluetooth Reconnecting...';
    classes =
      'bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-500 focus-visible:ring-yellow-500';
  } else if (connectedDevice) {
    icon = <Bluetooth className="w-6 h-6 text-blue-500" />;
    statusText = `${t('bluetoothConnected') || 'Connected'}: ${connectedDevice.name || 'Device'}`;
    classes =
      'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500 focus-visible:ring-blue-500';
  }

  // Allow manual scan trigger by clicking icon if disconnected
  const handleClick = () => {
    if (!connectedDevice && !isReconnecting) {
      scan();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex flex-col items-center justify-center p-2 min-w-[44px] min-h-[44px] rounded-lg shadow-md transition-all cursor-pointer focus:outline-none focus-visible:ring-4 ${classes} hover:scale-105 active:scale-95`}
      title={statusText}
      aria-label={statusText}
    >
      {icon}
    </button>
  );
}

function BatteryIndicator() {
  const { level, charging, isSupported } = useBattery();
  const { lowPowerMode, setActiveTab } = useSettings();
  const { openModal } = useUI();
  const { t } = useTranslation();

  if (!isSupported) return null;

  const percentage = Math.round(level * 100);
  let colorClass = 'text-green-500';
  let borderClass = '';

  if (percentage < 20) {
    colorClass = 'text-red-500 animate-pulse';
    borderClass = 'border-2 border-red-500';
  } else if (percentage < 50) {
    colorClass = 'text-yellow-500';
    borderClass = 'border-2 border-yellow-500';
  }

  if (lowPowerMode) {
    borderClass = 'border-2 border-green-500';
  }

  const label =
    t('ariaBatteryStatus', {
      percentage,
      status: charging ? t('batteryCharging') : t('batteryDischarging'),
      action: t('batteryTapSettings'),
    }) || `Battery ${percentage}%, ${charging ? 'Charging' : 'Discharging'}`;

  const handleClick = () => {
    setActiveTab('care');
    openModal('settings');
  };

  return (
    <button
      onClick={handleClick}
      className={`flex flex-col items-center justify-center p-2 min-w-[44px] min-h-[44px] rounded-lg bg-gray-200 dark:bg-gray-700 shadow-md transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-green-500 hover:scale-105 active:scale-95 ${borderClass}`}
      title={`Battery: ${percentage}% ${charging ? '(Charging)' : ''} ${
        lowPowerMode ? '- Low Power Mode' : ''
      }`}
      aria-label={label}
    >
      <div className="relative">
        <Battery className={`w-6 h-6 ${colorClass}`} />
        {charging && (
          <div className="absolute -top-1 -right-1">
            <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          </div>
        )}
      </div>
      <span className="text-[10px] font-bold text-gray-600 dark:text-gray-300">{percentage}%</span>
    </button>
  );
}
