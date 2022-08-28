import { setUserState } from "../../../store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { wrapper } from "../../../store/store";
import styles from "./Username.module.scss"
import { SetStateAction, useState } from "react";

export default function Username() {
	const dispatch = useDispatch();
	const [username, setUsername] = useState('');

	const onSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    dispatch(setUserState(username));
  };

	const onChange = (e: { target: { value: SetStateAction<string>; }; }) => setUsername(e.target.value);

	return (
    <div className={styles.container}>
      <form onSubmit={onSubmit}>
        <div>
          <label>
            <span>Username:</span>
            <input type="text" name="username" onChange={onChange} value={username} />
          </label>
        </div>
        <input type="submit" value="Create Concept" />
      </form>
    </div>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ params }) => {
      // we can set the initial state from here
      // we are setting to false but you can run your custom logic here
      await store.dispatch(setUserState(false)); 
      console.log("State on server", store.getState());
      return {
        props: {
          authState: false,
        },
      };
    }
);