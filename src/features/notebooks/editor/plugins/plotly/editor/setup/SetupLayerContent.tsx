import React, { FunctionComponent, useMemo, useEffect, useCallback, useRef, memo } from 'react';
import { IconNames } from '@blueprintjs/icons';
import { useForm } from 'react-hook-form';

import './SetupLayerContent.scss';
import { IOption } from '../../../../../../../shared/components/form/FormSelectElement';
import { useDataSources } from '../PlotlyEditorContext';
import { ConnectedFormSelectElement } from './ConnectedFormSelectElement';
import { ConnectedFormEditableFilters } from './EditableFilters';
import { chartsConfig, typesOptions, possibleFields, checkDataUpdated } from '../utils';

const getValues = (results: any[], fieldName: string) => {
  if (results?.length > 0) {
    const firstResults = results[0];
    return firstResults?.value?.data?.map((result: any) => result[fieldName]);
  }
  return null;
};

const getPossibleValues = (results: any[]) => {
  return (results?.length > 0) ? results[0] : null;
};

const formatDefaultField = (newData: any, selectedDatasource: any, possibleFields: any, possibleField: any) => {
  const possibleFieldConfig = possibleFields[possibleField];
  const fieldValue = newData[`${possibleField}src`];
  return {
    [`${possibleField}src`]: fieldValue?.value ? fieldValue.value : undefined,
    [possibleField]: fieldValue?.value ? getValues(selectedDatasource.results, fieldValue.value) : undefined,
  };
};

const formatTransforms = (newData: any, selectedDatasource: any) => {
  const filters = newData.filters?.map((filter: any) => ({
    target: filter.value ? getValues(selectedDatasource.results, filter.value) : undefined,
    targetsrc: filter.value,
    type: 'filter',
    operation: filter.operation,
    enabled: true,
    value: filter.expression
  })) || [];
  const groupBy = newData.groupBy?.value ? [
    {
      groups: newData.groupBy ? getValues(selectedDatasource.results, newData.groupBy) : undefined,
      groupssrc: newData.groupBy.value,
      type: 'aggregate',
    }
  ] : [];
  const sortBy = newData.sortBy?.map((sort: any) => ({
    target: sort.value ? getValues(selectedDatasource.results, sort.value) : undefined,
    targetsrc: sort.value,
    type: 'sort',
    order: sort.order
  })) || [];

  return [
    ...filters,
    ...sortBy,
    ...groupBy
  ];
};

const formatData = (
  newData: any,
  previousData: any,
  selectedDatasource: any,
  displayedFields: { [key: string]: boolean }
) => {
  const { datasource, chartType } = newData;
  return {
    ...previousData,
    mode: chartType ? chartsConfig[chartType.value].mode : null,
    sqlBlock: datasource ? ({ name: datasource.label, uid: datasource.value }) : null,
    type: chartType ? chartType.value : null,
    possibleValues: getPossibleValues(selectedDatasource.results),
    ...Object.keys(possibleFields)
      .filter(possibleField => displayedFields[possibleField])
      .map((possibleField: string) => {
        return formatDefaultField(newData, selectedDatasource, possibleFields, possibleField);
      })
      .reduce((acc, fields) => ({
        ...acc,
        ...fields
      }), {}),
    transforms: formatTransforms(newData, selectedDatasource)
  };
};

type OnChangeCallback = (data: any, index: number) => void;

interface SetupLayerContentProps {
  data: any;
  index: number;
  onChange: OnChangeCallback;
}

