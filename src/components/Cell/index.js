// @flow

import React from 'react';
import styles from './styles.css';

type Props = {
  data: {
    src: string,
  },
};

const Cell = ({ data }: Props) => (
  <img src={data.src} role="presentation" className={styles.root} />
);

export default Cell;
