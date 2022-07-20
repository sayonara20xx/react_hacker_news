import React from 'react';

export interface Response {
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

export interface NewsSummaryProps {
  data: {
    by: string;
    id: number;
    descendants: number;
    kids: Array<number>;
    score: number;
    time: number;
    title: string;
    type: string;
    url: string;
  };

  number: number;
}

export interface CommentInfo {
  text: string;
  kids: Array<number>;
  by: string;
}

export interface CommentProps {
  id: number;
  key: React.Key;
}
