import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Brain, Mic } from 'lucide-react';

export const AIHubTab: React.FC = () => {
    return (
        <>
            <Card variant="glass" className="border-blue-500/30">
                <div className="flex items-center space-x-4 mb-4">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                        <Brain className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">Aura Intelligence</h3>
                        <p className="text-sm text-blue-200">Smart diagnostics & assistance</p>
                    </div>
                    <div className="ml-auto">
                        <Badge variant="default">Pro</Badge>
                    </div>
                </div>

                <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50 mb-4">
                    <p className="text-sm text-slate-300">
                        AI integration is currently in <strong>Beta</strong>. Requires a Gemini API Key.
                    </p>
                </div>

                <Button className="w-full" variant="primary">
                    Configure API Key
                </Button>
            </Card>

            <Card>
                <div className="flex items-center justify-between opacity-50 grayscale">
                    <div className="flex items-center space-x-3">
                        <Mic className="h-5 w-5 text-slate-400" />
                        <div className="flex flex-col">
                            <span className="text-slate-200">Voice Activation</span>
                            <span className="text-xs text-slate-500">"Hey Aura" (Coming Soon)</span>
                        </div>
                    </div>
                    <Switch checked={false} onCheckedChange={() => { }} disabled />
                </div>
            </Card>
        </>
    );
};

// Internal Switch component for disabled state usage above, avoiding circular dep if separate file not strictly needed, 
// but we have it in ui/Switch so let's import it.
// Actually, I'll import it at the top.
import { Switch } from '../ui/Switch';
