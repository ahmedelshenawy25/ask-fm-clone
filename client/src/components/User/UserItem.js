import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

const UserItem = ({
  username, fullName
}) => (
  <div className="item red">
    <i className="large user icon" />
    <div className="content">
      <NavLink to={`/user/${username}`}>
        <div className="userInfo fullname">{fullName}</div>
        <div className="userInfo">{`@${username}`}</div>
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
