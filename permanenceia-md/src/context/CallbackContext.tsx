import React, { createContext, useContext, useState } from 'react';

export type CallbackType = 'commercial' | 'support';

export interface CallbackOptions {
  type?: CallbackType;
  sector?: string;
  agent?: string;
  plan?: string;
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

  const openCallbackModal = (newOptions: CallbackOptions = {}) => {
    setOptions(newOptions);
    setIsOpen(true);
  };

  const closeCallbackModal = () => {
    setIsOpen(false);
  };

  return (
    <CallbackContext.Provider
      value={{
        isOpen,
        options,
        openCallbackModal,
        closeCallbackModal,
      }}
    >
      {children}
    </CallbackContext.Provider>
  );
};

export const useCallbackModal = () => useContext(CallbackContext);
