import React, {Fragment, FunctionComponent, useState} from 'react';

import FormElement from '../../../../shared/components/form/FormElement';
import {IDatabase} from "../../../../shared/models";

type SnowflakeFormProps = {
  database: Partial<IDatabase> | null;
  errors: any;
  control: any;
};

export const SnowflakeForm: FunctionComponent<SnowflakeFormProps> = ({
 database, errors, control
}: SnowflakeFormProps) => {
  if (!database) {
    return null;
  }

  return (
    <Fragment>
      <FormElement
        id="name"
        label="Display Name"
        defaultValue={database && database.database_name}
        errorMessage="This display name is required"
        formConfig={{control, errors}}
        rules={{required: true}}
        placeholder="Enter a display name"/>
      <FormElement
        id="account"
        label="Account"
        defaultValue={database && database.account}
        errorMessage="Account name is required"
        formConfig={{control, errors}}
        rules={{required: true}}
        placeholder="e.g xyz1234.eu-central-1"/>
      <FormElement
        id="database_name"
        label="Database name"
        defaultValue={database && database.database}
        errorMessage="This database name is required"
        formConfig={{control, errors}}
        rules={{required: true}}
        placeholder="e.g. SNOWFLAKE_SAMPLE_DATA" />
      <FormElement
        id="username"
        label="Username"
        defaultValue={database && database.username}
        errorMessage="This username is required"
        formConfig={{control, errors}}
        rules={{required: true}}
        placeholder="Enter username "/>
      <FormElement
        id="password"
        label="Password"
        type="password"
        errorMessage="This password is required"
        formConfig={{control, errors}}
        rules={{required: true}}
        placeholder="Enter password" />
    </Fragment>
  );
}
