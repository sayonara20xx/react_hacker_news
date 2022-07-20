import React, { useContext, useEffect, useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';

import Comment from './Comment';
import styled from 'styled-components';

import { NewsContext } from './SelectedNewStore';

const NewDiv = styled.div`
  width: 80%;
  margin: 0 auto;
  background-color: bisque;
  padding: 20px;
`;

const NewHeaderDiv = styled.div`
  width: 50%;
  margin: 0 auto;
  background-color: burlywood;

  border-radius: 10px;
  padding: 10px;
`;

const Comments = styled.div`
  margin-top: 20px;
`;

const NavLinkText = styled.p`
  font-size: 20px;
`;

const RefreshButton = styled.button`
  width: 50%;
  height: 50px;
  background-color: #e35d63;
  border-radius: 20px;
`;

const ButtonText = styled.p`
  font-size: 20px;
  padding-top: 5px;
`;

const TitleText = styled.p`
  font-size: 20px;
`;

const NewsInfo: React.FC = () => {
  let store = useContext(NewsContext);
  let selectedNew = store?.selectedNew;

  if (!selectedNew) {
    selectedNew = localStorage.getItem('selectedNewObject');
    selectedNew = JSON.parse(selectedNew);
  }

  let dateFormatOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };
  let formattedDate: string = new Date(selectedNew.time * 1000).toLocaleDateString('en-US', dateFormatOptions);

  const [commentsId, setCommentsId] = useState<number[]>(() => {
    return [];
  });

  const IntervalID: React.MutableRefObject<NodeJS.Timer | undefined> = useRef();

  useEffect(() => {
    setCommentsId(() => {
      return selectedNew.kids;
    });
  }, [selectedNew.kids]);

  useEffect(() => {
    IntervalID.current = setInterval(() => {
      refreshOnCLick();
    }, 60000);
  }, [commentsId, selectedNew.id]);

  const refreshOnCLick = (): void => {
    let tempCommentsIdArray: number[] = [];

    let url = `https://hacker-news.firebaseio.com/v0/item/${selectedNew.id}.json?print=pretty`;
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        tempCommentsIdArray = json.kids;
        updateComments(tempCommentsIdArray);
      });
  };

  const updateComments = (updatedCommentsId: number[] | undefined): void => {
    if (!updatedCommentsId) return; // детей может не быть, тогда будет не пустой массив а ничего

    updatedCommentsId.forEach((comment) => {
      if (!commentsId.includes(comment)) {
        setCommentsId((prevState) => [...prevState, comment]);
      }
    });
  };

  const navClick = () => {
    clearInterval(IntervalID.current);
  };

  const getChild = (): JSX.Element[] | null => {
    if (!commentsId) return null;

    return commentsId.map((elem: number) => {
      return <Comment id={elem} key={elem} child={null} />;
    });
  };

  return (
    <NewDiv>
      <NewHeaderDiv>
        <TitleText>{'Title: ' + selectedNew.title}</TitleText>
        <TitleText>{'Rating: ' + selectedNew.score + ', author: ' + selectedNew.by}</TitleText>
        <TitleText>{'Publication date: ' + formattedDate}</TitleText>
        <TitleText>{'Comments quantity: ' + selectedNew.descendants}</TitleText>
        <TitleText>
          {'Link: '}
          <a href={selectedNew.url}>{selectedNew.url}</a>
        </TitleText>
        <NavLink to="/" onClick={navClick}>
          <NavLinkText>Back to news list...</NavLinkText>
        </NavLink>
        <div>
          <RefreshButton onClick={refreshOnCLick}>
            <ButtonText>Refresh comments!</ButtonText>
          </RefreshButton>
        </div>
      </NewHeaderDiv>
      <Comments>{getChild()}</Comments>
    </NewDiv>
  );
};

export default NewsInfo;
