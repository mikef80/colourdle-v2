import { Form } from "react-router";

const Login = () => {
  return (
    <Form action='/login' method='post'>
      <input name='email' type='email' />
      <input name='password' type='password' />
      <button type='submit'>Submit</button>
    </Form>
  );
};

export default Login;
