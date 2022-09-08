import { IconNames } from '@blueprintjs/icons';

import { IOption } from '../../../../../../shared/components/form/FormSelectElement';

export const typesOptions: IOption[] = [
  { label: 'Bar', value:'bar', icon: IconNames.TIMELINE_BAR_CHART },
  { label: 'Line', value:'lines', icon: IconNames.TIMELINE_LINE_CHART },
  { label: 'Area', value:'area', icon: IconNames.TIMELINE_AREA_CHART },
  { label: 'Pie', value:'pie', icon: IconNames.PIE_CHART },
  { label: 'Scatter', value:'scatter', icon: IconNames.SCATTER_PLOT },
];

export const chartsConfig = {
  bar: {
    mode: 'markers',
    fields: ['x', 'y']
  },
  lines: {
    mode: 'lines',
    fields: ['x', 'y']
  },
  area: {
    mode: 'lines',
    fields: ['x', 'y']
  },
  pie: {
    mode: 'markers',
    fields: ['values', 'labels']
  },
  scatter: {
    mode: 'markers',
    fields: ['x', 'y']
  }
} as any;

interface IPossibleField {
  label: string;
  placeholder: string;
  errorMessage: string;
}

interface IPossibleFields {
  [key: string]: IPossibleField;
}

export const possibleFields: IPossibleFields = {
  x: {
    label: 'X:',
    placeholder: 'Enter a value for x',
    errorMessage: 'X value is required'
  },
  y: {
    label: 'Y:',
    placeholder: 'Enter a value for x',
    errorMessage: 'X value is required'
  },
  values: {
    label: 'Values:',
    placeholder: 'Enter values',
    errorMessage: 'Values are required'
  },
  labels: {
    label: 'Labels:',
    placeholder: 'Enter labels',
    errorMessage: 'Labels are required'
  }
};
  
const normalizeTransform = (transform: any) => {
  const {
    order,
    target,
    targetsrc,
    groups,
    groupssrc,
    type,
    value,
    operation
  } = transform;
  return {
    // Handle the default value of sort
    order: type === 'sort' ? order || 'ascending' : order,
    target,
    targetsrc,
    groups,
    groupssrc,
    type,
    value,
    operation
  };
};
  
const normalizeData = (data: any, displayedFields: any) => {
  const config = chartsConfig[data.type];
  return {
    mode: data.mode,
    sqlBlock: data.sqlBlock,
    transforms: data.transforms ? data.transforms.map((transform: any) => normalizeTransform(transform)) : data.transforms,
    type: data.type,
    ...Object.keys(possibleFields)
      .filter(possibleField => displayedFields[possibleField])
      .map((possibleField: string) => {
        const fieldValue = data[possibleField];
        const fieldsrcValue = data[`${possibleField}src`];
        return {
          [`${possibleField}src`]: fieldsrcValue,
          [possibleField]: fieldValue,
        };
            })
      .reduce((acc, fields) => ({
        ...acc,
        ...fields
      }), {}),
  };
};

export const checkDataUpdated = (data1: any, data2: any, displayedFields: any) => {
  const normalizedData1 = normalizeData(data1, displayedFields);
  const normalizedData2 = normalizeData(data2, displayedFields);
  return JSON.stringify(normalizedData1) !== JSON.stringify(normalizedData2);
};

export const checkAllDataUpdated = (data1: any, data2: any) => {
  if (
    data1 && !data2 ||
    !data1 && data2 ||
    data1.length !== data2.length
  ) {
      return true;
  }

  for (let [index, d1] of data1.entries()) {
    const type = d1?.type;
    if (!type) return {};
  
    const configuration = chartsConfig[type];
    const displayedFields = Object.keys(possibleFields).reduce((acc, field) => ({
      ...acc,
      [field]: configuration?.fields?.includes(field)
    }), {});

    const d2 = data2[index];
    const updated = checkDataUpdated(d1, d2, displayedFields);
    if (updated) {
      return updated;
    }
  }

  return false;
};
