import { ProjectSchema } from '@digiforce-cloud/dvd-types';
import { SchemaParser } from '../../../src';
import SCHEMA_WITH_SLOT from './data/schema-with-slot.json';

describe('tests/public/SchemaParser/p0-basics', () => {
  it('should be able to get dependencies in slots', () => {
    const schemaParser = new SchemaParser();
    const result = schemaParser.parse(SCHEMA_WITH_SLOT as ProjectSchema);
    expect(result.containers.map((c) => c.deps)).toMatchSnapshot();
    expect(result.containers[0].deps?.some((dep) => dep.componentName === 'Tooltip')).toBeTruthy();
    expect(result.containers[0].deps?.some((dep) => dep.componentName === 'Icon')).toBeTruthy();
  });
});
