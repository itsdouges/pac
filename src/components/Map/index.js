// @flow

import type { Cells } from '../../lib/cellify';

import React, { Component } from 'react';
import throttle from 'lodash/throttle';
import cx from 'classnames';

import styles from './styles.css';
import Controls from '../Controls';
import Cell from '../Cell';
import { attachWheelEvent, attachPanEvent } from '../../lib/dom';
import { roundOne } from '../../lib/math';

type Props = {
  cells: Cells,
};

type State = {
  zoom: number,
  level: number,
  x: number,
  y: number,
  grabbing: boolean,
};

function humanifyZoom (zoom, offset) {
  const roundedZoom = roundOne(zoom);
  const normalizedZoom = roundedZoom % 1 === 0 ? `${roundedZoom}.0` : roundedZoom;
  return `${normalizedZoom}x`;
}

export default class Map extends Component {
  _detatchWheelEvent: () => void;
  _detatchPanEvent: () => void;
  _container: HTMLElement;
  deltaOffsetX: number = 0;
  deltaOffsetY: number = 0;
	props: Props;
  state: State = {
    x: 0,
    y: 0,
    zoom: 1,
    level: 0,
    grabbing: false,
  };

  componentDidMount () {
    this._detatchWheelEvent = attachWheelEvent(window, throttle(this.zoom, 16));
    this._detatchPanEvent = attachPanEvent(this._container, this.pan, this.panEnd);
  }

  componentWillUnmount () {
    this._detatchWheelEvent();
    this._detatchPanEvent();
  }

  panEnd = (e: any) => {
    this.deltaOffsetX = this.state.x;
    this.deltaOffsetY = this.state.y;

    this.setState({
      grabbing: false,
    });
  };

  pan = (e: any) => {
    const { deltaX, deltaY } = e;

    this.setState({
      grabbing: true,
      x: this.deltaOffsetX + deltaX,
      y: this.deltaOffsetY + deltaY,
    });
  };

  zoom = (e: WheelEvent) => {
    const { zoom, level } = this.state;
    const maxLevel = 3;

    let newZoom = zoom + (e.deltaY / 500);

    if (newZoom >= 2 && level < maxLevel) {
      this.increaseLevel();
      newZoom = 1;
    } else if (level > 0 && newZoom < 1) {
      this.decreaseLevel();
      newZoom = 2;
    } else if (newZoom < 0.5) {
      newZoom = 0.5;
    }

    return this.setState({
      zoom: newZoom,
    });
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
    const { level, zoom, x, y, grabbing } = this.state;
    const { cells } = this.props;
    const layerCells = cells[level];

    const mapStyles = {
      transform: `translate3d(${x}px, ${y}px, 0) scale(${zoom})`,
    };

    return (
      <div className={cx(styles.root, { [styles.grabbing]: grabbing })} ref={(c) => (this._container = c)}>
        <Controls
          className={styles.controls}
          onIncrease={this.increaseLevel}
          onDecrease={this.decreaseLevel}
        >
          {humanifyZoom(zoom + level)}
        </Controls>

        <div className={styles.map} style={mapStyles}>
          {layerCells.map((column, index) => (
            <div className={styles.column} key={index}>
              {column.map((row) => <Cell data={row} key={row.src} />)}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
