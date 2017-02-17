// @flow

import React from 'react';

import { shallow } from 'enzyme';
import proxyquire from 'proxyquire';

const styles = {
  root: 'root-styles',
  logo: 'logo-style',
  button: 'button-style',
};

const logo = 'https://cool.com/logo.png';

const Controls = proxyquire('./', {
  './styles.css': styles,
  '../../assets/images/logo.png': logo,
}).default;

describe('<Controls />', () => {
  const props = {
    className: 'neat-class',
    onIncrease: sinon.spy(),
    onDecrease: sinon.spy(),
    zoomText: 'zooooom',
  };

  let wrapper;

  before(() => {
    wrapper = shallow(<Controls {...props} />);
  });

  describe('rendering', () => {
    it('should render logo', () => {
      const img = wrapper.find('img');

      expect(img).to.have.props({
        src: logo,
        alt: 'Propeller Aero',
        className: styles.logo,
      });
    });

    it('should render zoom text', () => {
      expect(wrapper).to.contain(<span>{props.zoomText}</span>);
    });

    it('should render buttons', () => {
      expect(wrapper).to.contain(<button className={styles.button} onClick={props.onDecrease}>-</button>);
      expect(wrapper).to.contain(<button className={styles.button} onClick={props.onIncrease}>+</button>);
    });
  });

  describe('interacting with buttons', () => {
    context('when clicking increase', () => {
      it('should notify parent', () => {
        const button = wrapper.find('button');

        button.at(1).simulate('click');

        expect(props.onIncrease).to.have.been.called;
      });
    });

    context('when clicking decrease', () => {
      it('should notify parent', () => {
        const button = wrapper.find('button');

        button.at(0).simulate('click');

        expect(props.onDecrease).to.have.been.called;
      });
    });
  });
});
