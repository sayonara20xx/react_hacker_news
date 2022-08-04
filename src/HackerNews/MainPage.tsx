import React, { useEffect, useRef, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { NewsDataResponse } from './Interfaces';
import NewsSummary from './NewsSummary';
import { Button, Card } from 'react-bootstrap';

const MainPage: React.FC = () => {
  const newStoriesUrl = 'https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty';
  const intervalID: React.MutableRefObject<NodeJS.Timer | undefined> = useRef();

  const [news, setNews] = useState<NewsDataResponse[]>([]);

  const fetchNewsIdsByUrl = (url: string): Promise<Number[]> => {
    return fetch(url).then((response) => response.json());
  };

  useEffect(() => {
    updateNews();
    intervalID.current = setInterval(() => {
      refreshButtonClick();
    }, 60000);

    return () => clearInterval(intervalID.current);
  }, []);

  const updateNews: () => void = () => {
    let newsIds: Number[] = [];

    fetchNewsIdsByUrl(newStoriesUrl)
      .then((json) => {
        newsIds = json.slice(0, 100);
        return new Promise<Number[]>((resolve) => {
          resolve(newsIds);
        });
      })
      .then((newsIds) => {
        let newsPromises = newsIds.map((id) => {
          let detailsUrl = `https://hacker-news.firebaseio.com/v0/item/${id}.json?print=pretty`;
          return fetch(detailsUrl).then((response) => response.json());
        });

        return new Promise<Promise<NewsDataResponse>[]>((resolve) => resolve(newsPromises));
      })
      .then((newsPromises) => {
        Promise.all(newsPromises).then((jsons) => {
          setNews(jsons);
        });
      });
  };

  const clearNews = () => {
    setNews(() => {
      return [];
    });
  };

  const refreshButtonClick = (): void => {
    clearNews();
    updateNews();
  };

  const getNewsSummaries = (): JSX.Element[] | JSX.Element => {
    if (news?.length === 0) return <p>Loading...</p>;

    return news.map((elem: NewsDataResponse, index) => {
      return (
        <Col key={elem.id}>
          <NewsSummary data={elem} number={index} interval_id={intervalID.current} />
        </Col>
      );
    });
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-3">
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
