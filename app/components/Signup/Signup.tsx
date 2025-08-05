import { Form, redirect } from "react-router";
import { useState } from "react";
import { supabase } from "~/utils/supabase.client";
import { AuthApiError, AuthError } from "@supabase/supabase-js";

const Signup = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<AuthError>();

  const handleSubmit = async () => {
    if (password! !== confirmPassword) {
      setError(new AuthError("Passwords do not match"));
      return;
    }

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (data.user && data.session === null && data.user.identities?.length === 0) {
      // Email already exists
      setError(new AuthError("Email already in use", 409));
      return;
    }

    if (error) {
      setError(error);
      return;
    }

    
    return redirect('/login');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <label htmlFor='signupemail'>Email:</label>
      <input
        type='email'
        name='signupemail'
        id='signupemail'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label htmlFor='signuppassword'>Password:</label>
      <input
        type='password'
        name='signuppassword'
        id='signuppassword'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <label htmlFor='signupconfirmpassword'>Confirm Password:</label>
      <input
        type='password'
        name='signupconfirmpassword'
        id='signupconfirmpassword'
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button type='submit'>Sign Up</button>
      {error && <p>{error.message}</p>}
    </Form>
  );
};

export default Signup;
