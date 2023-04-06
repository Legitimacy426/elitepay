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

const useFetchTransactions = (id, date) => {
  const [transactions, setTransactions] = useState([]);
  const [isErrorT, setError] = useState(null);
  const [isPendingT, setPending] = useState(true);

  useEffect(() => {
    const Transactions = [];

    const userRef = collection(db, "transactions");
    const q = query(
      userRef,
      where("cardId", "==", id),
      orderBy("createdAt", "desc")
    );
    getDocs(q)
      .then((users) => {
        users.forEach((user) => {
          Transactions.push({ ...user.data(), id: user.id });
        });
        setTransactions(Transactions);
        setPending(false);
      })
      .catch((err) => {
        console.log(err.message);
        setError(e.message);
      });
  }, [date]);
  return { transactions, isErrorT, isPendingT };
};
export default useFetchTransactions;
