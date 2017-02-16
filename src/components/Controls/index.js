// @flow

import React from 'react';

type Props = {
  className?: string,
  onIncrease: () => void,
  onDecrease: () => void,
  children?: any,
};

const MapControls = ({ className, onIncrease, onDecrease, children }: Props) => (
  <div className={className}>
    {children}
    <button onClick={onDecrease}>-</button>
    <button onClick={onIncrease}>+</button>
  </div>
);

export default MapControls;
