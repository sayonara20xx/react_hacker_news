import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import classes from "./NewsInfo.module.css";
import Comment from "./Comment/Comment";

const NewsInfo = (props) => {
  let formatedDate = new Date(props.data.time * 1000);

  let [childs, setChilds] = useState(() => {
    return [];
  });

  useEffect(() => {
    setChilds(() => {
      return props.data.kids;
    });
  }, [props.data.kids]);

  useEffect(() => {
    setInterval(() => {
      if (window.location.pathname === "/info") {
        setChilds(() => {
          return [];
        });

        let url = `https://hacker-news.firebaseio.com/v0/item/${props.data.id}.json?print=pretty`;
        fetch(url)
          .then((response) => response.json())
          .then((json) => {
            setChilds(() => {
              return json.kids;
            });
          });
      }
    }, 60000);
  }, []);

  const refreshOnCLick = () => {
    setChilds(() => {
      return [];
    });

    let url = `https://hacker-news.firebaseio.com/v0/item/${props.data.id}.json?print=pretty`;
    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        setChilds(() => {
          return json.kids;
        });
      });
  };

  return (
    <div className={classes.newdiv}>
      <p>{"Title: " + props.data.title}</p>
      <p>{"Rating: " + props.data.score + ", author: " + props.data.by}</p>
      <p>{"Publication date: " + formatedDate}</p>
      <p>{"Descendants: " + props.data.descendants}</p>
      <p>
        {"Link: "}
        <a href={props.data.url}>{props.data.url}</a>
      </p>
      <NavLink to="/">
        <p className={classes.navLinkText}>Back</p>
      </NavLink>
      <div>
        <button onClick={refreshOnCLick} className={classes.refreshButton}>
          <p>Refresh comments!</p>
        </button>
      </div>
      <div className={classes.comms}>
        {childs.map((elem) => {
          return <Comment id={elem} />;
        })}
      </div>
    </div>
  );
};

export default NewsInfo;
