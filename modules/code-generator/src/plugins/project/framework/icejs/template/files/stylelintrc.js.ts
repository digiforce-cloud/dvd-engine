import { ResultFile } from '@digiforce-cloud/dvd-types';
import { createResultFile } from '../../../../../../utils/resultHelper';

export default function getFile(): [string[], ResultFile] {
  const file = createResultFile(
    '.stylelintrc',
    'js',
    `
const { stylelint } = require('@ice/spec');

module.exports = stylelint;
    `,
  );

  return [[], file];
}
