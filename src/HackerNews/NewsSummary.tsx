import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import Card from 'react-bootstrap/Card';

import { NewsSummaryProps } from './Interfaces';
import { NewsContext } from './SelectedNewStore';
import { Button } from 'react-bootstrap';
import styled from 'styled-components';

export const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  color: white;
  &:hover {
    color: white;
  }
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
      <Card bg={'success'}>
        <Card.Body>
          <Card.Title>{`${props.number + 1}. ${props.data.title}`}</Card.Title>
          <Card.Subtitle>{`Rating: ${props.data.score}, author: ${props.data.by}`}</Card.Subtitle>
          <Card.Text>{`Publication date: ${formattedDate}`}</Card.Text>
          <Button variant="danger">
            <StyledNavLink onClick={navClick} to="/info">
              More information...
            </StyledNavLink>
          </Button>
        </Card.Body>
      </Card>
    );
  };

  return <>{renderSummary()}</>;
};

export default NewsSummary;
