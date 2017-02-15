// @flow

import type { Cells } from '../../lib/cellify';

import React, { Component } from 'react';
import styles from './styles.css';
import Controls from '../Controls';
import Cell from '../Cell';

type Props = {
  cells: Cells,
};

type State = {
  zoom: number,
  level: number,
};

export default class Map extends Component {
	props: Props;
  state: State = {
    zoom: 1,
    level: 0,
  };

  increaseLevel = () => {
    const nextLevel = this.state.level + 1;
    this.setLevel(nextLevel);
  };

  decreaseLevel = () => {
    const nextLevel = this.state.level - 1;
    this.setLevel(nextLevel);
  };

  setLevel (nextLevel: number) {
    if (this.props.cells[nextLevel]) {
      this.setState({
        level: nextLevel,
      });
    }
  }

  render () {
    const { level } = this.state;
    const { cells } = this.props;

    const levelData = cells[level];
    console.log(levelData);

    return (
      <div className={styles.root}>
        <Controls
          className={styles.controls}
          level={level}
          onIncrease={this.increaseLevel}
          onDecrease={this.decreaseLevel}
        />

        <div className={styles.map}>
          {levelData.map((column, index) => {
            return (
              <div className={styles.column} key={index}>
                {column.map((row) => <Cell data={row} key={row.src} />)}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
