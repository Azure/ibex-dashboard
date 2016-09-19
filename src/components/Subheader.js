import React from 'react';

const Subheader = (props, context) => {
  const {
    children,
    inset,
    style,
    ...other,
  } = props;

  const styles = {
    root: {
      boxSizing: 'border-box',
      fontSize: 14,
      lineHeight: '48px',
      paddingLeft: inset ? 72 : 16,
      width: '100%',
    },
  };

  return (
    <div {...other} style={Object.assign({}, styles.root, style)}>
      {children}
    </div>
  );
};

export default Subheader;