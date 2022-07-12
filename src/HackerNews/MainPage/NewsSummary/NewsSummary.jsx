import React from "react";
import classes from "./NewsSummary.module.css";
import {NavLink} from "react-router-dom";

const NewsSummary = (props) => {
    let formatedDate = new Date(props.data.time * 1000);

    return (
        <div className={classes.newContainer}>
            <p>{props.number + 1 + ". " + props.data.title}</p>
            <p>{"Rating: " + props.data.score + ", author: " + props.data.by}</p>
            <p>{"Publication date: " + formatedDate}</p>
            <NavLink onClick={(event) => props.select(event, props.data)} to="/info">More information...</NavLink>
        </div>
    );
};

export default NewsSummary;