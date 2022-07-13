import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import Comment from "./Comment/Comment";
import styled from "styled-components";

const NewDiv = styled.div`
  width: 80%;
  margin: 0 auto;
  background-color: bisque;
  padding: 20px;
`;

const Comms = styled.div`
  background-color: cadetblue;
  margin-top: 20px;
`;

const NavLinkText = styled.p`
  font-size: 20px;
`;

const RefreshButton = styled.button`
  margin: 20px 0;
  width: 50%;
  height: 50px;
  background-color: #e35d63;
  border-radius: 20px;
`;

const ButtonText = styled.p`
  font-size: 20px;
`;

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
    <NewDiv>
      <p>{"Title: " + props.data.title}</p>
      <p>{"Rating: " + props.data.score + ", author: " + props.data.by}</p>
      <p>{"Publication date: " + formatedDate}</p>
      <p>{"Descendants: " + props.data.descendants}</p>
      <p>
        {"Link: "}
        <a href={props.data.url}>{props.data.url}</a>
      </p>
      <NavLink to="/">
        <NavLinkText>Back</NavLinkText>
      </NavLink>
      <div>
        <RefreshButton onClick={refreshOnCLick}>
          <ButtonText>Refresh comments!</ButtonText>
        </RefreshButton>
      </div>
      <Comms>
        {childs.map((elem) => {
          return <Comment id={elem} />;
        })}
      </Comms>
    </NewDiv>
  );
};

export default NewsInfo;
