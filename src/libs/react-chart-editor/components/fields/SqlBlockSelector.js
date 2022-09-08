import DropdownWidget from '../widgets/Dropdown';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Field from './Field';
import nestedProperty from 'plotly.js/src/lib/nested_property';
import {connectToContainer, connectTransformToTrace, maybeAdjustSrc, maybeTransposeData} from '../../lib';
import {TRANSFORMS_LIST} from '../../lib/constants';
import {getColumnNames} from '../../lib/dereference';

export function attributeIsData(meta = {}) {
  return meta.valType === 'data_array' || meta.arrayOk;
}

function getOptionsForBlock(block) {
  if (!block || !block.results || block.results.length === 0) return [];
  const lastSuccessfulResult = block.results.find(result => result.status === 'success');
  if (!lastSuccessfulResult || !lastSuccessfulResult.value || !lastSuccessfulResult.value.columns) return [];
  return lastSuccessfulResult.value.columns.map(column => ({ value: column.name, label: column.name }));
}

function formatValues(block) {
  if (!block || !block.results || block.results.length === 0) return [];
  const lastSuccessfulResult = block.results.find(result => result.status === 'success');
  if (!lastSuccessfulResult || !lastSuccessfulResult.value || !lastSuccessfulResult.value.columns) return [];
  return lastSuccessfulResult.value.data.reduce((acc, d) => {
    const columns = Object.keys(d);
    for (const column of columns) {
      if (!acc[column]) {
        acc[column] = [];
      }
      acc[column].push(d[column]);
    }
    return acc;
  }, {});
}

export class UnconnectedSqlBlockSelector extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      value: null
    };
    this.onChange = this.onChange.bind(this);
    this.onUpdatePlot = this.onUpdatePlot.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
    this.setLocals(nextProps, nextContext);
  }

  setLocals(props, context) {
    this.dataSources = context.dataSources || {};
    this.dataSourceOptions = context.dataSourceOptions || [];

    this.srcAttr = props.attr + 'src';
    this.srcProperty = nestedProperty(props.container, this.srcAttr).get();
    this.fullValue = this.context.srcConverters
      ? this.context.srcConverters.toSrc(this.srcProperty, props.container.type)
      : this.srcProperty;

    this.hasData = props.container ? props.attr in props.container : false;
    if (props.originalTraceContainer) {
      const selectedSqlBlock = nestedProperty(props.originalTraceContainer, 'sqlBlock').get();
      if (selectedSqlBlock) {
        this.setState({ value: selectedSqlBlock.uid });
      }
    } else {
      const selectedSqlBlock = nestedProperty(props.container, 'sqlBlock').get();
      if (selectedSqlBlock) {
        this.setState({ value: selectedSqlBlock.uid });
      }
    }
  }

  onSetCurrentBlock(newValue) {
    this.props.onSetCurrentBlock && this.props.onSetCurrentBlock(newValue);
  }

  onChange(newValue, updateState) {
    this.props.onSelectBlock && this.props.onSelectBlock(newValue);
    if (updateState) {
      this.setState({ value: newValue });
    }
  }

  onUpdatePlot(value) {
    const update = {};
    this.setState({ value });
    if (value) {
      const sqlBlock = this.props.blocks.find(block => block.uid === value);
      update.sqlBlock = sqlBlock ? {
        uid: sqlBlock.uid,
        name: sqlBlock.name
      } : null;
      const options = getOptionsForBlock(sqlBlock);
      const values = formatValues(sqlBlock);
      update.options = options;
      update.possibleValues = values;
    }
    this.props.updateContainer(update);
  }


  render() {
    const {label, disabled, blocks} = this.props;
    const {value} = this.state;

    return (
      <Field {...{...this.props, label}}>
        <DropdownWidget
          options={
            blocks ?
              blocks.map(block => ({ value: block.uid, label: block.name || 'Unnamed query' })):
              []
          }
          value={value}
          valueKey="value"
          disabled={disabled}
          onChange={this.onUpdatePlot}
          placeholder={'Choose request...'}
        />
        { /*
          disabled={this.dataSourceOptions.length === 0}
          components={this.props.dataSourceComponents}
        */ }
      </Field>
    );
  }
}

UnconnectedSqlBlockSelector.propTypes = {
  label: PropTypes.string,
  blocks: PropTypes.any,
  onSelectBlock: PropTypes.func,
};

UnconnectedSqlBlockSelector.displayName = 'SqlBlockSelector';


function modifyPlotProps(props, context, plotProps) {
  /* if (
    attributeIsData(plotProps.attrMeta) &&
    context.container &&
    TRANSFORMS_LIST.indexOf(context.container.type) === -1
  ) {
    plotProps.isVisible = true;
  } */
  plotProps.isVisible = true;
}

export default connectToContainer(UnconnectedSqlBlockSelector, {modifyPlotProps});
