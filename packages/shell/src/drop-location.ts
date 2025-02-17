import {
  DropLocation as InnerDropLocation,
} from '@digiforce-cloud/dvd-designer';
import { dropLocationSymbol } from './symbols';
import Node from './node';

export default class DropLocation {
  private readonly [dropLocationSymbol]: InnerDropLocation;

  constructor(dropLocation: InnerDropLocation) {
    this[dropLocationSymbol] = dropLocation;
  }

  static create(dropLocation: InnerDropLocation | null) {
    if (!dropLocation) return null;
    return new DropLocation(dropLocation);
  }

  get target() {
    return Node.create(this[dropLocationSymbol].target);
  }
}
