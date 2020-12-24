import React, { useState } from "react";
import styles from "./TweetInput.module.css";
import { storage, db, auth } from "../firebase";
import firebase from "firebase/app";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import {
  Avatar,
  Button,
  IconButton,
  TextareaAutosize,
} from "@material-ui/core";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import SendIcon from "@material-ui/icons/Send";

const TweetInput: React.FC = () => {
  const user = useSelector(selectUser);
  const [tweetImage, setTweetImage] = useState<File | null>(null);
  const [tweetMsg, setTweetMsg] = useState("");

  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setTweetImage(e.target.files![0]);
      e.target.value = "";
    }
  };
  const sendTweet = (e: React.FormEvent<HTMLFormElement>) => {
    // ボタンクリック時に画面のリフレッシュをしないようにする
    e.preventDefault();

    if (tweetImage) {
      // ランダムな文字
      const S =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const N = 16;
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join("");
      const fileName = randomChar + "_" + tweetImage.name;
      // 画像のアップロード
      const uploadTweetImg = storage.ref(`images/${fileName}`).put(tweetImage);
      // ストレージに変化が有った場合に処理する。
      uploadTweetImg.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        () => {},
        (err) => {
          alert(err.message);
        },
        async () => {
          await storage
            .ref("images")
            .child(fileName)
            .getDownloadURL()
            .then(async (url) => {
              // 画像のアップロードが正常に終わった場合
              // ファイルのコレクション（データベースのテーブルへinsertするイメージ）
              await db.collection("posts").add({
                avatar: user.photoUrl,
                image: url,
                text: tweetMsg,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                username: user.displayName,
              });
            });
        }
      );
    } else {
      // 画像なしの場合
      // ファイルのコレクション（データベースのテーブルへinsertするイメージ）
      db.collection("posts").add({
        avatar: user.photoUrl,
        image: "",
        text: tweetMsg,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        username: user.displayName,
      });
    }
    setTweetImage(null);
    setTweetMsg("");
  };
  return (
    <>
      <form onSubmit={sendTweet}>
        <div className={styles.tweet_form}>
          <Avatar
            className={styles.tweet_avatar}
            src={user.photoUrl}
            onClick={async () => {
              await auth.signOut();
            }}
          />
          {/* <input
            className={styles.tweet_input}
            placeholder="What's happening?"
            type="text"
            autoFocus
            value={tweetMsg}
            onChange={(e) => setTweetMsg(e.target.value)}
          /> */}
          <TextareaAutosize
            className={styles.tweet_input}
            placeholder="新しいメッセージの入力"
            autoFocus
            value={tweetMsg}
            onChange={(e) => setTweetMsg(e.target.value)}
          />
          <IconButton>
            <label>
              <AddAPhotoIcon
                className={
                  tweetImage ? styles.tweet_addIconLoaded : styles.tweet_addIcon
                }
              />
              <input
                className={styles.tweet_hiddenIcon}
                type="file"
                onChange={onChangeImageHandler}
              />
            </label>
          </IconButton>
          {/* <Button
            type="submit"
            disabled={!tweetMsg}
            className={
              tweetMsg ? styles.tweet_sendBtn : styles.tweet_sendDisableBtn
            }
          >
            Tweet
          </Button> */}
          <IconButton type="submit" disabled={!tweetMsg}>
            <SendIcon
              className={
                tweetMsg ? styles.tweet_sendBtn : styles.tweet_addIconLoaded
              }
            />
          </IconButton>
        </div>
      </form>
    </>
  );
};

export default TweetInput;
