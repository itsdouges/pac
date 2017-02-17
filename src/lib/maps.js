// @flow

import cellify from './cellify';

export function getDroneMap () {
  // $FlowFixMe: require.context doesn't have types atm.
  const context = require.context('../assets/tiles/drone/', true, /\.jpg$/);
  return cellify(context);
}
