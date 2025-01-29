import { useState } from "react";
import Navbar from "./components/Navbar";
import "./App.css";
import HomePage from "./pages/Home";

function App() {
  return (
    <div>
      <Navbar />
      <HomePage />
    </div>
  );
}

export default App;
