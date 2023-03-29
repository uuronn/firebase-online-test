import { css } from "@emotion/react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup
} from "firebase/auth";
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { auth, db } from "~/constants";

const Home: NextPage = (): JSX.Element => {
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [first, setFirst] = useState("");
  console.log(auth);
  const provider = new GoogleAuthProvider();

  const signInHandle = async () => {
    try {
      const res = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(res);
      if (!credential) return;
      const token = credential.accessToken;

      console.log("token: ", token);

      const user = res.user;
      if (!user.displayName) return;

      console.log("user: ", user);
      setName(user.displayName);
      console.log("displayName: ", user.displayName);
    } catch (error) {
      console.log(error);
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // // The email of the user's account used.
      // const email = error.customData.email;
      // // The AuthCredential type that was used.
      // const credential = GoogleAuthProvider.credentialFromError(error);
    }
  };

  // DOM生成時に認証してるか確認
  useEffect(() => {
    console.log("db: ", db);
    onAuthStateChanged(auth, (user) => {
      if (!user) return;
      if (!user.displayName) return;
      console.log("onAuthのuser: ", user);
      setName(user.displayName);
      setUserId(user.uid);
    });
  }, []);

  // (async () => {
  //   try {
  //     const cResult = await getDoc(doc(db, "user", "userId"));

  //     console.log("データを取得: ", cResult.data());
  //   } catch (error) {
  //     console.log(error);
  //   }
  // })();

  const createHandle = async () => {
    try {
      const docRef = await setDoc(doc(db, "user", userId), {
        first: "これはテスト",
        last: "Lovelace"
      });

      console.log("Document written with ID: ", docRef);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  // データを書き換える関数
  const updateHandle = async () => {
    try {
      await updateDoc(doc(db, "user", "userId"), {
        first: "値が更新されました "
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  // リアルタイムで値を監視して、変更があれば更新する関数
  onSnapshot(doc(db, "user", "userId"), (doc) => {
    if (doc.exists()) {
      console.log("リアルタイム:", doc.data());
      setFirst(doc.data().first);
    } else {
      console.log("No such document!");
    }
  });

  return (
    <>
      <h1>index page</h1>
      <button css={button} onClick={signInHandle}>
        サインインボタン
      </button>
      <p>name: {name}</p>
      <button css={button} onClick={createHandle}>
        追加ボタン
      </button>
      <button css={button} onClick={updateHandle}>
        データを書き換えるボタン
      </button>
      <p css={text}>
        この値がリアルタイムで更新: <span css={span}>{first}</span>
      </p>
    </>
  );
};
export default Home;

const button = css`
  background: #e0e0e0;
  border: solid 1px black;
  display: block;
`;

const text = css`
  font-size: 20px;
`;

const span = css`
  font-size: 24px;
`;
