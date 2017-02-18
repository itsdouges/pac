import React from 'react';
import { mount } from 'enzyme';
import proxyquire from 'proxyquire';
import { createStubComponent, stubStyleTransform } from '../../../test/utils';

const styles = {
  root: 'root-styles',
  map: 'map-styles',
  column: 'column-styles',
  controls: 'controls-styles',
  panning: 'panning-styles',
};

const sandbox = sinon.sandbox.create();
const detachWheelEvent = sandbox.spy();
const detachPanEvents = sandbox.spy();
const attachWheelEvent = sandbox.stub().returns(detachWheelEvent);
const attachPanEvents = sandbox.stub().returns(detachPanEvents);

const Controls = createStubComponent('Controls');
const Column = createStubComponent('Column');

const Map = proxyquire.noCallThru()('./', {
  './styles.css': styles,
  '../Controls': Controls,
  '../Column': Column,
  '../../lib/dom': { attachWheelEvent, attachPanEvents, styleTransform: stubStyleTransform },
}).default;

describe('<Map />', () => {
  const cells = {
    '0': [
      [{
        src: '0/0/0.jpg',
      }],
    ],
    '1': [
      [{
        src: '1/0/0.jpg',
      }, {
        src: '1/0/1.jpg',
      }],
    ],
  };

  let wrapper;
  let clock;

  const findMap = () => wrapper.find(`.${styles.map}`);
  const assertLevelRendered = (level, checkInViewport = true) => {
    const data = cells[level];

    data.forEach((c) => {
      expect(findMap()).to.contain(
        <Column
          className={styles.column}
          data={c}
          checkInViewport={checkInViewport}
        />
      );
    });
  };
  const assertStyle = ({ x = 0, y = 0, scale = 1 }) => {
    const transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;

    expect(findMap()).to.have.prop('style').eql({
      transform,
    });
  };
  const createWrapper = () => mount(<Map cells={cells} />);

  before(() => {
    clock = sinon.useFakeTimers();
  });

  beforeEach(() => {
    wrapper = createWrapper();
  });

  afterEach(() => sandbox.reset());

  after(() => {
    clock.restore();
  });

  it('should render container', () => {
    expect(wrapper).to.have.className(styles.root);
  });

  it('should render first level of cells', () => {
    assertLevelRendered(0);
  });

  describe('cleanup', () => {
    it('should remove events', () => {
      wrapper.unmount();

      expect(detachWheelEvent).to.have.been.called;
      expect(detachPanEvents).to.have.been.called;
    });
  });

  describe('controls', () => {
    it('should render', () => {
      expect(wrapper.find(Controls)).to.have.props({
        className: styles.controls,
        zoomText: '1.0x',
      });
    });
  });

  describe('zooming', () => {
    const initialDeltaY = 100;
    let triggerOnWheel;

    beforeEach(() => {
      const [, onWheel] = attachWheelEvent.firstCall.args;

      triggerOnWheel = (deltaY) => onWheel({
        deltaY,
      });

      triggerOnWheel(initialDeltaY);
    });

    it('should set events', () => {
      expect(attachWheelEvent).to.have.been.calledWith(window, sinon.match.func);
    });

    context('when zooming near next level', () => {
      it('should increase scale of map', () => {
        assertStyle({
          scale: 1.2,
        });
      });

      it('should update zoom text', () => {
        expect(wrapper.find(Controls)).to.have.prop('zoomText').equal('1.2x');
      });
    });

    context('when zooming past next level', () => {
      beforeEach(() => {
        triggerOnWheel(1000);
      });

      it('should reset scale', () => {
        assertStyle({
          scale: 1,
        });
      });

      it('should increase level', () => {
        assertLevelRendered(1, false);
      });

      it('should update zoom text taking level into consideration', () => {
        expect(wrapper.find(Controls)).to.have.prop('zoomText').equal('2.0x');
      });
    });

    context('when zooming near previous level', () => {
      beforeEach(() => {
        triggerOnWheel(1000);
        triggerOnWheel(1000);
        triggerOnWheel(-100);
      });

      it('should decrease scale of map', () => {
        assertStyle({
          scale: 2.8,
        });
      });

      it('should update zoom text', () => {
        expect(wrapper.find(Controls)).to.have.prop('zoomText').equal('3.8x');
      });
    });

    context('when zooming past previous level', () => {
      beforeEach(() => {
        triggerOnWheel(-100);
      });

      it('should reset scale', () => {
        assertStyle({
          scale: 1,
        });
      });

      it('should decrease level', () => {
        assertLevelRendered(0, false);
      });
    });

    describe('finishing zoom', () => {
      it('should notify columns zoom has finished', () => {
        clock.tick(100);

        assertLevelRendered(0, true);
      });
    });
  });

  describe('interacting with controls', () => {
    const findControls = () => wrapper.find(Controls);

    describe('increasing', () => {
      it('should increase the level', () => {
        const controls = findControls();
        const { onIncrease } = controls.props();

        onIncrease();

        assertLevelRendered(1, true);
      });

      it('should not allow the level to increase past the max', () => {
        const controls = findControls();
        const { onIncrease } = controls.props();

        onIncrease();
        onIncrease();
        onIncrease();
        onIncrease();

        assertLevelRendered(1, true);
      });
    });

    describe('decreasing', () => {
      it('should decrease the level', () => {
        const controls = findControls();
        const { onIncrease, onDecrease } = controls.props();

        onIncrease();
        onDecrease();

        assertLevelRendered(0, true);
      });

      it('should not allow the level to decrease past the min', () => {
        const controls = findControls();
        const { onIncrease, onDecrease } = controls.props();

        onIncrease();
        onDecrease();
        onDecrease();
        onDecrease();
        onDecrease();

        assertLevelRendered(0, true);
      });
    });
  });

  describe('panning', () => {
    const delta = {
      deltaX: 10,
      deltaY: 50,
    };

    let triggerOnPan;
    let triggerOnPanEnd;

    beforeEach(() => {
      const [, onPan, onPanEnd] = attachPanEvents.firstCall.args;

      triggerOnPan = ({ deltaX, deltaY }) => onPan({
        deltaX,
        deltaY,
      });

      triggerOnPanEnd = () => onPanEnd();

      triggerOnPan(delta);
    });

    it('should set events', () => {
      expect(attachPanEvents).to.have.been.calledWith(
        wrapper.instance()._container,
        sinon.match.func,
        sinon.match.func,
      );
    });

    context('when starting to pan', () => {
      it('should set cursor to panning', () => {
        expect(wrapper).to.have.className(styles.panning);
      });

      it('should pan across the map', () => {
        assertStyle({
          x: delta.deltaX,
          y: delta.deltaY,
        });
      });

      it('should notify columns panning has started', () => {
        clock.tick(101);

        assertLevelRendered(0, false);
      });
    });

    context('when finishing pan', () => {
      beforeEach(() => {
        triggerOnPanEnd();
      });

      it('should reset cursor', () => {
        expect(wrapper).to.not.have.className(styles.panning);
      });

      it('should notify columns panning has finished', () => {
        clock.tick(201);

        assertLevelRendered(0, true);
      });
    });

    context('when starting to pan after finishing', () => {
      it('should pan from last position', () => {
        triggerOnPanEnd();
        triggerOnPan(delta);

        assertStyle({
          x: delta.deltaX + delta.deltaX,
          y: delta.deltaY + delta.deltaY,
        });
      });
    });
  });
});
