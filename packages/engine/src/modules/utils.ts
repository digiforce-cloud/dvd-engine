import { isFormEvent, compatibleLegaoSchema, getNodeSchemaById } from '@digiforce-cloud/dvd-utils';
import { isNodeSchema } from '@digiforce-cloud/dvd-types';
import { getConvertedExtraKey, getOriginalExtraKey } from '@digiforce-cloud/dvd-designer';

const utils = {
  isNodeSchema,
  isFormEvent,
  compatibleLegaoSchema,
  getNodeSchemaById,
  getConvertedExtraKey,
  getOriginalExtraKey,
};

export default utils;