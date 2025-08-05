import { ReactNode } from "react";
import styles from "./Modal.module.css";
import { useMenuStore } from "~/stores/useMenuStore";

type Props = { children: ReactNode };

const Modal = ({ children }: Props) => {
  const { setLogin, setSignup } = useMenuStore();

  const closeModals = () => {
    setLogin(false);
    setSignup(false);
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className={styles.modalOverlay} onClick={closeModals}>
      <div className={styles.modal} onClick={stopPropagation}>{children}</div>
    </div>
  );
};

export default Modal;
