import * as React from "react";
import { ISideNavigationProps } from "./ISideNavigationProps";
import { spfi, SPFx as spSPFx } from "@pnp/sp";
import { useEffect, useState } from "react";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/attachments";
import TreeView from "./TreeView";

const SideNavigation: React.FunctionComponent<ISideNavigationProps> = (
  props
) => {
  const sp = spfi().using(spSPFx(props.context));

  const [dataBase, setDataBase] = useState([]);

  const meuInit = async (): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    sp.web.lists
      .getByTitle("Side Navigation")
      .items()
      .then((res) => {
        setDataBase(res);
      });
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    meuInit();
  }, []);

  return (
    <div>
      <div>
        <TreeView sp={sp} dataBase={dataBase} setDataBase={setDataBase} />
      </div>
    </div>
  );
};

export default SideNavigation;
