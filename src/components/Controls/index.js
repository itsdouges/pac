// @flow

import React from 'react';

type Props = {
  className?: string,
  onIncrease: () => void,
  onDecrease: () => void,
  level: number,
};

const MapControls = ({ className, level, onIncrease, onDecrease }: Props) => (
  <div className={className}>
    {level}
    <button onClick={onDecrease}>-</button>
    <button onClick={onIncrease}>+</button>
  </div>
);

export default MapControls;
