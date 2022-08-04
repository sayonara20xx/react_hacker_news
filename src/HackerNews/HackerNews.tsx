import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import MainPage from './MainPage';
import NewsInfo from './NewsInfo';

import { NewsContext } from './SelectedNewStore';
import { NewsDataResponse } from './Interfaces';

const HackerNews: React.FC = () => {
  const [selectedNew, setSelectedNew] = useState<NewsDataResponse | null>(null);

  const setSelectedNewCallback = (obj: NewsDataResponse): void => {
    setSelectedNew(() => {
      return obj;
    });

    localStorage.setItem('selectedNewObject', JSON.stringify(obj));
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
          <Route path="/info/:id" element={<NewsInfo />} />
        </Routes>
      </NewsContext.Provider>
    </BrowserRouter>
  );
};

export default HackerNews;
