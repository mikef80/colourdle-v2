import { Link } from "react-router";
import styles from "./Topbar.module.css";
import { useState } from "react";
import { useMenuStore } from "~/stores/useMenuStore";

const Topbar = ({ user }: { user: any | null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toggleLoginSignup } = useMenuStore();

  console.log(user, "<--user (Topbar.tsx)");

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <span className='letter-1 raleway-black'>C</span>
        <span className='letter-2 raleway-black'>o</span>
        <span className='letter-3 raleway-black'>l</span>
        <span className='letter-4 raleway-black'>o</span>
        <span className='letter-5 raleway-black'>u</span>
        <span className='letter-6 raleway-black'>r</span>
        <span className='letter-7 raleway-black'>d</span>
        <span className='letter-8 raleway-black'>l</span>
        <span className='letter-9 raleway-black'>e</span>
        <span className='letter-10 raleway-black'>!</span>
      </h1>
      <button className='menu-toggle' onClick={() => setIsOpen(!isOpen)}>
        Menu
      </button>
      <nav className={`${styles.navbar} ${isOpen ? styles.menuOpen : ""}`}>
        <button onClick={toggleLoginSignup}>Signup/Login</button>
        {/* <Link to={"/signup"}>Signup</Link>
        <Link to={"/login"}>Login</Link> */}
      </nav>
    </div>
  );
};

export default Topbar;
