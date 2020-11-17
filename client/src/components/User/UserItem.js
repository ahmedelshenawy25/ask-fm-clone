import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

const UserItem = ({
  username, fullName
}) => (
  <div>
    <div>
      user icon
    </div>
    <div>
      <NavLink to={`/user/${username}`}>
        <div>{fullName}</div>
        <div>{`@${username}`}</div>
      </NavLink>
    </div>
    <br />
  </div>
);

UserItem.propTypes = {
  username: PropTypes.string.isRequired,
  fullName: PropTypes.string.isRequired
};

export default UserItem;
