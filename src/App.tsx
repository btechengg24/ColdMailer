import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import HomePage from "./pages/Home";
import LoginPage from "./pages/LoginPage";

import app from "./Firebase/config";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

import "./App.css";

function App() {
  const [user, setUser] = useState<User | null>(null);
  const auth = getAuth(app);

  useEffect(() => {
    // Listen for user state changes (sign in / sign out)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    // Clean up the listener when the component is unmounted
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <Navbar user={user} />
      {!user ? <LoginPage /> : <HomePage />}
    </div>
  );
}

export default App;
