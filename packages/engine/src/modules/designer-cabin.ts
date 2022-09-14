import {
  SettingField,
  isSettingField,
  Designer,
  TransformStage,
  LiveEditing,
  isDragNodeDataObject,
  DragObjectType,
  isNode,
} from '@digiforce-cloud/dvd-designer';
import { Editor } from '@digiforce-cloud/dvd-editor-core';
import { Dragon } from '@digiforce-cloud/dvd-shell';

export default function getDesignerCabin(editor: Editor) {
  const designer = editor.get('designer') as Designer;

  return {
    SettingField,
    isSettingField,
    dragon: Dragon.create(designer.dragon),
    TransformStage,
    LiveEditing,
    DragObjectType,
    isDragNodeDataObject,
    isNode,
  };
}