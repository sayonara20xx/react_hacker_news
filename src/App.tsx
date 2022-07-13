import "./App.css";
import HackerNews from "./HackerNews/HackerNews";
import React from "react";

const App: () => JSX.Element = () => {
  return (
    <div className="App">
      <HackerNews />
    </div>
  );
};

export default App;
