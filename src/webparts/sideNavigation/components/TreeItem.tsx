import { useState, useEffect } from "react";
import * as React from "react";
import styles from "./SideNavigation.module.scss";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-explicit-any
function TreeItem({
  Title,
  whParentItemId,
  ID,
  db,
  whLink,
  whOpenInNewTab,
}: any) {
  const [open, setOpen] = useState(false);
  const [chil, setChil] = useState([]);

  useEffect(() => {
    if (db) {
      setChil(db.filter((e: any) => ID === e.whParentItemId));
    }
  }, []);

  function toggle(): void {
    setOpen((old) => !old);
  }

  const onClickBanner = (): void => {
    // window.open(whLink, whOpenInNewTab ? "_blank" : "_self");
  };

  return (
    <div>
      <div className={styles.container}>
        {!whParentItemId ? (
          <div
            className={styles.fat}
            onClick={() => {
              toggle();
              onClickBanner();
            }}
          >
            {Title}
          </div>
        ) : (
          <div
            className={!whLink ? styles.child1 : styles.child2}
            onClick={() => {
              toggle();
              onClickBanner();
            }}
          >
            {Title}
          </div>
        )}

        {open &&
          chil &&
          chil.map((it: any, i: number) => {
            return <TreeItem key={i} {...it} db={db} />;
          })}
      </div>
    </div>
  );
}

export default TreeItem;
