import { createContext, useContext, useState, ReactNode } from 'react';

interface ModalContextType {
  openAuthModal: () => void;
  openContactModal: () => void;
  openServicesModal: () => void;
  openMobileMenu: () => void;
  isAuthModalOpen: boolean;
  isContactModalOpen: boolean;
  isServicesModalOpen: boolean;
  isMobileMenuOpen: boolean;
  closeAuthModal: () => void;
  closeContactModal: () => void;
  closeServicesModal: () => void;
  closeMobileMenu: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isServicesModalOpen, setIsServicesModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <ModalContext.Provider
      value={{
        openAuthModal: () => setIsAuthModalOpen(true),
        openContactModal: () => setIsContactModalOpen(true),
        openServicesModal: () => setIsServicesModalOpen(true),
        openMobileMenu: () => setIsMobileMenuOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        closeContactModal: () => setIsContactModalOpen(false),
        closeServicesModal: () => setIsServicesModalOpen(false),
        closeMobileMenu: () => setIsMobileMenuOpen(false),
        isAuthModalOpen,
        isContactModalOpen,
        isServicesModalOpen,
        isMobileMenuOpen,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
