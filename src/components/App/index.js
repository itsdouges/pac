// @flow

import React, { Component } from 'react';
import Map from '../Map';
import styles from './styles.css';
import { getDroneMap } from '../../lib/maps';

export default class App extends Component {
  render() {
    return (
      <div className={styles.root}>
        <Map cells={getDroneMap()} />
      </div>
    );
  }
}
