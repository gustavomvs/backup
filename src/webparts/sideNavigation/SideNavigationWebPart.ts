import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import { IPropertyPaneConfiguration } from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";

import SideNavigation from "./components/SideNavigation";
import { ISideNavigationProps } from "./components/ISideNavigationProps";
import { PropertyPaneWHHelper } from "../../commum/WHHelper";
import * as strings from "SideNavigationWebPartStrings";

export interface ISideNavigationWebPartProps {
  description: string;
  dropID: any;
}

export default class SideNavigationWebPart extends BaseClientSideWebPart<ISideNavigationWebPartProps> {
  public render(): void {
    const element: React.ReactElement<ISideNavigationProps> =
      React.createElement(SideNavigation, {
        context: this.context,
        displayMode: this.displayMode,
        dropID: this.properties.dropID,
        updatePropety: (id: any) => {
          this.properties.dropID = id;
        },
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
          displayGroupsAsAccordion: true,
          groups: [
            {
              groupName: "Version",
              isCollapsed: true,
              groupFields: [
                PropertyPaneWHHelper("whHelperProp", {
                  labelWebpart: "WHD Side Navigation",
                  labelHelp: strings.help,
                  version: this.manifest.version,
                  href: `https://workhub.gitbook.io/modern-${this.context.pageContext.cultureInfo.currentUICultureName.toLowerCase()}/apps/sidenavigation`,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
