import React from 'react';

const Button = ({ text, onClick, type = 'button', className = '' }) => (
  <button type={type} className={`custom-button ${className}`} onClick={onClick}>
    {text}
  </button>
);

export default Button;
