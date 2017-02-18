import * as math from './math';

describe('math', () => {
  describe('rounding', () => {
    it('should round to one decimal place', () => {
      const actual = math.roundToOne(1.1234);

      expect(actual).to.equal(1.1);
    });
  });
});
