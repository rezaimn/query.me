import React, {Fragment, FunctionComponent, useCallback, useMemo} from 'react';

import FormElement from '../../../../shared/components/form/FormElement';
import {Grid, GridColumn} from "../../../../shared/components/layout/Grid";
import {IDatabase} from "../../../../shared/models";

type BigQueryFormProps = {
  database: Partial<IDatabase> | null;
  errors: any;
  control: any;
};

export const BigQueryForm: FunctionComponent<BigQueryFormProps> = ({
  database, errors, control
}: BigQueryFormProps) => {
  const isJSON = useCallback((value: any) => {
    try {
      JSON.parse(value);
      return true;
    } catch (e) {
      return false;
    }
  }, []);

  return (
    <Fragment>
      <FormElement
        id="name"
        label="Display Name"
        defaultValue={database && database.database_name}
        errorMessage="This display name is required"
        formConfig={{ control, errors }}
        rules={{ required: true }}
        placeholder="Enter a display name" />
      <FormElement
        id="project_id"
        label="Project ID"
        defaultValue={database && database.project_id}
        errorMessage="Project ID is required"
        formConfig={{ control, errors }}
        rules={{ required: true }}
        placeholder="Enter Project ID" />
      <FormElement
        id="dataset"
        label="Dataset"
        labelInfo="(optional)"
        defaultValue={database && database.dataset}
        formConfig={{ control, errors }}
        rules={{}}
        placeholder="Enter dataset" />
      <FormElement
        id="encrypted_extra"
        label="Keyfile JSON"
        errorMessage="Keyfile JSON must contain a valid JSON."
        formConfig={{ control, errors }}
        rules={{ required: true, validate: isJSON }}
        placeholder="Keyfile JSON content" />
    </Fragment>
  );
}
