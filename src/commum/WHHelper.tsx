import {
  IPropertyPaneField,
  PropertyPaneFieldType,
  IPropertyPaneCustomFieldProps,
} from "@microsoft/sp-property-pane";

import s from "./WHHelper.module.scss";

export interface IWHhelperProps {
  labelHelp: string;
  labelWebpart: string;
  href: string;
  version: string;
}

export function PropertyPaneWHHelper(
  targetProperty: string,
  properties: IWHhelperProps
): IPropertyPaneField<IPropertyPaneCustomFieldProps> {
  return {
    targetProperty: targetProperty,
    type: PropertyPaneFieldType.Custom,
    properties: {
      key: targetProperty,
      onRender: (element: HTMLElement) => {
        element.innerHTML =
          properties.labelWebpart +
          " ver.: " +
          properties.version +
          "<HR><a href='" +
          properties.href +
          "' target='_blank'>" +
          properties.labelHelp +
          "</a>";
        element.className = s.whHelperControl;
      },
    },
  };
}
