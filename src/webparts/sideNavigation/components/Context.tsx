import * as React from "react";
import styles from "./SideNavigation.module.scss";
import PanelContext from "./PanelContext";

function Context({ options, sp }: any) {
  return (
    <div className={styles.contextFlex}>
      <PanelContext options={options} sp={sp} />
    </div>
  );
}

export default Context;
