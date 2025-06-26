import { Form, useActionData, useFetcher } from "react-router";
import Modal from "../Modal/Modal";

const Signup = () => {
  const fetcher = useFetcher();
  const actionData = fetcher.data;
  console.log(actionData, "<-- actionData");

  return (
    <Modal>
      <fetcher.Form action='/signup' method='post'>
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
        <button type='submit'>Submit</button>

        {actionData?.formError && <p className='error'>Error: {actionData.formError}</p>}
      </fetcher.Form>
    </Modal>
  );
};

export default Signup;
