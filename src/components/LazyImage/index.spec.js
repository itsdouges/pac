import React from 'react';

import { mount } from 'enzyme';
import proxyquire from 'proxyquire';

const withinViewport = sinon.stub();

const LazyImage = proxyquire('./', {
  '../../lib/dom': { withinViewport },
}).default;

describe('<LazyImage />', () => {
  const props = {
    src: 'cool-source.com/png',
    className: 'class-name',
    checkInViewport: false,
  };

  let wrapper;

  beforeEach(() => {
    wrapper = mount(<LazyImage {...props} />);
  });
  afterEach(() => withinViewport.reset());

  it('should render image with expected props', () => {
    expect(wrapper.find('img')).to.have.props({
      src: '',
      alt: '',
      className: props.className,
      draggable: false,
    });
  });

  context('when not in viewport', () => {
    it('should not show image', () => {
      expect(wrapper.find('img')).to.have.prop('src').equal('');
    });
  });

  context('when being told to check', () => {
    const fakeImage = { image: true };

    beforeEach(() => {
      wrapper.instance()._image = fakeImage;
      withinViewport.withArgs(fakeImage).returns(true);
      wrapper.setProps({
        checkInViewport: true,
      });
    });

    it('should show image', () => {
      expect(wrapper.find('img')).to.have.prop('src').equal(props.src);
    });

    it('should only call once', () => {
      withinViewport.reset();

      wrapper.setProps({
        checkInViewport: true,
      });

      expect(withinViewport).to.not.been.called;
    });
  });
});
