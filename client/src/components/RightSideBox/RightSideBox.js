import React from 'react';
import Friends from '../Friends/Friends';
import Discover from '../Discover/Discover';


const RightSideBox = () => (
  <div>
    <div>
      <span>Friends</span>
      <Friends />
    </div>
    <br />
    <div>
      <span>Discover</span>
      <Discover />
    </div>
  </div>
);

export default RightSideBox;
