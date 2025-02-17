import { IconType, TitleContent, isI18nData, TipContent, isTitleConfig } from '@digiforce-cloud/dvd-types';
import { isValidElement } from 'react';

export function composeTitle(title?: TitleContent, icon?: IconType, tip?: TipContent, tipAsTitle?: boolean, noIcon?: boolean) {
  if (!title) {
    title = {};
    if (!icon || tipAsTitle) {
      title.label = tip;
      tip = undefined;
    }
  }
  if (icon || tip) {
    if (typeof title !== 'object' || isValidElement(title) || isI18nData(title)) {
      if (isValidElement(title)) {
        if (title.type === 'svg' || (title.type as any).getIcon) {
          if (!icon) {
            icon = title as any;
          }
          if (tipAsTitle) {
            title = tip as any;
            tip = null;
          } else {
            title = undefined;
          }
        }
      }
      title = {
        label: title,
        icon,
        tip,
      };
    } else {
      title = {
        ...title,
        icon,
        tip,
      };
    }
  }
  if (isTitleConfig(title) && noIcon) {
    if (!isValidElement(title)) {
      title.icon = undefined;
    }
  }
  return title;
}
