import React, { useEffect } from "react";
import styles from "./App.module.css";
import { useSelector, useDispatch } from "react-redux";
import {
  selectUser,
  login,
  logout,
  setEmailVerified,
} from "./features/userSlice";
import { auth } from "./firebase";
import Top from "./components/Top";
import Auth from "./components/Auth";

const App: React.FC = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    // userが変わった時に実行される（ログイン、ログオフ）
    // authUser : 変更後のユーザ情報
    const unSub = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch(
          login({
            uid: authUser.uid,
            photoUrl: authUser.photoURL,
            displayName: authUser.displayName,
          })
        );
        dispatch(
          setEmailVerified({
            emailVerified: auth.currentUser?.emailVerified,
          })
        );
      } else {
        dispatch(logout());
      }
    });
    return () => {
      unSub();
    };
  }, [dispatch]);

  return (
    <>
      {" "}
      {user.uid ? (
        <div className={styles.app}>
          <Top />
        </div>
      ) : (
        <Auth />
      )}
    </>
  );
};

export default App;
