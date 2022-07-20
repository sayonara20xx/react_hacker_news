import React, { useContext, useEffect, useState } from 'react';
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

  let formattedDate: Date = new Date(selectedNew.time * 1000);

  let [child, setChild] = useState<Array<number>>(() => {
    return [];
  });

  useEffect(() => {
    setChild(() => {
      return selectedNew.kids;
    });
  }, [selectedNew.kids]);

  useEffect(() => {
    setInterval(() => {
      if (window.location.pathname === '/info') {
        setChild(() => {
          return [];
        });

        let url = `https://hacker-news.firebaseio.com/v0/item/${selectedNew.id}.json?print=pretty`;
        fetch(url)
          .then((response) => response.json())
          .then((json) => {
            setChild(() => {
              return json.kids;
            });
          });
      }
    }, 60000);
  }, [selectedNew.id]);

  const refreshOnCLick = (): void => {
    setChild(() => {
      return [];
    });

    let url = `https://hacker-news.firebaseio.com/v0/item/${selectedNew.id}.json?print=pretty`;
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        setChild(() => {
          return json.kids;
        });
      });
  };

  const getChild = (): JSX.Element[] | null => {
    if (!child) return null;

    return child.map((elem: number) => {
      return <Comment id={elem} key={elem} />;
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
        <NavLink to="/">
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
