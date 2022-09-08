import React, { FunctionComponent } from 'react';
import { NavLink } from 'react-router-dom';

import './LabelWithLegend.scss';

type LabelWithLegendComponentProps = {
  label: string;
  legend: string;
  to?: string;
};

export const LabelWithLegendComponent: FunctionComponent<LabelWithLegendComponentProps> = ({
  label, legend, to
}: LabelWithLegendComponentProps) => {
  return (
    <div className="label-with-legend bp3-text-overflow-ellipsis bp3-fill">
      {
        to ? (
          <NavLink className="label-with-legend__label" to={to}>{label}</NavLink>
        ) : (
          <div className="label-with-legend__label">{label}</div>
        )
      }
      <div className="label-with-legend__legend">{legend}</div>
    </div>
  );
}
