import { IListColumn } from '../../models';
import { ListColumn, ListRow } from '../list';
import React from 'react';
import LabelledText from '../form/LabelledText';

export const displayRowsSkeleton = (headers: { [id: string]: IListColumn }) => {
  return (new Array(5).fill(0)).map((_, index) => (
    <ListRow key={`row-${index}`}>
      {
        Object.keys(headers).map((key) => {
          return (
            <ListColumn key={key} properties={headers[key]} skeleton={true} main={true}>
            </ListColumn>
          );
        })
      }
    </ListRow>
  ));
};

export const displayDetailsSkeleton = () => {
  return (
    <>
      {
        new Array(5).fill(0).map((_, index) => (
          <div className={`table-details no-border`} key={`details-row-${index}`}>
            <div className={`table-details__props`}>
              <div className={`table-details__props__left `}>
                <LabelledText inline={true} label="Type" labelUppercase={true} skeleton={true}>
                </LabelledText>
              </div>
              <div className={`table-details__props__right `}>
                <LabelledText inline={true} label="Last used" labelUppercase={true} skeleton={true}>
                </LabelledText>
              </div>
            </div>
          </div>
        ))
      }
    </>
  );
};
