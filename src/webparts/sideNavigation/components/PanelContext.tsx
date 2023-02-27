import * as React from "react";
import {
  DefaultButton,
  Icon,
  ITextFieldStyles,
  PrimaryButton,
  TextField,
  Panel,
} from "@fluentui/react";
import styles from "./SideNavigation.module.scss";
import { useBoolean } from "@fluentui/react-hooks";
import { useState } from "react";
import * as strings from "SideNavigationWebPartStrings";

const textFieldStyles: Partial<ITextFieldStyles> = {
  fieldGroup: {
    marginBottom: "5px",
    fontSize: "1rem",
  },
};

function PanelContext({ sp, options }: any) {
  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] =
    useBoolean(false);
  const [error, setError] = useState(true);
  const [title, setTitle] = useState("");
  const [b1, setb1] = useState(false);

  const Save = async (): Promise<any> => {
    setb1(true);
    if (!title) {
      setError(true);
    } else {
      await sp.web.lists
        .getByTitle("Side Navigation Contexts")
        .items.add({
          Title: title,
        })
        .then((res: any) => {
          options.push({
            text: res.data.Title,
            key: res.data.ID,
          });
        });
      dismissPanel();
    }
    console.log(error, b1);
  };

  const onRenderFooterContent = (): any => (
    <div className={styles.footer}>
      <DefaultButton className={styles.font} onClick={Save}>
        {strings.save}
      </DefaultButton>
      <PrimaryButton className={styles.font} onClick={dismissPanel}>
        {strings.cancel}
      </PrimaryButton>
    </div>
  );

  const changeTitle = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: any
  ): void => {
    // setError(false);
    setTitle(newValue);
  };

  return (
    <div>
      <Icon onClick={openPanel} className={styles.themeColor} iconName="Add" />
      <Panel
        headerText={"Context"}
        headerClassName={styles.headerPanel}
        isOpen={isOpen}
        onDismiss={dismissPanel}
        closeButtonAriaLabel={""}
        isFooterAtBottom={true}
        onRenderFooterContent={onRenderFooterContent}
      >
        <TextField
          minLength={1}
          type="text"
          onChange={changeTitle}
          label={strings.title}
          placeholder={strings.insertTitleHere}
          value={title}
          styles={textFieldStyles}
        />
      </Panel>
    </div>
  );
}

export default PanelContext;
