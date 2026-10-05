import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type CallbackType = 'commercial' | 'support' | 'demo';

export interface CallbackOptions {
  type?: CallbackType;
  sector?: string;
}

interface CallbackContextType {
  isOpen: boolean;
  options: CallbackOptions;
  openCallbackModal: (options?: CallbackOptions) => void;
  closeCallbackModal: () => void;
}

const CallbackContext = createContext<CallbackContextType>({
  isOpen: false,
  options: {},
  openCallbackModal: () => {},
  closeCallbackModal: () => {},
});

export const CallbackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<CallbackOptions>({});

  const openCallbackModal = useCallback((next: CallbackOptions = {}) => {
    setOptions(next);
    setIsOpen(true);
  }, []);
  const closeCallbackModal = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ isOpen, options, openCallbackModal, closeCallbackModal }), [isOpen, options, openCallbackModal, closeCallbackModal]);
  return <CallbackContext.Provider value={value}>{children}</CallbackContext.Provider>;
};

export const useCallbackModal = () => useContext(CallbackContext);
