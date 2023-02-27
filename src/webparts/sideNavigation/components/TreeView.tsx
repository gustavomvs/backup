import TreeItem from "./TreeItem";
import * as React from "react";
import styles from "./SideNavigation.module.scss";
import SidePanel from "./Panel";
import Context from "./Context";
import { IDropdownOption } from "@fluentui/react";
import DropdownContext from "./DropdownContext";
import { useState } from "react";

const op: IDropdownOption[] = [];
const options: IDropdownOption[] = [];

function TreeView({ dataBase, sp, setDataBase, dm, dropID, updateID }: any) {
  const [contextID, setcontextID] = useState(dropID);

  return (
    <div>
      <SidePanel
        contextID={contextID}
        dm={dm}
        op={op}
        setDataBase={setDataBase}
        sp={sp}
        dropID={dropID}
      />
      {dm === 2 && <Context options={options} sp={sp} />}
      {dm === 2 && (
        <DropdownContext
          options={options}
          op={op}
          setcontextID={setcontextID}
          updateID={updateID}
          sp={sp}
          dropID={dropID}
        />
      )}

      <div className={styles.container}>
        {dataBase.length > 0 &&
          dataBase.map((item: any, i: any) => {
            if (!item.whParentItemId && item.whItemContextId === contextID) {
              return (
                <div className={styles.containerwidth}>
                  <TreeItem
                    dm={dm}
                    op={op}
                    {...item}
                    key={i}
                    sp={sp}
                    dataBase={dataBase}
                    item={item}
                    setDataBase={setDataBase}
                    dropID={dropID}
                    contextID={contextID}
                  />
                </div>
              );
            }
          })}
      </div>
    </div>
  );
}

export default TreeView;
