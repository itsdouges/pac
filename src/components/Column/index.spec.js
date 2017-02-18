import React from 'react';
import { shallow } from 'enzyme';
import proxyquire from 'proxyquire';

import { createStubComponent } from '../../../test/utils';

const Cell = createStubComponent('Cell');

const Column = proxyquire('./', {
  '../Cell': Cell,
}).default;

describe('<Column />', () => {
  const props = {
    data: [1, 2],
    className: 'cool-class',
    extra: true,
    yes: false,
  };

  let wrapper;

  before(() => {
    wrapper = shallow(<Column {...props} />);
  });

  it('should pass down classname', () => {
    expect(wrapper).to.have.className(props.className);
  });

  it('should render cells', () => {
    const cells = wrapper.find('Cell');

    expect(cells.length).to.equal(props.data.length);
    cells.forEach((cell, index) => {
      expect(cell).to.have.props({
        data: props.data[index],
        extra: props.extra,
        yes: props.yes,
      });
    });
  });
});
