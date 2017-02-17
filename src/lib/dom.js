// @flow

import Hammer from 'hammerjs';

export function withinViewport (element?: ?HTMLElement): boolean {
  if (!element) {
    return false;
  }

  const box = element.getBoundingClientRect();

  const topInside = box.top < window.innerHeight + box.height;
  const rightInside = box.right < window.innerWidth + box.width;
  const bottomInside = box.bottom > -box.height;
  const leftInside = box.left > -box.width;

  return topInside && bottomInside && leftInside && rightInside;
}

export function attachWheelEvent (element: HTMLElement, cb: (WheelEvent) => void) {
  element.addEventListener('wheel', cb);
  return () => element.removeEventListener('wheel', cb);
}

export function attachPanEvent (element: HTMLElement, cb: (DragEvent) => void, cbEnd: (DragEvent) => void) {
  const hammer = new Hammer(element);
  hammer.on('pan', cb);
  hammer.on('panend', cbEnd);
  return () => {
    hammer.off('pan', cb);
    hammer.off('panend', cbEnd);
  };
}

type Transforms = Array<{
  name: string,
  options: Array<string | number>,
}>;

export function styleTransform (...transforms: Transforms) {
  const transform = transforms.map(({ name, options }) => `${name}(${options.join(', ')})`)
    .join(' ');

  return {
    transform,
    WebkitTransform: transform,
    MozTransform: transform,
    msTransform: transform,
    OTransform: transform,
  };
}
