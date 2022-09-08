import React, { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Classes,
  Colors,
  Icon,
  Menu,
  MenuItem,
  MenuDivider,
  Popover,
  Tooltip,
  Position,
  Button,
} from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

import { useNotebookEditable } from "../../../../hooks/use-editable";
import { IDatabase } from "../../../../../../shared/models";

type OnChangeCallback = (value: any) => void;
type SetDBMenuIsOpenCallback = (value: boolean) => void;

interface SelectDatabaseProps {
  currentDatabase: any;
  databases: IDatabase[] | undefined;
  disable: boolean;
  onChange: OnChangeCallback;
  DBMenuIsOpen: boolean;
  setDBMenuIsOpen: SetDBMenuIsOpenCallback;
}

const SelectDatabase = ({
  databases,
  currentDatabase,
  disable,
  onChange,
  DBMenuIsOpen,
  setDBMenuIsOpen
}: SelectDatabaseProps) => {
  const history = useHistory();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const currentDatabaseObj = useMemo(() =>
    currentDatabase && databases ?
      databases.find(database => currentDatabase === database.uid) :
      null,
    [ databases, currentDatabase ]);
  const SelectDatabaseMenuContent = () => (
    <div data-cy='selectDatabasePopover'>
      <Menu className={Classes.ELEVATION_1}>
        <MenuItem textClassName="database__header" text="Select database"/>
        {
          databases && databases.map((database: IDatabase) => (
            <MenuItem
              key={database.uid}
              text={database.database_name}
              disabled={disable}
              labelElement={
                (currentDatabase && currentDatabase === database?.uid)
                && <Icon icon={IconNames.TICK}/>
              }
              onClick={() => onChange(database.uid)}/>
          ))
        }
        <MenuDivider />
        <MenuItem text="New Database" icon={IconNames.ADD} onClick={() => history.push('/d/d/connect')} />
      </Menu>
    </div>
  );
  const editable = useNotebookEditable();
  /*
   * disable - it's based on block UID
   * if true - block has no UID
   * if false - block has UID
   */
  useEffect(() => {
    setIsOpen(!disable && !currentDatabase);
  }, [disable, currentDatabase]);

  useEffect(() => {
    if(DBMenuIsOpen){
      setIsOpen(!disable && !currentDatabase);
    }
  }, [DBMenuIsOpen]);

  if (!editable) {
    /* if notebook is not editable, hide select DB */
    return (
      <Icon
        icon={IconNames.DATABASE}
        color={Colors.GOLD5}/>
    );
  }
  return (
    <Popover
      portalClassName='database-select-menu'
      content={<SelectDatabaseMenuContent/>}
      position={'auto'}
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false);
        setDBMenuIsOpen(false);
      }}
    >
      <Tooltip content={currentDatabaseObj ? `Connected to ${currentDatabaseObj.database_name}` : 'Select Database'}>
        <Button onClick={() => setIsOpen(true)} className='bp3-button bp3-minimal'
                icon={<Icon icon={IconNames.DATABASE} color={currentDatabase ? Colors.BLUE3 : Colors.RED3}/>}/>
      </Tooltip>
    </Popover>
  );
};

export const MemoizedSelectDatabase = React.memo(SelectDatabase);
