// @flow

import type { Cells } from '../../lib/cellify';

import React, { Component } from 'react';
import cx from 'classnames';
import debounce from 'lodash/debounce';

import styles from './styles.css';
import Controls from '../Controls';
import Column from '../Column';
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
const NOTIFY_COLUMNS_DEBOUNCE = 100;

const humanifyZoom = (zoom) => {
  const roundedZoom = roundToOne(zoom);
  const normalizedZoom = roundedZoom % 1 === 0 ? `${roundedZoom}.0` : roundedZoom;
  return `${normalizedZoom}x`;
};

export default class Map extends Component {
  _detatchWheelEvent: () => void;
  _detatchPanEvents: () => void;
  _container: HTMLElement;
  // eslint-disable-next-line react/sort-comp
  _deltaOffsetX: number = 0;
  // eslint-disable-next-line react/sort-comp
  _deltaOffsetY: number = 0;

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

  onPanEnd = () => {
    this._deltaOffsetX = this.state.x;
    this._deltaOffsetY = this.state.y;

    this.setState({
      panning: false,
    });

    this.debouncedNotifyColumns();
  };

  onPan = (e: any) => {
    const { deltaX, deltaY } = e;

    this.setState({
      panning: true,
      calculateCellsInViewport: false,
      x: this._deltaOffsetX + deltaX,
      y: this._deltaOffsetY + deltaY,
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

    this.debouncedNotifyColumns();

    return this.setState({
      calculateCellsInViewport: false,
      zoom: newZoom,
    });
  };

  debouncedNotifyColumns = debounce(() => {
    this.setState({
      calculateCellsInViewport: true,
    });
  }, NOTIFY_COLUMNS_DEBOUNCE);

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
    const layerColumns = cells[level];

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
          {layerColumns.map((column, index) => (
            <Column
              className={styles.column}
              key={index}
              data={column}
              checkInViewport={calculateCellsInViewport}
            />
          ))}
        </div>
      </div>
    );
  }
}
