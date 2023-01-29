import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";

import * as strings from "SideNavigationWebPartStrings";
import SideNavigation from "./components/SideNavigation";
import { ISideNavigationProps } from "./components/ISideNavigationProps";

export interface ISideNavigationWebPartProps {
  description: string;
}

export default class SideNavigationWebPart extends BaseClientSideWebPart<ISideNavigationWebPartProps> {
  public render(): void {
    const element: React.ReactElement<ISideNavigationProps> =
      React.createElement(SideNavigation, {
        context: this.context,
      });
    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("description", {
                  label: strings.DescriptionFieldLabel,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
