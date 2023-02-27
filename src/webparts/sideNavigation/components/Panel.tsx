import * as React from "react";
import { useState, useEffect } from "react";
import {
  DefaultButton,
  Dropdown,
  IDropdownOption,
  IDropdownStyles,
  IIconProps,
  ILabelStyleProps,
  ILabelStyles,
  ITextFieldStyles,
  Panel,
  PrimaryButton,
  TextField,
  Toggle,
} from "@fluentui/react";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/attachments";
import { CommandButton } from "@fluentui/react/lib/Button";
import styles from "./SideNavigation.module.scss";
import * as strings from "SideNavigationWebPartStrings";
import { useBoolean } from "@fluentui/react-hooks";

const textFieldStyles: Partial<ITextFieldStyles> = {
  fieldGroup: {
    marginBottom: "5px",
    fontSize: "1rem",
  },

  subComponentStyles: { label: getLabelStyles },
};

const toggleStyles: Partial<IDropdownStyles> = {
  label: { fontSize: "0.9rem" },
};

function getLabelStyles(props: ILabelStyleProps): ILabelStyles {
  return {
    root: {
      fontSize: "0.9rem",
    },
  };
}

const dropdownStyles: Partial<IDropdownStyles> = {
  dropdown: { fontSize: "1rem" },
  label: { fontSize: "0.9rem" },
};

interface Side {
  Title: string;
  whOpenInNewTab: boolean;
  whLink: string;
  whParentItemId: number;
  whItemContextId: any;
}

const addIcon: IIconProps = { iconName: "Add", className: styles.icon };

function SidePanel({ contextID, op, sp, setDataBase, dm, dropID }: any) {
  const SideDefault: Side = {
    Title: "",
    whOpenInNewTab: true,
    whLink: null,
    whParentItemId: null,
    whItemContextId: contextID,
  };

  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] =
    useBoolean(false);

  const [side, setSide] = useState<Side>(SideDefault);
  const [error, setError] = useState(false);
  const [b1, setb1] = useState(false);

  const changeTitle = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: any
  ): void => {
    setError(false);
    setSide((old) => ({
      ...old,
      Title: newValue,
    }));
  };

  function changenewAbe(
    _ev: React.MouseEvent<HTMLElement>,
    checked?: boolean
  ): void {
    setSide((old) => ({
      ...old,
      whOpenInNewTab: checked,
    }));
  }

  const changeUrl = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: any
  ): void => {
    setSide((old) => ({
      ...old,
      whLink: newValue,
    }));
  };

  const changePrimary = (
    event: React.FormEvent<HTMLDivElement>,
    item: IDropdownOption
  ): void => {
    setSide((old: any) => ({
      ...old,
      whParentItemId: item.key,
    }));
  };

  const Save = async (): Promise<any> => {
    setb1(true);
    if (!side.Title) {
      setError(true);
    } else {
      await sp.web.lists
        .getByTitle("Side Navigation")
        .items.add(side)
        .then((res: any) => {
          op.push({ key: res.data.ID, text: res.data.Title });
          setDataBase((old: any) => {
            return [...old, res.data];
          });
          dismissPanel();
          setSide((old: any) => ({
            ...old,
            Title: "",
            whOpenInNewTab: true,
            whLink: null,
            whParentItemId: null,
          }));
        });
    }
  };

  async function meuInit(): Promise<void> {
    op.splice(0, op.length);
    await sp.web.lists
      .getByTitle("Side Navigation")
      .items()
      .then((res: any) => {
        if (op) {
          if (op.length < res.length) {
            res.map((e: any) => {
              if (dropID === e.whItemContextId) {
                if (!op.find((el: any) => el.text === e.Title)) {
                  op.push({ key: e.ID, text: e.Title });
                }
              }
            });
          }
        }
      });
  }
  useEffect((): void => {
    meuInit();
  }, [dropID]);

  useEffect((): void => {
    setSide((old: any) => ({
      ...old,
      whItemContextId: contextID,
    }));
  }, [contextID]);

  useEffect((): void => {
    setb1(false);
  }, [side]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onRenderFooterContent = (): any => (
    <div className={styles.footer}>
      <DefaultButton className={styles.font} disabled={b1} onClick={Save}>
        {strings.save}
      </DefaultButton>
      <PrimaryButton
        className={styles.font}
        onClick={() => {
          dismissPanel();
          setSide((old: any) => ({
            ...old,
            Title: "",
            whOpenInNewTab: true,
            whLink: null,
            whParentItemId: null,
          }));
        }}
      >
        {strings.cancel}
      </PrimaryButton>
    </div>
  );
  return (
    <div>
      {dm === 2 && (
        <CommandButton
          onClick={openPanel}
          iconProps={addIcon}
          text={strings.newItem}
          className={styles.newitem}
        />
      )}

      <Panel
        headerText={strings.panel}
        headerClassName={styles.headerPanel}
        isOpen={isOpen}
        onDismiss={() => {
          dismissPanel();
          setSide({
            Title: "",
            whOpenInNewTab: true,
            whLink: null,
            whParentItemId: null,
            whItemContextId: contextID,
          });
        }}
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
          value={side.Title}
          styles={textFieldStyles}
        />
        {error && <div className={styles.error}>{strings.fillInTheTitle}</div>}
        <TextField
          type="text"
          onChange={changeUrl}
          label={"Link"}
          placeholder={"URL"}
          value={side.whLink}
          styles={textFieldStyles}
        />

        <Toggle
          defaultChecked={true}
          label={strings.newAbe}
          onText={strings.yes}
          offText={strings.no}
          onChange={changenewAbe}
          styles={toggleStyles}
        />

        <Dropdown
          label={strings.father}
          styles={dropdownStyles}
          options={op.filter((e: any) => e.text !== side.Title)}
          onChange={changePrimary}
          placeholder={strings.insertTheFather}
        />
      </Panel>
    </div>
  );
}
export default SidePanel;
