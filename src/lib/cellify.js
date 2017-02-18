// @flow

type CellData = {
  src: string,
};

export type Column = Array<CellData>;

export type Cells = {
  [level: number]: Array<Column>,
};

export default function cellify (context: any): Cells {
  const cells = context.keys().reduce((obj, fileName) => {
    const [, level, column] = fileName.split('/');

    const data = obj[level] || [];
    data[+column] = data[column] || [];
    data[+column].push({
      src: context(fileName),
    });

    return {
      ...obj,
      [level]: data,
    };
  }, {});

  return cells;
}
