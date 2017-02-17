// @flow

import type { Cells } from '../../lib/cellify';

import React, { Component } from 'react';
import cx from 'classnames';

import styles from './styles.css';
import Controls from '../Controls';
import Cell from '../Cell';
import { attachWheelEvent, attachPanEvents, styleTransform } from '../../lib/dom';
import { roundToOne } from '../../lib/math';

type Props = {
  cells: Cells,
};

type State = {
  zoom: number,
  level: number,
  x: number,
  y: number,
  panning: boolean,
  calculateCellsInViewport: boolean,
};

const ZOOM_DIVISOR = 500;

const humanifyZoom = (zoom, offset) => {
  const roundedZoom = roundToOne(zoom);
  const normalizedZoom = roundedZoom % 1 === 0 ? `${roundedZoom}.0` : roundedZoom;
  return `${normalizedZoom}x`;
};

export default class Map extends Component {
  _detatchWheelEvent: () => void;
  _detatchPanEvents: () => void;
  _container: HTMLElement;

  deltaOffsetX: number = 0;
  deltaOffsetY: number = 0;
	props: Props;
  state: State = {
    x: 0,
    y: 0,
    zoom: 1,
    level: 0,
    panning: false,
    calculateCellsInViewport: true,
  };

  componentDidMount () {
    this._detatchWheelEvent = attachWheelEvent(window, this.onWheel);
    this._detatchPanEvents = attachPanEvents(this._container, this.onPan, this.onPanEnd);
  }

  componentWillUnmount () {
    this._detatchWheelEvent();
    this._detatchPanEvents();
  }

  onPanEnd = (e: any) => {
    this.deltaOffsetX = this.state.x;
    this.deltaOffsetY = this.state.y;

    this.setState({
      panning: false,
      calculateCellsInViewport: true,
    });
  };

  onPan = (e: any) => {
    const { deltaX, deltaY } = e;

    this.setState({
      panning: true,
      calculateCellsInViewport: false,
      x: this.deltaOffsetX + deltaX,
      y: this.deltaOffsetY + deltaY,
    });
  };

  onWheel = (e: WheelEvent) => {
    const { zoom, level } = this.state;
    const { cells } = this.props;

    // $FlowFixMe - Spreading the array is valid syntax !
    const levelCap = Math.max(...Object.keys(cells));

    let newZoom = zoom + (e.deltaY / ZOOM_DIVISOR);
    if (newZoom >= 2 && level < levelCap) {
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
    const { level, zoom, x, y, panning, calculateCellsInViewport } = this.state;
    const { cells } = this.props;
    const layerCells = cells[level];

    const mapStyles = styleTransform({
      name: 'translate3d',
      options: [`${x}px`, `${y}px`, 0],
    }, {
      name: 'scale',
      options: [zoom],
    });

    return (
      <div className={cx(styles.root, { [styles.panning]: panning })} ref={(c) => (this._container = c)}>
        <Controls
          className={styles.controls}
          onIncrease={this.increaseLevel}
          onDecrease={this.decreaseLevel}
          zoomText={humanifyZoom(zoom + level)}
        />

        <div className={styles.map} style={mapStyles}>
          {layerCells.map((column, index) => (
            <div className={styles.column} key={index}>
              {column.map((row) => <Cell data={row} key={row.src} checkInViewport={calculateCellsInViewport} />)}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
