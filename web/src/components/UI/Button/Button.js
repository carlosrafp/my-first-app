import React from 'react';
import './Button.css';

const UIButton = ({
  children,
  className,
  component: Component,
  theme,
  ...restProps
}) => {
  return (
    <Component
      {...restProps}
      className={`ui-button ui-button--${theme} ${className}`}
    >
      {children}
    </Component>
  );
};

UIButton.defaultProps = {
  component: 'a',
  className: '',
  theme: 'bordered-blue',
};
export default UIButton;
