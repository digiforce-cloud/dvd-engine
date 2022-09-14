import type { ContainerSchema } from '@digiforce-cloud/dvd-types';

export interface ICompAnalyzeResult {
  isUsingRef: boolean;
}

export type TComponentAnalyzer = (container: ContainerSchema) => ICompAnalyzeResult;
