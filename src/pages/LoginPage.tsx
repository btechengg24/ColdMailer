import React from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { signInWithGoogle } from "../services/authServices";

const LoginPage: React.FC = () => {
  const handleSignIn = async () => {
    console.log("Signin button clicked");
    const userCredential = await signInWithGoogle();
    if (userCredential) {
      console.log("User signed in handleSignIn");
    } else {
      console.log("Error signing in");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="shadow-lg p-6 text-center w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          Welcome to Cold Mailer
        </h1>
        <p className="text-gray-600 mb-5">Please sign in to continue</p>

        <Button
          label="Sign In with Google"
          icon="pi pi-google"
          className="p-button-rounded p-button-outlined p-button-primary w-full"
          onClick={handleSignIn}
        />
      </Card>
    </div>
  );
};

export default LoginPage;
