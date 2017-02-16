// @flow

import React from 'react';
import LazyImage from '../LazyImage';
import styles from './styles.css';

type Props = {
  data: {
    src: string,
  },
};

const Cell = ({ data }: Props) => (
  <LazyImage src={data.src} className={styles.root} />
);

export default Cell;
