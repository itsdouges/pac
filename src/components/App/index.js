// @flow

import React from 'react';
import Map from '../Map';
import styles from './styles.css';
import { getDroneMap } from '../../lib/maps';

const App = () => (
  <div className={styles.root}>
    <Map cells={getDroneMap()} />
  </div>
);

export default App;
