// @flow

import React from 'react';
import LazyImage from '../LazyImage';
import styles from './styles.css';

type Props = {
  data: {
    src: string,
  },
};

const Cell = ({ data, ...props }: Props) => (
  <LazyImage src={data.src} className={styles.root} {...props} />
);

export default Cell;
