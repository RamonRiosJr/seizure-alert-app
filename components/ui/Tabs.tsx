import React from 'react';

interface TabsProps {
    defaultValue: string;
    value?: string;
    onValueChange?: (value: string) => void;
    children: React.ReactNode;
    className?: string;
}

interface TabsListProps {
    children: React.ReactNode;
    className?: string;
}

interface TabsTriggerProps {
    value: string;
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
}

interface TabsContentProps {
    value: string;
    children: React.ReactNode;
    className?: string;
}

// Context for managing tab state
const TabsContext = React.createContext<{
    value: string;
    onValueChange: (value: string) => void;
} | null>(null);

export const Tabs: React.FC<TabsProps> = ({
    defaultValue,
    value,
    onValueChange,
    children,
    className = ''
}) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);

    const currentValue = value !== undefined ? value : internalValue;
    const handleValueChange = React.useCallback((newValue: string) => {
        setInternalValue(newValue);
        onValueChange?.(newValue);
    }, [onValueChange]);

    return (
        <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
            <div className={`w-full ${className}`}>
                {children}
            </div>
        </TabsContext.Provider>
    );
};

export const TabsList: React.FC<TabsListProps> = ({ children, className = '' }) => {
    return (
        <div className={`inline-flex h-10 items-center justify-center rounded-lg bg-slate-800 p-1 text-slate-400 ${className}`}>
            {children}
        </div>
    );
};

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
    value,
    children,
    className = '',
    disabled = false
}) => {
    const context = React.useContext(TabsContext);
    if (!context) throw new Error("TabsTrigger must be used within Tabs");

    const isActive = context.value === value;

    return (
        <button
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={disabled}
            onClick={() => context.onValueChange(value)}
            className={`
        inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
        ${isActive
                    ? 'bg-white text-slate-950 shadow-sm'
                    : 'hover:bg-slate-700 hover:text-slate-100'}
        ${className}
      `}
        >
            {children}
        </button>
    );
};

export const TabsContent: React.FC<TabsContentProps> = ({
    value,
    children,
    className = ''
}) => {
    const context = React.useContext(TabsContext);
    if (!context) throw new Error("TabsContent must be used within Tabs");

    if (context.value !== value) return null;

    return (
        <div
            role="tabpanel"
            className={`mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 ${className}`}
        >
            {children}
        </div>
    );
};
