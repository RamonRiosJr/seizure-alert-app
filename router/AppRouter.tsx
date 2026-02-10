import React from 'react';
import { useUI } from '../contexts/UIContext';
import AlertScreen from '../components/AlertScreen';
import ReadyScreen from '../components/ReadyScreen';

export const AppRouter: React.FC = () => {
  const { screen } = useUI();

  if (screen === 'alert') {
    return <AlertScreen />;
  }

  return <ReadyScreen />;
};
