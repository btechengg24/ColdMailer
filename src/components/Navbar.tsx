import React from "react";
import { User } from "firebase/auth";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";

import { signInWithGoogle, signOutUser } from "../services/authServices";

interface NavbarProps {
  user?: User | null;
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const handleSignIn = async () => {
    console.log("Signin button clicked");
    const userCredential = await signInWithGoogle();
    if (userCredential) {
      console.log("User signed in handleSignIn");
    } else {
      console.log("Error signing in");
    }
  };
  const handleSignOut = async () => {
    try {
      // console.log("Signout button clicked");
      await signOutUser();
      console.log("User signed in handleSignOut");
    } catch (error) {
      console.log("Error signing out handleSignOut");
    }
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
      <h1 className="text-2xl font-bold text-gray-800">Cold Mailer</h1>

      {user ? (
        <div className="flex items-center gap-4">
          <Avatar
            image={user.photoURL || ""}
            shape="circle"
            className="shadow-md"
          />
          <span className="font-medium text-gray-800">{user.displayName}</span>
          <Button
            label="Logout"
            icon="pi pi-sign-out"
            className="p-button-text"
            onClick={handleSignOut}
          />
        </div>
      ) : (
        <Button
          label="Sign In"
          icon="pi pi-sign-in"
          className="p-button-outlined"
          onClick={handleSignIn}
        />
      )}
    </nav>
  );
};

export default Navbar;
