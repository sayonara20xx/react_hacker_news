import React, { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import styled from 'styled-components';

import { CommentInfo, CommentProps } from './Interfaces';
import { Card } from 'react-bootstrap';

const HighlightedP = styled.p`
  text-decoration: underline;
`;

const Comment: React.FC<CommentProps> = (props: CommentProps) => {
  const [commentInfo, setCommentInfo] = useState<CommentInfo | null>(() => {
    return null;
  });

  const [commentKids, setCommentKids] = useState<number[] | null>(() => {
    return null;
  });

  const [isClicked, setIsClicked] = useState(() => false);

  useEffect(() => {
    let url = `https://hacker-news.firebaseio.com/v0/item/${props.id}.json?print=pretty`;

    fetch(url)
      .then((response) => response.json())
      .then((json) =>
        setCommentInfo(() => {
          return {
            text: json.text,
            by: json.by,
          };
        }),
      );
  }, [props.id]);

  useEffect(() => {
    let url = `https://hacker-news.firebaseio.com/v0/item/${props.id}.json?print=pretty`;

    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        setCommentKids(() => {
          return json.kids;
        });
      });
  }, [props.id]);

  const renderComments: () => JSX.Element | null = () => {
    if (!isClicked || !commentKids || !props.id || commentKids.length === 0) {
      return null;
    }

    return (
      <div className="mt-1">
        {commentKids.map((elem) => {
          return <Comment id={elem} key={elem} child={null} />;
        })}
      </div>
    );
  };

  const commClicked = () => {
    setIsClicked((prevState) => {
      return !prevState;
    });
  };

  const returnText = () => {
    if (!commentInfo?.text) {
      return null;
    }

    if (!commentKids) {
      return <>{parse(commentInfo.text)}</>;
    }

    let viewOrHideText = !isClicked ? 'view' : 'hide';
    return (
      <>
        {parse(commentInfo.text)}
        <HighlightedP>{`Click to ${viewOrHideText} replies!`}</HighlightedP>
      </>
    );
  };

  return (
    <Card className="mt-4">
      <Card.Body>
        <Card.Title>{commentInfo?.by}</Card.Title>
        <Card.Text onClick={commClicked}>{returnText()}</Card.Text>
        {renderComments()}
      </Card.Body>
    </Card>
  );
};

export default Comment;
