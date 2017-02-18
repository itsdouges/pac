import cellify from './cellify';

describe('cellify', () => {
  it('should cellify tiles', () => {
    const keys = [
      './0/0/0.png',
      './1/0/0.png',
      './1/0/1.png',
    ];
    const fakeContext = (name) => name;
    fakeContext.keys = () => keys;

    const cells = cellify(fakeContext);

    expect(cells).to.eql({
      '0': [
        [{
          src: keys[0],
        }],
      ],
      '1': [
        [{
          src: keys[1],
        }, {
          src: keys[2],
        }],
      ],
    });
  });
});
