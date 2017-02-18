// @flow

import React from 'react';
import { styleTransform } from '../src/lib/dom';

export const createStubComponent = (displayName: string) => {
  function stubComponent () {
    return <div />;
  }

  stubComponent.displayName = displayName;

  return stubComponent;
};

export const stubStyleTransform = (...args: any) => {
  const styles = styleTransform(...args);
  return { transform: styles.transform };
};
