"use client";

import React, { createContext, useContext, useState } from "react";
import LoginModal from "./LoginModal";

type ContextType = {
  open: () => void;
  close: () => void;
};

const LoginModalContext = createContext<ContextType | undefined>(undefined);

export function LoginModalProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);

  const open = () => setVisible(true);
  const close = () => setVisible(false);

  return (
    <LoginModalContext.Provider value={{ open, close }}>
      {children}
      <LoginModal visible={visible} onClose={close} />
    </LoginModalContext.Provider>
  );
}

export function useLoginModal() {
  const ctx = useContext(LoginModalContext);
  if (!ctx) throw new Error('useLoginModal must be used within LoginModalProvider');
  return ctx;
}
