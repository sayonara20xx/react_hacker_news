import React from 'react';

import { NewsDataResponse } from './Interfaces';

interface NewStore {
  selectedNew: React.ComponentState;
  setSelectedNewCallback: (obj: NewsDataResponse) => void;
}

export const NewsContext = React.createContext<NewStore | null>(null);
