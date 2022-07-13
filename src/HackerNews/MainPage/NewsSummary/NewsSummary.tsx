import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const DivContainer = styled.div`
  width: 80%;
  background-color: #fda06d;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 10px;
`;

const NewsSummary = (props) => {
  let formatedDate = new Date(props.data.time * 1000);

  return (
    <DivContainer>
      <p>{props.number + 1 + ". " + props.data.title}</p>
      <p>{"Rating: " + props.data.score + ", author: " + props.data.by}</p>
      <p>{"Publication date: " + formatedDate}</p>
      <NavLink onClick={(event) => props.select(event, props.data)} to="/info">
        More information...
      </NavLink>
    </DivContainer>
  );
};

export default NewsSummary;
