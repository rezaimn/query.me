import { SyntheticEvent } from 'react';

export const stopPropagationForPopover = (event: SyntheticEvent) => {
  event.stopPropagation();
};

export type EventType = 'singleClick' | 'doubleClick';
type EventCallback = (event: SyntheticEvent, eventType: EventType) => void;

export function clickHandlerCreator(callback: EventCallback) {
  let clickCount = 0;
  let timer: any = null;
  const delay = 250;

  return function(event: SyntheticEvent) {
    clickCount++;
    if (clickCount === 1) {
      timer = setTimeout(function(){
        callback(event, 'singleClick');
        clickCount = 0;
      }, delay);
    } else {
      callback(event, 'doubleClick');
      clearTimeout(timer);
      clickCount = 0;
    }
  }
}
