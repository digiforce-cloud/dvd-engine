import 'jest';
import fs from 'fs';
import glob from 'glob';
import JSON from 'json5';
import path from 'path';

import {
  getSubDirectoriesSync,
  removeActualDirRecursiveSync,
  runPrettierSync,
  createDiskPublisher,
} from '../../helpers/solutionHelper';

import CodeGenerator from '../../../src';

import type { ProjectSchema } from '@digiforce-cloud/dvd-types';

jest.setTimeout(15 * 1000);

const TEST_CASES_DIR = path.join(__dirname, '../../../test-cases/rax-app');
const SHOULD_UPDATE_EXPECTED = process.env.UPDATE_EXPECTED === 'true';

getSubDirectoriesSync(TEST_CASES_DIR).forEach(defineTest);

function defineTest(caseDirName: string) {
  test(`rax-app/${caseDirName} should works`, async () => {
    try {
      const caseFullDir = path.join(TEST_CASES_DIR, caseDirName);
      const schema = JSON.parse(fs.readFileSync(path.join(caseFullDir, 'schema.json5'), 'utf-8'));
      const actualDir = path.join(caseFullDir, SHOULD_UPDATE_EXPECTED ? 'expected' : 'actual');

      removeActualDirRecursiveSync(actualDir, caseFullDir);

      await exportProject(schema, actualDir, 'demo-project');

      const actualFiles = glob.sync('**/*.{js,jsx,json,ts,tsx,less,css,scss,sass}', {
        cwd: actualDir,
      });

      expect(actualFiles.length > 0).toBeTruthy();

      runPrettierSync(actualFiles, actualDir);

      if (!SHOULD_UPDATE_EXPECTED) {
        expect(caseFullDir).toBeSameFileContents();
      }
    } catch (e) {
      throw e; // just for debugger
    }
  });
}

async function exportProject(schemaJson: ProjectSchema, targetPath: string, projectName: string) {
  const raxAppBuilder = CodeGenerator.solutions.rax();
  const result = await raxAppBuilder.generateProject(schemaJson);

  const publisher = createDiskPublisher();
  await publisher.publish({
    project: result,
    outputPath: targetPath,
    projectSlug: projectName,
    createProjectFolder: true,
  });
}
