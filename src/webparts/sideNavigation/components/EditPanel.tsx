import { useBoolean } from "@fluentui/react-hooks";
import * as React from "react";
import { useState, useEffect } from "react";
import {
  DefaultButton,
  Icon,
  Dropdown,
  IDropdownOption,
  IDropdownStyles,
  ILabelStyleProps,
  ILabelStyles,
  ITextFieldStyles,
  Modal,
  Panel,
  PrimaryButton,
  TextField,
  Toggle,
} from "@fluentui/react";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/attachments";
import styles from "./SideNavigation.module.scss";
import * as strings from "SideNavigationWebPartStrings";

const textFieldStyles: Partial<ITextFieldStyles> = {
  fieldGroup: { marginBottom: "5px", fontSize: "1rem" },
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
}

function EditPanel({
  Title,
  whOpenInNewTab,
  whLink,
  whParentItemId,
  sp,
  ID,
  setDataBase,
  op,
  dropID,
  contextID,
}: any) {
  const SideDefault: Side = {
    Title: Title,
    whOpenInNewTab: whOpenInNewTab,
    whLink: whLink,
    whParentItemId: whParentItemId,
  };

  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] =
    useBoolean(false);

  const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] =
    useBoolean(false);

  const [side, setSide] = useState<Side>(SideDefault);
  const [b1, setb1] = useState(false);
  const [error, setError] = useState(false);
  const [sideTemp, setSideTemp] = useState<Side>(SideDefault);
  const [error2, setError2] = useState(false);

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

  async function meuInit(): Promise<void> {
    op.splice(0, op.length);
    await sp.web.lists
      .getByTitle("Side Navigation")
      .items()
      .then((res: any) => {
        if (op) {
          res.map((e: any) => {
            if (dropID === e.whItemContextId) {
              if (!op.find((el: any) => el.text === e.Title)) {
                op.push({ key: e.ID, text: e.Title });
              }
            }
          });
        }
      });
  }

  useEffect((): void => {
    meuInit();
  }, [dropID, contextID]);

  useEffect((): void => {
    setb1(false);
  }, [side]);

  const del = async (): Promise<any> => {
    try {
      await sp.web.lists
        .getByTitle("Side Navigation")
        .items.getById(ID)
        .delete();
      const x = op.filter((e: any) => e.key !== ID);
      op.splice(0, op.length);
      op.push(...x);
      await sp.web.lists
        .getByTitle("Side Navigation")
        .items()
        .then((res: any) => {
          setDataBase(res);
        });
      dismissPanel();
      setSide({
        Title: "",
        whOpenInNewTab: true,
        whLink: null,
        whParentItemId: null,
      });
    } catch {
      setError2(true);
    }
  };

  const Update = async (): Promise<any> => {
    setb1(true);
    console.log(side);
    if (!side.Title) {
      setError(true);
    } else {
      await sp.web.lists
        .getByTitle("Side Navigation")
        .items.getById(ID)
        .update(side)
        .then((res: any) => {
          const index = op.findIndex((e: any) => e.text === sideTemp.Title);
          op.splice(index, 1, {
            text: side.Title,
            key: ID,
          });
          dismissPanel();
        });

      await sp.web.lists
        .getByTitle("Side Navigation")
        .items()
        .then((res: any) => {
          setDataBase(res);
        });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onRenderFooterContent = (): any => (
    <div className={styles.footer}>
      <div className={styles.gapFooter}>
        <DefaultButton
          className={styles.font}
          disabled={b1}
          onClick={() => {
            setSide({
              Title: Title,
              whOpenInNewTab: whOpenInNewTab,
              whLink: whLink,
              whParentItemId: whParentItemId,
            });
            Update();
          }}
        >
          {strings.save}
        </DefaultButton>
        <PrimaryButton
          className={styles.font}
          onClick={() => {
            setSide(sideTemp);
            dismissPanel();
          }}
        >
          {strings.cancel}
        </PrimaryButton>
      </div>
      <button onClick={showModal}>
        <Icon iconName="Delete" />
      </button>
    </div>
  );

  return (
    <div>
      <Icon
        onClick={() => {
          openPanel();
          setSideTemp(side);
        }}
        className={styles.pencil}
        iconName="PencilReply"
      />
      <Panel
        headerText={strings.panel}
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
          placeholder={side.Title}
          value={side.Title}
          styles={textFieldStyles}
        />
        {error && <div className={styles.error}>{strings.fillInTheTitle}</div>}
        <TextField
          type="text"
          onChange={changeUrl}
          label={"Link"}
          placeholder={side.whLink}
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
          onChange={changePrimary}
          placeholder={strings.insertTheFather}
          options={op.filter((e: any) => e.text !== side.Title)}
        />
      </Panel>

      <Modal
        isOpen={isModalOpen}
        onDismiss={() => {
          hideModal();
          setError2(false);
        }}
      >
        <div className={styles.divModal}>
          <div className={styles.flexButton}>
            <h1 className={styles.realy}>{strings.delete}</h1>
            <button className={styles.closebutton} onClick={hideModal}>
              <Icon iconName="CalculatorMultiply" />
            </button>
          </div>
          <div>{strings.realy}</div>
          {error2 && (
            <div className={styles.error2}>
              Você não pode apagar um pai que contém filhos.
            </div>
          )}
          <div className={styles.divButtons}>
            <DefaultButton
              className={styles.buttonYes}
              onClick={() => {
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                del();
                dismissPanel();
                setSide({
                  Title: "",
                  whOpenInNewTab: true,
                  whLink: null,
                  whParentItemId: null,
                });
              }}
              text={strings.yes}
            />

            <DefaultButton
              className={styles.buttonNo}
              onClick={() => {
                hideModal();
                setError2(false);
              }}
              text={strings.no}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
export default EditPanel;
