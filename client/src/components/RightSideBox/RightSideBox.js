import './RightSideBox.css';
import React from 'react';

import Friends from '../Friends/Friends';
import Discover from '../Discover/Discover';


const RightSideBox = () => (
  <div className="rightFlexChild">
    <div className="sideBox">
      <span className="header">Friends</span>
      <Friends />
    </div>
    <br />
    <div className="sideBox">
      <span className="header">Discover</span>
      <Discover />
    </div>
  </div>
);

export default RightSideBox;
