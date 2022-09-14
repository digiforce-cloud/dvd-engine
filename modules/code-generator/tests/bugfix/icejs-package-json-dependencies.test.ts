import CodeGenerator from '../../src';
import * as fs from 'fs';
import * as path from 'path';
import { createDiskPublisher } from '../helpers/solutionHelper';

const testCaseBaseName = path.basename(__filename, '.test.ts');

test(testCaseBaseName, async () => {
  const inputSchemaJsonFile = path.join(__dirname, `${testCaseBaseName}.schema.json`);
  const outputDir = path.join(__dirname, `${testCaseBaseName}.generated`);
  await exportProject(inputSchemaJsonFile, outputDir);

  const generatedPackageJsonText = fs.readFileSync(
    path.join(outputDir, 'demo-project/package.json'),
    'utf-8',
  );
  const generatedPackageJson = JSON.parse(generatedPackageJsonText);
  expect(generatedPackageJson.dependencies).toBeTruthy();

  // 里面有的数据源则应该生成对应的 dependencies
  expect(generatedPackageJson.dependencies).toMatchObject({
    '@digiforce-cloud/dvd-datasource-engine': 'latest',
    '@digiforce-cloud/dvd-datasource-fetch-handler': 'latest',
  });

  // 里面没有的，则不应该生成对应的 dependencies
  expect(generatedPackageJson.dependencies).not.toMatchObject({
    '@digiforce-cloud/dvd-datasource-url-params-handler': 'latest',
    '@digiforce-cloud/dvd-datasource-mtop-handler': 'latest',
    '@digiforce-cloud/dvd-datasource-mopen-handler': 'latest',
  });
});

function exportProject(inputPath: string, outputPath: string) {
  const schemaJson = fs.readFileSync(inputPath, { encoding: 'utf8' });
  const newSchema = schemaJson;
  const builder = CodeGenerator.solutions.icejs();

  return builder.generateProject(newSchema).then(async (result) => {
    // displayResultInConsole(result);
    const publisher = createDiskPublisher();
    await publisher.publish({
      project: result,
      outputPath,
      projectSlug: 'demo-project',
      createProjectFolder: true,
    });
    return result;
  });
}
