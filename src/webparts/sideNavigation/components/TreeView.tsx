import TreeItem from "./TreeItem";
import * as React from "react";
import styles from "./SideNavigation.module.scss";
import SidePanel from "./Panel";

function TreeView({ dataBase, sp, id, setDataBase }: any) {
  return (
    <div>
      <SidePanel db={dataBase} setDataBase={setDataBase} sp={sp} id={id} />
      <div className={styles.container}>
        {dataBase.map((item: any, i: any) => {
          if (!item.whParentItemId) {
            return (
              <TreeItem
                {...item}
                key={i}
                whLink={item.whLink}
                sd={sp}
                db={dataBase}
              />
            );
          }
        })}
      </div>
    </div>
  );
}

export default TreeView;
