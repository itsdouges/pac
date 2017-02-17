// @flow

import React from 'react';

export const createStubComponent = (displayName: string) => {
  function stubComponent () {
    return <div></div>;
  }

  stubComponent.displayName = displayName;

  return stubComponent;
};
