import React from 'react';
import { NavLink } from 'react-router-dom';
import Follow from '../Follow/Follow';

const SearchItem = ({
  username, fullName, isFollowed, renderButtons
}) => (
  <div className="item red">
    <i className="large user icon" />
    <div className="content">
      <NavLink to={`/user/${username}`}>
        <div className="userInfo fullname">{fullName}</div>
        {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
        <div className="userInfo">@{username}</div>
        <div className="ui right floated button ask">Ask</div>
      </NavLink>
      {renderButtons && <Follow username={username} isFollowed={isFollowed} />}
    </div>
    <br />
  </div>
);

export default SearchItem;
