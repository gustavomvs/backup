import * as React from "react";
import { Dropdown, IDropdownStyles } from "@fluentui/react";
import { useEffect, useState } from "react";
import * as strings from "SideNavigationWebPartStrings";

const dropdownStyles: Partial<IDropdownStyles> = {
  dropdown: { width: "95%", margin: "0 auto" },
};

function DropdownContext({
  op,
  options,
  dropID,
  setcontextID,
  sp,
  updateID,
}: any) {
  const [dropTitle, setDropTitle] = useState("");

  const changePrimary = async (
    event: React.FormEvent<HTMLDivElement>,
    item: any
  ) => {
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
    updateID(item.key);
    setcontextID(item.key);
  };

  const meuInit = async (): Promise<void> => {
    sp.web.lists
      .getByTitle("Side Navigation Contexts")
      .items()
      .then((res: any) => {
        res.map((e: any, i: any) => {
          if (options.length <= i) {
            options.push({
              text: e.Title,
              key: e.ID,
            });
          }
        });
      })
      .then(() => {
        setDropTitle(options.find((e: any) => e.key === dropID).text);
      });
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    meuInit();
  }, []);

  return (
    <div>
      <Dropdown
        placeholder={dropTitle ? dropTitle : strings.selectAContext}
        options={options}
        styles={dropdownStyles}
        onChange={changePrimary}
      />
    </div>
  );
}

export default DropdownContext;
