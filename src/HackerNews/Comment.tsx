import React, { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import styled from 'styled-components';

import { CommentInfo, CommentProps } from './Interfaces';
import { Card } from 'react-bootstrap';

const HighlightedP = styled.span`
  text-decoration: underline;
`;

const Comment: React.FC<CommentProps> = (props: CommentProps) => {
  const [commentInfo, setCommentInfo] = useState<CommentInfo | null>(null);

  const [isClicked, setIsClicked] = useState(() => false);

  useEffect(() => {
    let url = `https://hacker-news.firebaseio.com/v0/item/${props.id}.json?print=pretty`;

    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        setCommentInfo({
            text: json.text,
            by: json.by,
            kids: json.kids,
            isDeleted: json.deleted,
            isDead: json.dead,
          });
      });
  }, [props.id]);

  const renderKidsComments: () => JSX.Element | null = () => {
    if (!isClicked || !commentInfo?.kids || !props.id || commentInfo?.kids.length === 0) {
      return null;
    }

    return (
      <div className="mt-1">
        {commentInfo?.kids.map((elem) => {
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

    if (!commentInfo?.kids) {
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

  const returnNotDeleted: () => JSX.Element | null = () => {
    if (commentInfo?.isDeleted || commentInfo?.isDead) return null;

    return (
      <Card className="mt-4">
        <Card.Body>
          <Card.Title>{commentInfo?.by}</Card.Title>
          <span onClick={commClicked}>{returnText()}</span>
          {renderKidsComments()}
        </Card.Body>
      </Card>
    );
  };

  return <>{returnNotDeleted()}</>;
};

export default Comment;
