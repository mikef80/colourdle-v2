import { Form, useNavigate } from "react-router";
import { useState } from "react";
import { supabase } from "~/utils/supabase.client";
import type { AuthError } from "@supabase/supabase-js";
import Modal from "../Modal/Modal";
import { useMenuStore } from "~/stores/useMenuStore";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<AuthError | null>(null);
  const { toggleLogin } = useMenuStore();
  const navigate = useNavigate();

  const resetStates = () => {
    setEmail("");
    setPassword("");
    setError(null);
    toggleLogin();
  };

  const handleSubmit = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error);
      return;
    }

    resetStates();

    return navigate("/");
  };

  return (
    <Modal>
      <Form onSubmit={handleSubmit}>
        <label htmlFor='loginemail'>Email:</label>
        <input
          type='email'
          name='loginemail'
          id='loginemail'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor='loginpassword'>Password:</label>
        <input
          type='password'
          name='loginpassword'
          id='loginpassword'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type='submit'>Log In</button>
        {error && <p>{error.message}</p>}
      </Form>
    </Modal>
  );
};

export default Login;
