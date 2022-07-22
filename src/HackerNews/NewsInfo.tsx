import React, { useContext, useEffect, useState, useRef } from 'react';

import Comment from './Comment';

import { NewsContext } from './SelectedNewStore';
import { Button, Card, Stack } from 'react-bootstrap';

import { StyledNavLink } from './NewsSummary';

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

    IntervalID.current = setInterval(() => {
      refreshOnCLick();
    }, 60000);
  }, []);

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
    if (!updatedCommentsId) return;

    updatedCommentsId.forEach((comment) => {
      if (!commentsId.includes(comment)) {
        setCommentsId((prevState) => [...prevState, comment]);
      }
    });
  };

  const navClick = (): void => {
    clearInterval(IntervalID.current);
  };

  const renderRootComments = (): JSX.Element[] | null => {
    if (!commentsId) return null;

    return commentsId.map((elem: number) => {
      return <Comment id={elem} key={elem} child={null} />;
    });
  };

  return (
    <Stack className="col-md-6 mt-4 mb-4 mx-auto">
      <Card bg="info">
        <Card.Body>
          <Card.Title>{`Title: ${selectedNew.title}`}</Card.Title>
          <Card.Subtitle>{`Rating: ${selectedNew.score}, author: ' ${selectedNew.by}`}</Card.Subtitle>
          <Card.Text>{`Publication date: ${formattedDate}`}</Card.Text>
          <Card.Text>{`Comments quantity: ${selectedNew.descendants}`}</Card.Text>
          <Card.Text>
            {'Link: '}
            <a href={selectedNew.url}>{selectedNew.url}</a>
          </Card.Text>
          <Button>
            <StyledNavLink to="/" onClick={navClick}>
              Back to news list...
            </StyledNavLink>
          </Button>
          <div>
            <Button className="mt-1" onClick={refreshOnCLick}>
              Refresh comments!
            </Button>
          </div>
        </Card.Body>
      </Card>

      <div className="mt-2">{renderRootComments()}</div>
    </Stack>
  );
};

export default NewsInfo;
