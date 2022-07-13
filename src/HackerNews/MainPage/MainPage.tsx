import React, { useEffect, useState } from "react";
import NewsSummary from "./NewsSummary/NewsSummary";
import NewsInfo from "./NewsInfo/NewsInfo";

import { Route, Routes } from "react-router-dom";

import styled from "styled-components";

export interface response {
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

const MainPage: () => JSX.Element | null = () => {
  const url =
    "https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty";
  const url_new =
    "https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty";

  const [news, setNews] = useState<Array<response>>(() => {
    return [];
  });
  const [newsIds, setNewsIds] = useState(() => {
    return [];
  });
  const [selectedNew, setSelectedNew] = useState<response>(() => {
    return {
      by: "",
      id: -1,
      descendants: -1,
      kids: [],
      time: -1,
      title: "",
      type: "",
      url: "",
      score: -1,
    };
  });

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      // Костыль: у веб апи нельзя определить кол-во постов, получаем 500, выкидываю 400
      .then((json) => {
        setNewsIds(() => {
          return json.slice(0, 100);
        });
      });

    setInterval(() => {
      if (window.location.pathname === "/") {
        setNewsIds(() => {
          return [];
        });
        setNews(() => {
          return [];
        });
        fetch(url)
          .then((response) => response.json())
          // Костыль: у веб апи нельзя определить кол-во постов, получаем 500, выкидываю 400
          .then((json) => {
            setNewsIds(() => {
              return json.slice(0, 100);
            });
          });
      }
    }, 60000);
  }, []);

  useEffect(() => {
    newsIds.forEach((id) => {
      let detailsUrl = `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`;
      fetch(detailsUrl)
        .then((response) => response.json())
        .then((json) => {
          setNews((prevState) => {
            return [...prevState, json];
          });
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

    fetch(url)
      .then((response) => response.json())
      // Костыль: у веб апи нельзя определить кол-во постов, получаем 500, выкидываю 400
      .then((json) => {
        setNewsIds(() => {
          return json.slice(0, 100);
        });
      });
  };

  const setSelectedNewCallback = (
    event: React.MouseEvent<HTMLAnchorElement>,
    obj: response
  ): void => {
    setSelectedNew(() => {
      return obj;
    });
  };

  if (newsIds.length > 0) {
    return (
      <Routes>
        <Route
          path="/"
          element={
            <DivWrapper>
              <NewsListHeader>
                <HeaderText>Welcome to Hacker news (new!)</HeaderText>
              </NewsListHeader>

              <ButtonContainer>
                <RefreshButton onClick={refreshButtonClick}>
                  <ButtonText>Refresh!</ButtonText>
                </RefreshButton>
              </ButtonContainer>

              {news.map((elem: response, index) => {
                return (
                  <NewsSummary
                    data={elem}
                    number={index}
                    select={setSelectedNewCallback}
                  ></NewsSummary>
                );
              })}
            </DivWrapper>
          }
        />
        <Route path="/info" element={<NewsInfo data={selectedNew} />} />
      </Routes>
    );
  } else {
    return null;
  }
};

export default MainPage;
