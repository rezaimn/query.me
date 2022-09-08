import React, { Fragment, FunctionComponent } from 'react';

import FormElement from '../../../../shared/components/form/FormElement';
import {Grid, GridColumn} from "../../../../shared/components/layout/Grid";
import {IDatabase} from "../../../../shared/models";

type DefaultFormProps = {
  database: Partial<IDatabase> | null;
  errors: any;
  control: any;
};

interface DatabaseNameElementProps {
  database: string | undefined | null; // DB name
  backend: string | undefined | null;
  errors: any;
  control: any;
}

const DatabaseNameElement = React.memo(({ backend, database, control, errors }: DatabaseNameElementProps) => {
  let label = 'Database name';
  let required = true;
  let labelInfo = "";

  if (backend && backend === 'exa') {
    label = 'Schema name';
    required = false;
    labelInfo = '(optional)';
  }

  return (
    <FormElement
        id="database_name"
        label={label}
        labelInfo={labelInfo}
        defaultValue={database}
        errorMessage={'This ' + label.toLowerCase() + ' is required'}
        formConfig={{ control, errors }}
        rules={{ required: required }}
        placeholder={'Enter ' + label.toLowerCase()} />
  );
});


export const DefaultForm: FunctionComponent<DefaultFormProps> = ({
  database, errors, control
}: DefaultFormProps) => {

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
      <Grid size={12}>
        <GridColumn size={8}>
          <FormElement
            id="host"
            label="Host"
            defaultValue={database && database.host}
            errorMessage="This host is required"
            formConfig={{ control, errors }}
            rules={{ required: true }}
            placeholder="Enter host"
          />
        </GridColumn>
        <GridColumn size={4}>
          <FormElement
            id="port"
            label="Port"
            type="number"
            defaultValue={database && database.port}
            errorMessage="This port is required"
            formConfig={{ control, errors }}
            rules={{ required: true }}
            placeholder="Enter port"
          />
        </GridColumn>
      </Grid>
      <DatabaseNameElement
        backend={database && database.backend}
        database={database && database.database}
        control={control}
        errors={errors} />
      <FormElement
        id="username"
        label="Username"
        defaultValue={database && database.username}
        errorMessage="This username is required"
        formConfig={{ control, errors }}
        rules={{ required: true }}
        placeholder="Enter username" />
      <FormElement
        id="password"
        label="Password"
        type="password"
        errorMessage="This password is required"
        formConfig={{ control, errors }}
        rules={{ required: true }}
        placeholder="Enter password" />
    </Fragment>
  );
}
