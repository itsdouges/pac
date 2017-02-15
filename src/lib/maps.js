// @flow

import cellify from './cellify';

// $FlowFixMe: require.context doesn't have types atm.
const imagesContext = require.context('../assets/images/tiled/', true, /\.jpg$/);
export const propeller = cellify(imagesContext);
