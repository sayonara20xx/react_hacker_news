import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import { NewsSummaryProps } from './Interfaces';
import { NewsContext } from './SelectedNewStore';

const DivContainer = styled.div`
  width: 80%;
  background-color: #fda06d;
  border-radius: 10px;
  padding: 10px;
  margin: 0 auto 10px auto;
`;

const NewsSummary: React.FC<NewsSummaryProps> = (props: NewsSummaryProps) => {
  let store = useContext(NewsContext);

  let formattedDate: Date = new Date(props.data.time * 1000);

  return (
    <DivContainer>
      <p>{props.number + 1 + '. ' + props.data.title}</p>
      <p>{'Rating: ' + props.data.score + ', author: ' + props.data.by}</p>
      <p>{'Publication date: ' + formattedDate}</p>
      <NavLink onClick={(event) => store?.setSelectedNewCallback(event, props.data)} to="/info">
        More information...
      </NavLink>
    </DivContainer>
  );
};

export default NewsSummary;
