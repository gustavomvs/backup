import { useState, useEffect } from "react";
import * as React from "react";
import styles from "./SideNavigation.module.scss";
import { Icon } from "@fluentui/react";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/attachments";
import EditPanel from "./EditPanel";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-explicit-any
function TreeItem({
  Title,
  whParentItemId,
  ID,
  dataBase,
  whLink,
  whOpenInNewTab,
  sp,
  setDataBase,
  op,
  dm,
  dropID,
  contextID,
}: any) {
  const [open, setOpen] = useState(false);
  const [chil, setChil] = useState([]);
  const url = window.location.href;

  useEffect(() => {
    if (dataBase) {
      setChil(dataBase.filter((e: any) => ID === e.whParentItemId));
    }
  }, [dataBase]);

  useEffect(() => {
    if (chil.length > 0) {
      chil.map((e) => {
        const father = dataBase.find(
          (el: any) => el.whLink === url || el.whLink + "?Mode=Edit" === url
        );
        if (father) {
          if (father.whParentItemId === e.ID) {
            setOpen(true);
          }
        }
        if (url === e.whLink || url === e.whLink + "?Mode=Edit") {
          setOpen(true);
        }
      });
    }
    if (url === whLink || url === whLink + "?Mode=Edit") {
      setOpen(true);
    }
  }, [chil]);

  function toggle(): void {
    setOpen(!open);
  }

  const onClickBanner = (): void => {
    whLink && window.open(whLink, whOpenInNewTab ? "_blank" : "_self");
  };

  return (
    <div className={styles.containerwidth}>
      <div className={styles.container}>
        {!whParentItemId ? (
          <section>
            <div className={styles.fat}>
              <div className={styles.flex}>
                <div className={styles.space}>
                  {chil.length > 0 && (
                    <Icon
                      onClick={() => {
                        toggle();
                      }}
                      className={styles.dropIcon}
                      iconName={!open ? "ChevronDownMed" : "ChevronUpMed"}
                    />
                  )}
                </div>
                <div
                  className={
                    url === whLink || url === whLink + "?Mode=Edit"
                      ? styles.letBold
                      : styles.let
                  }
                  onClick={() => {
                    onClickBanner();
                    toggle();
                  }}
                >
                  {Title}
                </div>
              </div>
              {dm === 2 && (
                <div className={styles.editPanel}>
                  <EditPanel
                    Title={Title}
                    whOpenInNewTab={whOpenInNewTab}
                    whLink={whLink}
                    whParentItemId={whParentItemId}
                    sp={sp}
                    ID={ID}
                    open={false}
                    setDataBase={setDataBase}
                    dataBase={dataBase}
                    op={op}
                    chilId={chil}
                    dropID={dropID}
                    contextID={contextID}
                  />
                </div>
              )}
            </div>
          </section>
        ) : (
          <section>
            <div className={styles.child1}>
              <div className={styles.flex}>
                <div className={styles.space}>
                  {chil.length > 0 && (
                    <Icon
                      onClick={() => {
                        toggle();
                      }}
                      className={styles.dropIcon}
                      iconName={!open ? "ChevronDownMed" : "ChevronUpMed"}
                    />
                  )}
                </div>
                <div
                  className={
                    url === whLink || url === whLink + "?Mode=Edit"
                      ? styles.letBold
                      : styles.let
                  }
                  onClick={() => {
                    toggle();
                    onClickBanner();
                  }}
                >
                  {Title}
                </div>
              </div>

              {dm === 2 && (
                <div className={styles.editPanel2}>
                  <EditPanel
                    Title={Title}
                    whOpenInNewTab={whOpenInNewTab}
                    whLink={whLink}
                    whParentItemId={whParentItemId}
                    ID={ID}
                    sp={sp}
                    open={false}
                    setDataBase={setDataBase}
                    dataBase={dataBase}
                    op={op}
                    chilID={chil}
                    dropID={dropID}
                    contextID={contextID}
                  />
                </div>
              )}
            </div>
          </section>
        )}

        {open &&
          chil.length > 0 &&
          chil.map((item: any, i: number) => {
            return (
              <TreeItem
                onClick={() => {
                  toggle();
                  onClickBanner();
                }}
                key={i}
                {...item}
                sp={sp}
                dataBase={dataBase}
                setDataBase={setDataBase}
                dm={dm}
                op={op}
                dropID={dropID}
                contextID={contextID}
              />
            );
          })}
      </div>
    </div>
  );
}

export default TreeItem;
