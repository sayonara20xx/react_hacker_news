import React, { useEffect, useState } from "react";
import NewsSummary from "./NewsSummary/NewsSummary";
import NewsInfo from "./NewsInfo/NewsInfo";

import classes from "./MainPage.module.css";
import { Route, Routes } from "react-router-dom";

import styled from "styled-components";

const DivWrapper = styled.div`
  width: 80%;
  margin: 0 auto;
  background-color: #E37D62;
  padding: 30px;
`;

/*
    {
    "by": "workah0lic", "descendants": 75,
    "id": 32051736, "kids": [ 32052590, 32051939, 32051997, 32052616, 32053090, 32054417, 32055455, 32053687, 32054697, 32053173, 32053530, 32053010, 32055247, 32052595, 32053207, 32052582, 32055862, 32052905, 32052337, 32052049, 32052985, 32052866, 32051998, 32052532 ],
    "score": 238,
    "time": 1657508789,
    "title": "Project Naptha",
    "type": "story",
    "url": "https://projectnaptha.com/"
    }
*/

const MainPage = (props) => {
  const url =
    "https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty";

  const [news, setNews] = useState(() => {
    return [];
  });
  const [newsIds, setNewsIds] = useState(() => {
    return [];
  });
  const [selectedNew, setSelectedNew] = useState(() => {
    return {};
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
        setNewsIds((prevState) => {
          return [];
        });
        setNews((prevState) => {
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

  const refrechButtonClick = () => {
    setNewsIds((prevState) => {
      return [];
    });
    setNews((prevState) => {
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

  const setSelectedNewCallback = (event, obj) => {
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
              <button
                onClick={refrechButtonClick}
                className={classes.refreshButton}
              >
                <p className={classes.buttonText}>Refresh!</p>
              </button>
              {/*{ //JSON.stringify(news, null, 2) }*/}
              {news.map((elem, index) => {
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
  }
};

export default MainPage;
