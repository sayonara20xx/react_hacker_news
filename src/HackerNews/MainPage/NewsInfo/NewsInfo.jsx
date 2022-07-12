import React from "react";
import {NavLink} from "react-router-dom";

const NewsInfo = (props) => {
  let formatedDate = new Date(props.data.time * 1000);

  return(
    <div>
      <p>{"Title: " + props.data.title}</p>
      <p>{"Rating: " + props.data.score + ", author: " + props.data.by}</p>
      <p>{"Publication date: " + formatedDate}</p>
      <p>{"Descendants: " + props.data.descendants}</p>
      <p>{"Link: "}<a href={props.data.url}>{props.data.url}</a></p>
      <NavLink to="/">Back</NavLink>
    </div>
  )
}

export default NewsInfo;