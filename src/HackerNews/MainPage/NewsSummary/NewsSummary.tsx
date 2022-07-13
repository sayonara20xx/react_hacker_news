import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { response } from "../MainPage";

const DivContainer = styled.div`
  width: 80%;
  background-color: #fda06d;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 10px;
`;

export interface props {
  data: {
    by: string;
    id: number;
    descendants: number;
    kids: Array<number>;
    score: number;
    time: number;
    title: string;
    type: string;
    url: string;
  };

  number: number;
  select: (event: React.MouseEvent<HTMLAnchorElement>, obj: response) => void;
}

const NewsSummary: (arg0: props) => JSX.Element = (props) => {
  let formattedDate: Date = new Date(props.data.time * 1000);

  return (
    <DivContainer>
      <p>{props.number + 1 + ". " + props.data.title}</p>
      <p>{"Rating: " + props.data.score + ", author: " + props.data.by}</p>
      <p>{"Publication date: " + formattedDate}</p>
      <NavLink onClick={(event) => props.select(event, props.data)} to="/info">
        More information...
      </NavLink>
    </DivContainer>
  );
};

export default NewsSummary;
