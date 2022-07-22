import React from 'react';

import { NewsDataResponse } from './Interfaces';

interface NewStore {
  selectedNew: React.ComponentState;
  setSelectedNewCallback: (event: React.MouseEvent<HTMLAnchorElement>, obj: NewsDataResponse) => void;
}

export const NewsContext = React.createContext<NewStore | null>(null);
