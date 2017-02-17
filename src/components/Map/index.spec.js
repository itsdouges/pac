// @flow

import proxyquire from 'proxyquire';
import { createStubComponent } from '../../../test/utils';

const styles = {
  root: 'root-styles',
};

const sandbox = sinon.sandbox.create();
const attachWheelEvent = sandbox.stub();
const attachPanEvent = sandbox.stub();
const styleTransform = sandbox.stub();

const Controls = createStubComponent('Controls');
const Cell = createStubComponent('Cell');

const Map = proxyquire('./', {
  './styles.css': styles,
  '../Controls': Controls,
  '../Cell': Cell,
  '../../lib/dom': { attachWheelEvent, attachPanEvent, styleTransform },
}).default;

describe('<Map />', () => {
  it('should render container', () => {

  });

  it('should render first level of cells', () => {

  });

  describe('cleanup', () => {
    it('should remove events', () => {

    });
  });

  describe('controls', () => {
    it('should render logo', () => {

    });

    it('should render buttons', () => {

    });
  });

  describe('zooming', () => {
    context('when zooming near next level', () => {
      it('should increase scale of map', () => {

      });
    });

    context('when zooming past next level', () => {
      it('should reset scale', () => {

      });

      it('should increase level', () => {

      });
    });

    context('when zooming near previous level', () => {
      it('should decrease scale of map', () => {

      });
    });

    context('when zooming past previous level', () => {
      it('should reset scale', () => {

      });

      it('should decrease level', () => {

      });
    });
  });

  describe('interacting with buttons', () => {
    describe('+ button', () => {
      it('should increase the level', () => {

      });

      it('should not allow the level to increase past the max', () => {

      });
    });

    describe('- button', () => {
      it('should decrease the level', () => {

      });

      it('should not allow the level to decrease past the min', () => {

      });
    });
  });

  describe('panning', () => {
    context('when starting to pan', () => {
      it('should set cursor to panning', () => {

      });

      it('should pan across the map', () => {

      });

      it('should notify cells panning has started', () => {

      });
    });

    context('when finishing pan', () => {
      it('should reset cursor', () => {

      });

      it('should notify cells panning has finished', () => {

      });
    });

    context('when starting to pan after finishing', () => {
      it('should pan from last position', () => {

      });
    });
  });
});
