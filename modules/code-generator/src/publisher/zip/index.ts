import { ResultDir } from '@digiforce-cloud/dvd-types';
import { PublisherFactory, IPublisher, IPublisherFactoryParams, PublisherError } from '../../types';
import { getErrorMessage } from '../../utils/errors';
import { isNodeProcess, writeZipToDisk, generateProjectZip } from './utils';

// export type ZipBuffer = Buffer | Blob;
export type ZipBuffer = Buffer;

declare type ZipPublisherResponse = string | ZipBuffer;

export interface ZipFactoryParams extends IPublisherFactoryParams {
  outputPath?: string;
  projectSlug?: string;
}

export interface ZipPublisher extends IPublisher<ZipFactoryParams, ZipPublisherResponse> {
  getOutputPath: () => string | undefined;
  setOutputPath: (path: string) => void;
}

export const createZipPublisher: PublisherFactory<ZipFactoryParams, ZipPublisher> = (
  params: ZipFactoryParams = {},
): ZipPublisher => {
  let { project, outputPath } = params;

  const getProject = () => project;
  const setProject = (projectToSet: ResultDir) => {
    project = projectToSet;
  };

  const getOutputPath = () => outputPath;
  const setOutputPath = (path: string) => {
    outputPath = path;
  };

  const publish = async (options: ZipFactoryParams = {}) => {
    const projectToPublish = options.project || project;
    if (!projectToPublish) {
      throw new PublisherError('MissingProject');
    }

    const zipName = options.projectSlug || params.projectSlug || projectToPublish.name;

    try {
      const zipContent = await generateProjectZip(projectToPublish);

      // If not output path is provided, zip is not written to disk
      const projectOutputPath = options.outputPath || outputPath;
      if (projectOutputPath && isNodeProcess()) {
        await writeZipToDisk(projectOutputPath, zipContent, zipName);
      }

      return { success: true, payload: zipContent };
    } catch (error) {
      throw new PublisherError(getErrorMessage(error) || 'UnknownError');
    }
  };

  return {
    publish,
    getProject,
    setProject,
    getOutputPath,
    setOutputPath,
  };
};
