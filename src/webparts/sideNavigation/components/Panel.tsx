import {
  Dropdown,
  IDropdownOption,
  IDropdownStyles,
  ILabelStyleProps,
  ILabelStyles,
  ITextFieldStyles,
  Panel,
  PrimaryButton,
  TextField,
  Toggle,
} from "office-ui-fabric-react";
import { useBoolean } from "@fluentui/react-hooks";
import * as React from "react";
import { useState, useEffect } from "react";
import { DefaultButton } from "@fluentui/react";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/attachments";
import { CommandButton } from "@fluentui/react/lib/Button";
import styles from "./SideNavigation.module.scss";

const dropdownStyles: Partial<IDropdownStyles> = {
  dropdown: { width: "100%", marginBottom: "5px" },
};

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

interface Side {
  Title: string;
  whOpenInNewTab: boolean;
  whLink: string;
  whParentItemId: number;
}

const optionsPrimary: IDropdownOption[] = [];

function SidePanel({ db, sp, setDataBase }: any) {
  const SideDefault: Side = {
    Title: "",
    whOpenInNewTab: true,
    whLink: null,
    whParentItemId: null,
  };

  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] =
    useBoolean(false);
  const [side, setSide] = useState<Side>(SideDefault);

  const [cr, setCr] = useState(null);

  const meuInit = async (): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    sp.web.lists
      .getByTitle("Side Navigation")
      .items()
      .then((res: any) => {
        setDataBase(res);
      });
  };

  const changeTitle = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: any
  ): void => {
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

  function changecr(
    _ev: React.MouseEvent<HTMLElement>,
    checked?: boolean
  ): void {
    setCr((old: any) => !cr);
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
    setSide((old) => ({
      ...old,
      whParentItemId: Number(item.key),
    }));
  };

  const Save = async (): Promise<void> => {
    await sp.web.lists.getByTitle("Side Navigation").items.add(side);
    setSide(() => ({
      Title: "",
      whOpenInNewTab: true,
      whLink: null,
      whParentItemId: null,
    }));
    dismissPanel();
    changecr;
    return;
  };

  const myPrimary = async () => {
    const langListGlobal: any[] = await sp.web.lists
      .getByTitle("Side Navigation")
      .items();
    langListGlobal.map((e) => {
      optionsPrimary.push({
        key: e.ID,
        text: e.Title,
      });
    });
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    meuInit();
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    myPrimary();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onRenderFooterContent = (): any => (
    <div className={styles.footer}>
      <DefaultButton onClick={Save}>Salvar</DefaultButton>
      <PrimaryButton onClick={dismissPanel}>Cancelar</PrimaryButton>
    </div>
  );
  return (
    <div>
      <CommandButton
        onClick={openPanel}
        text={"+ Novo Item"}
        // className={}
        // styles={hostStyles}
      />
      <Panel
        headerText={"Painel"}
        headerClassName={"1"}
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
          label={"Título"}
          placeholder={"Insira o título aqui"}
          value={side.Title}
          styles={textFieldStyles}
        />
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
          label={"Nova Aba"}
          onText="Sim"
          offText="Não"
          onChange={changenewAbe}
          styles={toggleStyles}
        />

        <Dropdown
          label="Pasta"
          selectedKey={undefined}
          onChange={changePrimary}
          placeholder={"Insira a Pasta"}
          options={optionsPrimary}
          styles={dropdownStyles}
        />
      </Panel>
    </div>
  );
}
export default SidePanel;
