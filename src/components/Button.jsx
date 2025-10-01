import React from 'react';
import {Link} from 'react-router-dom';
import "../css/Button.css"

const Button = ({ text, to }) => {
  return ( 
    <Link to={to} className="custom-button">
      {text}
      </Link>

);
};

export default Button;
