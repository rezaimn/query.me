import React, { FunctionComponent } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@blueprintjs/core';

import { IDatabase } from "../../../shared/models";
import {
  BigQueryForm,
  DefaultForm,
  SnowflakeForm
} from './ConnectionForm'
import { isBigQuery, isSnowflake } from "../../../shared/utils/databases";

type OnSubmitCallback = (database: Partial<IDatabase>) => void;

type AddEditFormProps = {
  database: Partial<IDatabase> | null;
  onSubmit: OnSubmitCallback;
  footer?: React.ReactNode;
};

const ownFooter = () => (
  <div className="add-edit-form-footer">
    <Button
      className="submit-button"
      intent="primary"
      type="submit"
    >Connect</Button>
  </div>
);

const AddEditForm: FunctionComponent<AddEditFormProps> = ({
  database, onSubmit, footer
}: AddEditFormProps) => {
  const { handleSubmit, errors, control } = useForm();

  if (!database) {
    return null;
  }

  let FormContent = <DefaultForm database={database} errors={errors} control={control} />
  if (isSnowflake(database.backend || '')) {
    FormContent = <SnowflakeForm database={database} errors={errors} control={control} />
  } else if (isBigQuery(database.backend || '')) {
    FormContent = <BigQueryForm database={database} errors={errors} control={control} />
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <p>If your database is in a VPN, VPC, or behind your company's firewall,
        you'll need to whitelist your IP addresses (see on the right).</p>

        { FormContent }

      </div>

      { footer ? footer : ownFooter() }
    </form>
  )
}

export default AddEditForm;
