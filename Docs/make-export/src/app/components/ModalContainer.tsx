import { MobileMenu } from './MobileMenu';
import { AuthModal } from './AuthModal';
import { ContactModal } from './ContactModal';
import { ServicesModal } from './ServicesModal';
import { useModal } from '../contexts/ModalContext';

export function ModalContainer() {
  const {
    isMobileMenuOpen,
    isAuthModalOpen,
    isContactModalOpen,
    isServicesModalOpen,
    closeMobileMenu,
    closeAuthModal,
    closeContactModal,
    closeServicesModal,
    openAuthModal,
    openContactModal,
    openServicesModal,
  } = useModal();

  return (
    <>
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        onOpenAuth={openAuthModal}
        onOpenContact={openContactModal}
        onOpenServices={openServicesModal}
      />

      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />

      <ContactModal isOpen={isContactModalOpen} onClose={closeContactModal} />

      <ServicesModal isOpen={isServicesModalOpen} onClose={closeServicesModal} />
    </>
  );
}
