import { Form } from "react-router";
import Modal from "../Modal/Modal";

const Signup = () => {
  



  return (
    <Modal>
      <Form action='/signup' method='post'>
        <input type='email' name='email' placeholder='Enter your email...' />
        <input
          type='password'
          name='password'
          id='password'
          placeholder='Enter your password...'
        />
        <input
          type='password'
          name='passwordconfirm'
          id='passwordconfirm'
          placeholder='Confirm your password...'
        />
        <button type='submit' >
          Submit
        </button>
      </Form>
    </Modal>
  );
};

export default Signup;
