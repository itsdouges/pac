import React from 'react';

import { shallow } from 'enzyme';
import proxyquire from 'proxyquire';
import { createStubComponent } from '../../../test/utils';

const LazyImage = createStubComponent('LazyImage');

const styles = {
  root: 'root-styles',
};

const Cell = proxyquire('./', {
  '../LazyImage': LazyImage,
  './styles.css': styles,
}).default;

describe('<Cell />', () => {
  const data = {
    src: 'cool-source',
  };

  const extraProps = {
    extra: 'stuff',
    yeah: 'its-alright',
  };

  let lazyImage;

  before(() => {
    lazyImage = shallow(<Cell data={data} {...extraProps} />).find('LazyImage');
  });

  describe('rendering <LazyImage />', () => {
    it('should pass down src', () => {
      expect(lazyImage).to.have.prop('src').equal(data.src);
    });

    it('should pass down rest of props', () => {
      expect(lazyImage).to.have.props(extraProps);
    });

    it('should set classname', () => {
      expect(lazyImage).to.have.className(styles.root);
    });
  });
});
