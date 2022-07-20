import React from 'react';

import { Response } from './Interfaces';

interface NewStore {
  selectedNew: React.ComponentState;
  setSelectedNewCallback: (event: React.MouseEvent<HTMLAnchorElement>, obj: Response) => void;
}

export const NewsContext = React.createContext<NewStore | null>(null);
