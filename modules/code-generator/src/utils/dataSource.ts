import changeCase from 'change-case';
import type { IProjectInfo } from '../types/intermediate';

export type DataSourceDependenciesConfig = {
  /** 数据源引擎的版本 */
  engineVersion?: string;
  /** 数据源引擎的包名 */
  enginePackage?: string;
  /** 数据源 handlers 的版本 */
  handlersVersion?: {
    [key: string]: string;
  };
  /** 数据源 handlers 的包名 */
  handlersPackages?: {
    [key: string]: string;
  };
};

export function buildDataSourceDependencies(
  ir: IProjectInfo,
  cfg: DataSourceDependenciesConfig = {},
): Record<string, string> {
  return {
    // 数据源引擎的依赖包
    [cfg.enginePackage || '@digiforce-cloud/dvd-datasource-engine']: cfg.engineVersion || 'latest',

    // 各种数据源的 handlers 的依赖包
    ...(ir.dataSourcesTypes || []).reduce(
      (acc, dsType) => ({
        ...acc,
        [getDataSourceHandlerPackageName(dsType)]: cfg.handlersVersion?.[dsType] || 'latest',
      }),
      {},
    ),
  };

  function getDataSourceHandlerPackageName(dsType: string) {
    return (
      cfg.handlersPackages?.[dsType] ||
      `@digiforce-cloud/dvd-datasource-${changeCase.kebab(dsType)}-handler`
    );
  }
}
