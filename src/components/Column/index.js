// @flow

import React from 'react';
import type { Column as ColumnType } from '../../lib/cellify';

import Cell from '../Cell';

type Props = {
  data: ColumnType,
  className?: string,
};

const Column = ({ data, className, ...props }: Props) => (
  <div className={className}>
    {data.map((row) => <Cell data={row} key={row.src} {...props} />)}
  </div>
);

export default Column;
