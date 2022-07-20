import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import MainPage from './MainPage';
import NewsInfo from './NewsInfo';

import { NewsContext } from './SelectedNewStore';

interface response {
  by: string;
  id: number;
  descendants: number;
  kids: Array<number>;
  score: number;
  time: number;
  title: string;
  type: string;
  url: string;
}

const HackerNews: () => JSX.Element = () => {
  const [selectedNew, setSelectedNew] = useState<response | null>(null);

  const setSelectedNewCallback = (event: React.MouseEvent<HTMLAnchorElement>, obj: response): void => {
    setSelectedNew(() => {
      return obj;
    });
  };

  const SelectedNewStore = {
    selectedNew,
    setSelectedNewCallback,
  };

  return (
    <BrowserRouter>
      <NewsContext.Provider value={SelectedNewStore}>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/info" element={<NewsInfo />} />
        </Routes>
      </NewsContext.Provider>
    </BrowserRouter>
  );
};

export default HackerNews;
