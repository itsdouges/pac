import React from 'react';
import { shallow } from 'enzyme';
import proxyquire from 'proxyquire';
import { createStubComponent } from '../../../test/utils';

const Map = createStubComponent('Map');
const droneMap = { 'zero': [] };
const styles = {
  root: 'root-class',
};

const App = proxyquire('./index', {
  '../Map': Map,
  './styles.css': styles,
  '../../lib/maps': {
    getDroneMap: () => droneMap,
  },
}).default;

describe('<App />', () => {
  let wrapper;

  before(() => {
    wrapper = shallow(<App />);
  });

  it('should set root classname', () => {
    expect(wrapper).to.have.className(styles.root);
  });

  it('should pass drone cells to <Map />', () => {
    expect(wrapper.find('Map')).to.have.prop('cells').equal(droneMap);
  });
});
