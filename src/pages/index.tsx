import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup
} from "firebase/auth";
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { auth, db } from "~/constants";

const Home: NextPage = (): JSX.Element => {
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  console.log(auth);
  const provider = new GoogleAuthProvider();

  const testHandle = async () => {
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

  (async () => {
    try {
      const cResult = await getDoc(doc(db, "user", "userId"));

      console.log("データを取得: ", cResult.data());
    } catch (error) {
      console.log(error);
    }
  })();

  // if (cResult.exists()) {
  //   console.log("Document data:", docSnap.data());
  // } else {
  //   // doc.data() will be undefined in this case
  //   console.log("No such document!");
  // }

  const addHandle = async () => {
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

  const addDataHandle = async () => {
    try {
      await updateDoc(doc(db, "user", "userId"), {
        first: "テスto"
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  // const addHandle = async () => {
  //   try {
  //     const docRef = await setDoc(doc(db, "user", userId), {
  //       first: "これはテスト",
  //       last: "Lovelace"
  //     });

  //     console.log("Document written with ID: ", docRef.id);
  //   } catch (e) {
  //     console.error("Error adding document: ", e);
  //   }
  // };

  // const unsub = onSnapshot(doc(db, "user", "userId"), (doc) => {
  //   console.log("Current data: ", doc.data());
  // });

  onSnapshot(doc(db, "user", "userId"), (doc) => {
    if (doc.exists()) {
      console.log("リアルタイム:", doc.data());
    } else {
      console.log("No such document!");
    }
  });

  // console.log("リアルタイム: ", unsub());

  // useEffect(() => {
  //   if (uid) {
  //     const uidFun = async () => {
  //       await setDoc(doc(db, "users", uid), {
  //         score: 0,
  //         mode: "default"
  //       });
  //     };
  //     uidFun();
  //   }
  // }, [uid]);

  return (
    <>
      <h1>index page</h1>
      <button onClick={testHandle}>ボタン</button>
      <p>name: {name}</p>
      <button onClick={addHandle}>追加ボタン</button>
      <button onClick={addDataHandle}>データを書き換えるボタン</button>
    </>
  );
};
export default Home;
