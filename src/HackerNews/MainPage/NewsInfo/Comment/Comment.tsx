import React, { useEffect, useState } from "react";

import styled from "styled-components";

const Comm = styled.div`
  background-color: #fda06d;
  margin-top: 20px;
`;

const ShiftContainer = styled.div`
  margin-left: 50px;
  margin-top: 50px;
`;

export interface CommProps {
  id: number;
}

export interface CommInfo {
  text: string;
  kids: Array<number>;
  by: string;
}

const Comment: (props: any) => JSX.Element = (props: CommProps) => {
  const [commInfo, setCommInfo] = useState(() => {
    return {
      text: "",
      kids: [],
      by: "",
    };
  });

  const [isClicked, setIsClicked] = useState(() => false);

  useEffect(() => {
    let url = `https://hacker-news.firebaseio.com/v0/item/${props.id}.json?print=pretty`;

    fetch(url)
      .then((response) => response.json())
      .then((json) =>
        setCommInfo(() => {
          return {
            text: json.text,
            kids: json.kids,
            by: json.by,
          };
        })
      );
  }, [props.id]);

  const returnComms: () => JSX.Element | null = () => {
    if (isClicked && commInfo.kids && props.id && commInfo.kids.length > 0)
      return (
        <ShiftContainer>
          {commInfo.kids.map((elem) => {
            return <Comment id={elem} />;
          })}
        </ShiftContainer>
      );
    else return null;
  };

  const commClicked = () => {
    setIsClicked((prevState) => {
      return !prevState;
    });
  };

  const returnText = () => {
    if (!commInfo.text) {
      return "loading...";
    }

    if (!commInfo.kids) {
      return commInfo.text;
    } else {
      return commInfo.text + ". Click on text to watch reply(es).";
    }
  };

  return (
    <Comm>
      <p>{commInfo.by}</p>
      <p onClick={commClicked}>{returnText()}</p>
      {returnComms()}
    </Comm>
  );
};

export default Comment;
