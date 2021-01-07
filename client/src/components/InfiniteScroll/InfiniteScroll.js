import React from 'react';
import PropTypes from 'prop-types';

const InfiniteScroll = React.forwardRef(({ isLastElement, children }, ref) => {
  if (isLastElement) return <div ref={ref}>{children}</div>;

  return <div>{children}</div>;
});

InfiniteScroll.propTypes = {
  isLastElement: PropTypes.bool.isRequired,
  children: PropTypes.element.isRequired
};

export default InfiniteScroll;
