import { getSetter, registerSetter, getSettersMap, RegisteredSetter } from '@digiforce-cloud/dvd-editor-core';
import { CustomView } from '@digiforce-cloud/dvd-types';

export default class Setters {
  /**
   * 获取指定 setter
   * @param type
   * @returns
   */
  getSetter(type: string) {
    return getSetter(type);
  }

  /**
   * 获取已注册的所有 settersMap
   * @returns
   */
  getSettersMap() {
    return getSettersMap();
  }

  /**
   * 注册一个 setter
   * @param typeOrMaps
   * @param setter
   * @returns
   */
  registerSetter(
    typeOrMaps: string | { [key: string]: CustomView | RegisteredSetter },
    setter?: CustomView | RegisteredSetter | undefined,
  ) {
    return registerSetter(typeOrMaps, setter);
  }
}
