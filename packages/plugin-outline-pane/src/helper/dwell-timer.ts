import { ParentalNode, DropLocation, isLocationChildrenDetail, LocateEvent } from '@digiforce-cloud/dvd-designer';

/**
 * 停留检查计时器
 */
export default class DwellTimer {
  private timer: number | undefined;

  private previous?: ParentalNode;

  private event?: LocateEvent;

  private decide: (node: ParentalNode, event: LocateEvent) => void;

  private timeout = 500;

  constructor(decide: (node: ParentalNode, event: LocateEvent) => void, timeout = 500) {
    this.decide = decide;
    this.timeout = timeout;
  }

  focus(node: ParentalNode, event: LocateEvent) {
    this.event = event;
    if (this.previous === node) {
      return;
    }
    this.reset();
    this.previous = node;
    this.timer = setTimeout(() => {
      this.previous && this.decide(this.previous, this.event!);
      this.reset();
    }, this.timeout) as any;
  }

  tryFocus(loc?: DropLocation | null) {
    if (!loc || !isLocationChildrenDetail(loc.detail)) {
      this.reset();
      return;
    }
    if (loc.detail.focus?.type === 'node') {
      this.focus(loc.detail.focus.node, loc.event);
    } else {
      this.reset();
    }
  }

  reset() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }

    this.previous = undefined;
  }
}
