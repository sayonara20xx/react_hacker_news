import React, {useEffect, useState} from "react";

import classes from "./Comment.module.css";

const Comment = (props) => {
  const [commInfo, setCommInfo] = useState(() => {
    return {
      text: "",
      kids: [],
      by: "",
    };
  })

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
  }, []);

  const returnComms = () => {
    if (isClicked && commInfo.kids && props.id && commInfo.kids.length > 0)
      return (
        <div className={classes.shiftContainer}>
          {commInfo.kids.map((elem) => {
            return <Comment id={elem}/>
          })}
        </div>
      );
    else
      return null;
  };

  const commClicked = () => {
    setIsClicked((prevState) => {
      return !prevState;
    })
  }

  const returnText = () => {
    if (!commInfo.text) {
      return "loading...";
    }

    if (!commInfo.kids) {
      return commInfo.text;
    } else {
      return commInfo.text + ". Click on text to watch reply(es)."
    }
  }

  return (
    <div className={classes.comm}>
      <p>{commInfo.by}</p>
      <p onClick={commClicked}>{returnText()}</p>
      {returnComms()}
    </div>
  );
};

export default Comment;