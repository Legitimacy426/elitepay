import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

const useFetchCards = (phone, date) => {
  const [cards, setCards] = useState([]);
  const [isErrorC, setError] = useState(null);
  const [isPendingC, setPendingC] = useState(true);

  useEffect(() => {
    const Cards = [];

    const userRef = collection(db, "cards");
    const q = query(
      userRef,
      where("phone", "==", phone),
      orderBy("createdAt", "desc")
    );
    getDocs(q)
      .then((users) => {
        users.forEach((user) => {
          Cards.push({ ...user.data(), id: user.id });
        });
        setCards(Cards);
        setPendingC(false);
      })
      .catch((err) => {
        console.log(err.message);
        setError(e.message);
      });
  }, [date]);
  return { cards, isErrorC, isPendingC };
};
export default useFetchCards;
