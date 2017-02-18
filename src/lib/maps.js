// @flow

import cellify from './cellify';

// eslint-disable-next-line import/prefer-default-export
export function getDroneMap () {
  // $FlowFixMe: require.context doesn't have types atm.
  const context = require.context('../assets/tiles/drone/', true, /\.jpg$/);
  return cellify(context);
}
