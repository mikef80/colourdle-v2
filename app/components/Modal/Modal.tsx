import { ReactNode } from "react";
import styles from "./Modal.module.css";

type Props = { children: ReactNode };

const Modal = ({ children }: Props) => {
  return <div className={styles.modalOverlay}>
    <div className={styles.modal}>{children}</div>
  </div>;
};

export default Modal;
