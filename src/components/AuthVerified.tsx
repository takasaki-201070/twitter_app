import React from "react";

import { auth } from "../firebase";
import { Button } from "@material-ui/core";

const AuthVerified: React.FC = () => {
  // パスワードを忘れた場合にＥメール送信
  const sendVerificationEmail = async (e: React.MouseEvent<HTMLElement>) => {
    await auth.currentUser
      ?.sendEmailVerification()
      .then(() => {})
      .catch((err) => {
        alert(err.message);
      });
  };
  return (
    <div>
      <p>Ｅメール認証を行って下さい</p>
      <Button onClick={sendVerificationEmail}>認証メールを再送する</Button>
      <Button onClick={() => auth.signOut()}>ログイン画面に戻る</Button>
    </div>
  );
};

export default AuthVerified;
