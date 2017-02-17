import proxyquire from 'proxyquire';

const sandbox = sinon.sandbox.create();
const hammerOn = sandbox.spy();
const hammerOff = sandbox.spy();

const Hammer = sandbox.spy(function () { return { on: hammerOn, off: hammerOff } });

const dom = proxyquire('./dom', {
  'hammerjs': Hammer,
});

describe('dom helpers', () => {
  describe('within viewport', () => {

  });

  describe('attach wheel event', () => {
    const element = {
      addEventListener: sandbox.spy(),
      removeEventListener: sandbox.spy(),
    };
    const cb = () => {};
    let detatch;

    before(() => {
      detatch = dom.attachWheelEvent(element, cb);
    });

    it('should attach event', () => {
      expect(element.addEventListener).to.have.been.calledWith('wheel', cb);
    });

    it('should unattach event', () => {
      detatch();

      expect(element.removeEventListener).to.have.been.calledWith('wheel', cb);
    });
  });

  describe('attach pan events', () => {
    const element = { real: 'element' };
    const cb = () => {};
    const cbEnd = () => {};
    let detatch;

    before(() => {
      detatch = dom.attachPanEvents(element, cb, cbEnd);
    });

    it('should attach events', () => {
      expect(Hammer).to.have.been.calledWith(element);
      expect(hammerOn).to.have.been.calledWith('pan', cb);
      expect(hammerOn).to.have.been.calledWith('panend', cbEnd);
    });

    it('should unattach events', () => {
      detatch();

      expect(hammerOff).to.have.been.calledWith('pan', cb);
      expect(hammerOff).to.have.been.calledWith('panend', cbEnd);
    });
  });

  describe('style transform', () => {
    it('should build transform object', () => {
      const actual = dom.styleTransform({
        name: 'translate3d',
        options: ['23px', '555px', '92px'],
      }, {
        name: 'rotate',
        options: ['23deg'],
      });

      const expectedTransform = 'translate3d(23px, 555px, 92px) rotate(23deg)';

      expect(actual).to.eql({
        transform: expectedTransform,
        WebkitTransform: expectedTransform,
        MozTransform: expectedTransform,
        msTransform: expectedTransform,
        OTransform: expectedTransform,
      });
    });
  });
});
