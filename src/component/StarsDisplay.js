import React from 'react';
import utils from '../math-util'

const StarsDisplay =(props) =>(
    <>
         {utils.range(1, props.count).map(starId => (
      <div key={starId} className="star" />
    ))}
    </>
);

export default StarsDisplay;