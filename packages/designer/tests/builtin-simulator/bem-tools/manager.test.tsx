import '../../fixtures/window';
import { set, delayObxTick, delay } from '../../utils';
import { Editor } from '@digiforce-cloud/dvd-editor-core';
import { Project } from '../../../src/project/project';
import { DocumentModel } from '../../../src/document/document-model';
import {
  isRootNode,
  Node,
  isNode,
  comparePosition,
  contains,
  insertChild,
  insertChildren,
  PositionNO,
} from '../../../src/document/node/node';
import { Designer } from '../../../src/designer/designer';
import { BemToolsManager } from '../../../src/builtin-simulator/bem-tools/manager';
import formSchema from '../../fixtures/schema/form';

describe('Node 方法测试', () => {
  let editor: Editor;
  let designer: Designer;
  // let project: Project;
  // let doc: DocumentModel;
  let manager: BemToolsManager;

  beforeEach(() => {
    editor = new Editor();
    designer = new Designer({ editor });
    // project = designer.project;
    // doc = new DocumentModel(project, formSchema);
    manager = new BemToolsManager(designer);
  });

  afterEach(() => {
    // project.unload();
    designer.purge();
    editor = null;
    designer = null;
    // project = null;
  });

  it('addBemTools / removeBemTools / getAllBemTools', () => {
    manager.addBemTools({
      name: 't1',
      item: (props: any) => { return <div />; },
    });
    expect(manager.getAllBemTools().length).toBe(1);

    expect(() => {
      manager.addBemTools({
        name: 't1',
        item: (props: any) => { return <div />; },
      });
    }).toThrow(/already exists/);

    manager.removeBemTools('t2');
    expect(manager.getAllBemTools().length).toBe(1);

    manager.removeBemTools('t1');
    expect(manager.getAllBemTools().length).toBe(0);
  });
});