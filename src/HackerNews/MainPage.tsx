import React, { useEffect, useRef, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { NewsDataResponse } from './Interfaces';
import NewsSummary from './NewsSummary';
import { Button, Card } from 'react-bootstrap';

const MainPage: React.FC = () => {
  const newStoriesUrl = 'https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty';
  const IntervalID: React.MutableRefObject<NodeJS.Timer | undefined> = useRef();

  const [news, setNews] = useState<Array<NewsDataResponse>>(() => {
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
      refreshButtonClick();
    }, 60000);
  }, []);

  useEffect(() => {
    let tempArray: NewsDataResponse[] = [];
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

  const clearNews = () => {
    setNewsIds(() => {
      return [];
    });
    setNews(() => {
      return [];
    });
  };

  const refreshButtonClick = (): void => {
    fetch(newStoriesUrl)
      .then((response) => response.json())
      .then((json) => {
        clearNews();
        setNewsIds(() => {
          return json.slice(0, 100);
        });
      });
  };

  const getNewsSummaries = (): JSX.Element[] | JSX.Element => {
    if (news?.length === 0) return <p>Loading...</p>;

    return news.map((elem: NewsDataResponse, index) => {
      return (
        <Col key={elem.id}>
          <NewsSummary data={elem} number={index} interval_id={IntervalID.current} />
        </Col>
      );
    });
  };

  return (
    <Container>
      <Row className={'justify-content-md-center mt-3'}>
        <Col>
          <Card>
            <Card.Body>
              <p>Welcome to Hacker news (new!)</p>
              <Button variant="primary" onClick={refreshButtonClick}>
                Refresh!
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row xs={1} md={3} className="gy-5 gx-6 mt-1 mb-3">
        {getNewsSummaries()}
      </Row>
    </Container>
  );
};

export default MainPage;
