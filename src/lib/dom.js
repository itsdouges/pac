// @flow

import Hammer from 'hammerjs';

export function withinViewport (element?: ?HTMLElement): boolean {
  return true;
  // if (!element) {
  //   return false;
  // }

  // const { top, bottom } = element.getBoundingClientRect();
  // return top > 0 || bottom > 0;
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
