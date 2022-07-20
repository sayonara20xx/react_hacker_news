import React, { useEffect, useState } from 'react';
import parse from 'html-react-parser';
import styled from 'styled-components';

import { CommentInfo, CommentProps } from './Interfaces';

const Comm = styled.div`
  background-color: #fda06d;
  margin-top: 20px;
  padding: 5px;
  border-radius: 5px;

  border: solid 1px black;
`;

const ShiftContainer = styled.div`
  margin-left: 50px;
  margin-top: 50px;
`;

const Nickname = styled.p`
  font-size: 20px;
`;

const Comment: React.FC<CommentProps> = (props: CommentProps) => {
  const [commentInfo, setCommentInfo] = useState<CommentInfo | null>(() => {
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
            kids: json.kids,
            by: json.by,
          };
        }),
      );
  }, [props.id]);

  const returnComments: () => JSX.Element | null = () => {
    if (!isClicked || !commentInfo?.kids || !props.id || commentInfo.kids.length === 0) {
      return null;
    }

    return (
      <ShiftContainer>
        {commentInfo?.kids.map((elem) => {
          return <Comment id={elem} key={elem} />;
        })}
      </ShiftContainer>
    );
  };

  const commClicked = () => {
    setIsClicked((prevState) => {
      return !prevState;
    });
  };

  const returnText = () => {
    if (!commentInfo?.text) {
      return 'loading...';
    }

    if (!commentInfo?.kids) {
      return parse(commentInfo.text);
    } else {
      return (
        <>
          {parse(commentInfo.text)}
          <p>Click to view replies!</p>
        </>
      );
    }
  };

  return (
    <Comm>
      <Nickname>{commentInfo?.by}</Nickname>
      <div onClick={commClicked}>{returnText()}</div>
      {returnComments()}
    </Comm>
  );
};

export default Comment;
