// @flow

import React from 'react';
import cx from 'classnames';

import styles from './styles.css';
import logo from '../../assets/images/logo.png';

type Props = {
  className?: string,
  onIncrease: () => void,
  onDecrease: () => void,
  zoomText: string,
};

const MapControls = ({ className, onIncrease, onDecrease, zoomText }: Props) => (
  <div className={cx(styles.root, className)}>
    <img src={logo} alt="Propeller Aero" className={styles.logo} />
    <span>{zoomText}</span>
    <button className={styles.button} onClick={onDecrease}>-</button>
    <button className={styles.button} onClick={onIncrease}>+</button>
  </div>
);

export default MapControls;
