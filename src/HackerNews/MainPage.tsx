import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { Response } from './Interfaces';
import NewsSummary from './NewsSummary';

const DivWrapper = styled.div`
  width: 80%;
  margin: 0 auto;
  background-color: #e37d62;
  padding: 30px;
`;

const RefreshButton = styled.button`
  width: 40%;
  height: 35px;
  margin: 0 auto 10px auto;
  border-radius: 10px;
  background-color: #e35d63;
`;

const ButtonText = styled.p`
  font-size: 20px;
`;

const NewsListHeader = styled.div`
  width: 60%;
  background-color: #fda06d;
  border-radius: 10px;
  padding: 10px;
  margin: 0 auto 20px auto;
`;

const HeaderText = styled.p`
  font-size: 30px;
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MainPage: React.FC = () => {
  const newStoriesUrl = 'https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty';
  const IntervalID: React.MutableRefObject<NodeJS.Timer | undefined> = useRef();

  const [news, setNews] = useState<Array<Response>>(() => {
    return [];
  });
  const [newsIds, setNewsIds] = useState<Number[]>(() => {
    return [];
  });

  const fetchNewsIdsByUrl = (url: string): Promise<Number[]> => {
    return fetch(url).then((response) => response.json());
  };

  useEffect(() => {
    fetchNewsIdsByUrl(newStoriesUrl).then((json) => {
      setNewsIds(() => {
        return json.slice(0, 100);
      });
    });

    IntervalID.current = setInterval(() => {
      setNewsIds(() => {
        return [];
      });
      setNews(() => {
        return [];
      });

      fetchNewsIdsByUrl(newStoriesUrl).then((json) => {
        setNewsIds(() => {
          return json.slice(0, 100);
        });
      });
    }, 60000);
  }, []);

  useEffect(() => {
    let tempArray: Response[] = [];
    newsIds.forEach((id) => {
      let detailsUrl = `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`;

      fetch(detailsUrl)
        .then((response) => response.json())
        .then((json) => {
          tempArray = [...tempArray, json];
          if (tempArray.length === 100) {
            tempArray = tempArray.sort((a, b) => a.time - b.time);
            setNews(tempArray);
          }
        });
    });
  }, [newsIds]);

  const refreshButtonClick = (): void => {
    setNewsIds(() => {
      return [];
    });
    setNews(() => {
      return [];
    });

    fetch(newStoriesUrl)
      .then((response) => response.json())
      .then((json) => {
        setNewsIds(() => {
          return json.slice(0, 100);
        });
      });
  };

  const getNewsSummaries = () => {
    if (news?.length === 0) return <p>Loading...</p>;

    return news.map((elem: Response, index) => {
      return <NewsSummary data={elem} number={index} key={elem.title} interval_id={IntervalID.current} />;
    });
  };

  return (
    <DivWrapper>
      <NewsListHeader>
        <HeaderText>Welcome to Hacker news (new!)</HeaderText>
      </NewsListHeader>

      <ButtonContainer>
        <RefreshButton onClick={refreshButtonClick}>
          <ButtonText>Refresh!</ButtonText>
        </RefreshButton>
      </ButtonContainer>

      {getNewsSummaries()}
    </DivWrapper>
  );
};

export default MainPage;
