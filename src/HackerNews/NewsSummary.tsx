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

  let dateFormatOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };
  let formattedDate: string = new Date(props.data.time * 1000).toLocaleDateString('en-US', dateFormatOptions);

  const navClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    store?.setSelectedNewCallback(event, props.data);
    clearInterval(props.interval_id);
  };

  const renderSummary = () => {
    return (
      <DivContainer>
        <p>{props.number + 1 + '. ' + props.data.title}</p>
        <p>{'Rating: ' + props.data.score + ', author: ' + props.data.by}</p>
        <p>{'Publication date: ' + formattedDate}</p>
        <NavLink onClick={navClick} to="/info">
          More information...
        </NavLink>
      </DivContainer>
    );
  };

  return <>{renderSummary()}</>;
};

export default NewsSummary;
