import React from 'react';
import App from './';

import { shallow } from 'enzyme';

it('renders without crashing', () => {
  shallow(<App />);
});