const InternalSetupLayerContent : FunctionComponent<SetupLayerContentProps> = ({
  data, index, onChange
}) => {
  const { handleSubmit, errors, control, watch } = useForm();
  const initializedRef = useRef(false);
  const formData = watch();
  const dataSources = useDataSources();

  const dataSourcesOptions = useMemo(() => {
    return dataSources.map((dataSource: any) => ({
      label: dataSource.name,
      value: dataSource.uid
    }));
  }, [ dataSources ]);

  const fieldsOptions = useMemo(() => {
    if (data?.sqlBlock?.uid) {
      const dataSource = dataSources.find((ds: any) => ds.uid === data.sqlBlock.uid);
      if (dataSource?.results?.length > 0) {
        const fields = dataSource?.results[0].value.columns
          .map((column: any) => ({ label: column.name, value: column.name }));
        return [ { label: '-', value: '' } ].concat(fields);
      }
    }
    return [];
  }, [ dataSources, data?.sqlBlock ]);

  const displayedFields = useMemo(() => {
    const type = data?.type;
    if (!type) return {};
  
    const configuration = chartsConfig[type];
    return Object.keys(possibleFields).reduce((acc, field) => ({
      ...acc,
      [field]: configuration?.fields?.includes(field)
    }), {});
  }, [ data, chartsConfig ]) as any;

  const transforms = useMemo(() => {
    return data?.transforms?.reduce((acc: any, d: any) => {
      return {
        ...acc,
        [d.type]: (acc[d.type] || []).concat({
          value: d.type === 'aggregate' ? d.groupssrc: d.targetsrc,
          label: d.type === 'aggregate' ? d.groupssrc: d.targetsrc,
          operation: d.operation,
          order: d.type === 'sort' ? d.order || 'ascending' : undefined,
          expression: d.value
        })
      };
    }, {});
  }, [ data ]);

  useEffect(() => {
    initializedRef.current = false;
  }, [ data, index ]);

  useEffect(() => {
    if (formData && formData.datasource) {
      const selectedDatasource = dataSources.find((ds: any) => ds.uid === formData.datasource.value);
      const formattedData = formatData(formData, data, selectedDatasource, displayedFields);
      const alignedData = Object.keys(data).reduce((acc, key) => {
        if (formattedData.hasOwnProperty(key)) {
          return {
            ...acc,
            [key]: data[key]
          }
        }
        return acc;
      }, {});

      // We should prevent from triggering handleChange when the content
      // not changed. Typically, it's to prevent side effects when adding
      // not layers
      if (checkDataUpdated(formattedData, alignedData, displayedFields)) {
        initializedRef.current = false;
        handleChange(formattedData);
      }
    }
  }, [ formData, dataSources ]);

  const handleChange = useCallback((newData) => {
    onChange(newData, index);
  }, [ index ]);

  return (
    <div className="layer-content">
      <form onSubmit={handleSubmit(handleChange)}>
        <ConnectedFormSelectElement
          id="datasource"
          label="Datasources:"
          width="150px"
          options={dataSourcesOptions}
          placeholder="Enter a datasource"
          errorMessage="Datasource is required"
          selectedValue={data?.sqlBlock?.uid}
          control={control}
          errors={errors}
        />
        <ConnectedFormSelectElement
          id="chartType"
          label="Chart Type:"
          options={typesOptions}
          placeholder="Enter a chart type"
          errorMessage="Chart type is required"
          selectedValue={data?.type}
          control={control}
          errors={errors}
        />
        {
            Object.keys(possibleFields)
              .filter(possibleField => displayedFields[possibleField])
              .map((possibleField: string) => {
                const possibleFieldConfig = possibleFields[possibleField];
                return (
                  <ConnectedFormSelectElement
                    id={`${possibleField}src`}
                    label={possibleFieldConfig.label}
                    options={fieldsOptions}
                    placeholder={possibleFieldConfig.placeholder}
                    errorMessage={possibleFieldConfig.errorMessage}
                    selectedValue={data?.[`${possibleField}src`]}
                    control={control}
                    errors={errors}
                  />
                );
              })
        }
        { transforms && (
          <>
            <ConnectedFormSelectElement
              id="groupBy"
              label="group by:"
              width="150px"
              options={fieldsOptions}
              placeholder="Enter a field name"
              errorMessage=""
              selectedValue={transforms.aggregate?.length > 0 ? transforms.aggregate[0].value : null}
              control={control}
              errors={errors}
            />
            <ConnectedFormEditableFilters
              id="sortBy"
              label="Sort by:"
              width="150px"
              items={fieldsOptions}
              additionalFields={['order']}
              defaultValue={transforms.sort}
              errorMessage=""
              control={control}
              errors={errors}
            />
            <ConnectedFormEditableFilters
              id="filters"
              label="Filter by:"
              width="150px"
              items={fieldsOptions}
              additionalFields={['operation', 'expression']}
              defaultValue={transforms.filter}
              errorMessage=""
              control={control}
              errors={errors}
            />
          </>
        ) }
      </form>
    </div>
  )
};

export const SetupLayerContent = memo(InternalSetupLayerContent);
