import React from "react";
import { BrowserRouter } from "react-router-dom";
import MainPage from "./MainPage/MainPage";

const HackerNews: () => JSX.Element = () => {
  return (
    <BrowserRouter>
      <div>
        <MainPage />
      </div>
    </BrowserRouter>
  );
};

export default HackerNews;
