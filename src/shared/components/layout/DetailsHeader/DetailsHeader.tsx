import React, { FunctionComponent, Fragment } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Colors, Icon, IconName, Button, ButtonGroup, Popover, Position, Breadcrumbs, IBreadcrumbProps } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

import './DetailsHeader.scss';
import Avatar from '../../image/Avatar';

type OnCloseCallback = () => void;
type OnActionCallback = () => void;

type DetailsHeaderProps = {
  icon?: any;
  iconBackgroundColor?: string;
  noIconBackground?: boolean;
  label: string;
  image?: any;
  breadcrumb?: IBreadcrumbProps[] | null;
  detailsLink?: string | null;
  actionElement?: any;
  actionLabel?: string;
  actionIcon?: IconName;
  backUrl?: string;
  fromDetails?: boolean;
  fromDrawer?: boolean;
  menuContent?: any;
  mode?: string;
  tags?: string[];
  extendedPanel?: any;
  width?: string;
  headerClassName?: string;
  closeIcon?: IconName;
  closeIconSize?: number;
  onClose?: OnCloseCallback;
  onAction?: OnActionCallback;
};

export const DetailsHeader: FunctionComponent<DetailsHeaderProps> = ({
  icon, iconBackgroundColor, noIconBackground, label, image, breadcrumb,
  detailsLink, actionElement: ActionElement, actionLabel, actionIcon, menuContent,
  onClose, onAction, backUrl, fromDrawer, fromDetails,
  mode = 'simple', extendedPanel, width, headerClassName,
  closeIcon, closeIconSize
}: DetailsHeaderProps) => {
  const history = useHistory();

  const onOpenDetails = () => {
    if (detailsLink) {
      history.push(detailsLink);
    }
  };

  const displayHints = ({
    icon, iconBackgroundColor, noIconBackground, label, breadcrumb, actionLabel, actionIcon,
    onClose, onAction, backUrl, fromDrawer, fromDetails
  }: DetailsHeaderProps) => {
    return (
      <Fragment>
        <div className={`details__header__title ${fromDetails ? 'no-gutter': ''}`}>
          {
            fromDetails && backUrl && (
              <div className="details__header__title__back">
                <Link to={backUrl}>
                  <Icon
                    icon={IconNames.CHEVRON_LEFT}
                    iconSize={22}
                    color={Colors.GRAY3}
                  />
                </Link>
              </div>
            )
          }
          {
            icon && !breadcrumb && (
              <div
                className={`details__header__title__icon ${noIconBackground ? 'no-icon-background' : ''}`}
                style={{ backgroundColor: iconBackgroundColor }}
              ><Icon icon={icon} iconSize={18} /></div>
            )
          }
          {
            breadcrumb ? (
              <Breadcrumbs
                items={breadcrumb}
              />
            ) : (
              <div
                className="details__header__title__label"
                onClick={onOpenDetails}
              >{label}</div>
            ) }
        </div>
        <div className="details__header__toolbar">
          <ButtonGroup className="details__header__toolbar__action">
            {
              (ActionElement && <ActionElement />)
            }
            {
              (!ActionElement && actionLabel && actionIcon) && (
                <Button
                  icon={actionIcon}
                  onClick={() => onAction && onAction()}
                >{actionLabel}</Button>
              )
            }
            {
              (fromDrawer && menuContent) && (
                <Popover
                  content={menuContent}
                  position={Position.BOTTOM_RIGHT}
                >
                  <Button rightIcon={IconNames.MORE}></Button>
                </Popover>
              )
            }
          </ButtonGroup>
          {
            fromDrawer && (
              <Button
                icon={closeIcon || IconNames.CROSS}
                color={Colors.GRAY3}
                minimal={true}
                className="details__header__toolbar__close"
                onClick={() => onClose && onClose()}
              />
            )
          }
        </div>
      </Fragment>
    );
  };

  return (
    <header
      className={`details__header ${fromDetails ? 'with-border': ''} ${mode ? 'extended-height' : ''} ${headerClassName ? headerClassName : ''}`}
      style={{width}}
    >
      { mode === 'simple' ?
        displayHints({
          icon, iconBackgroundColor, noIconBackground, label,
          breadcrumb, detailsLink, actionLabel, actionIcon,
          onClose, onAction, backUrl, fromDrawer, fromDetails
        }) : (
          <Fragment>
            <div className="details__header__left">
              <Avatar image={image} names={label ? label.split(' ') : []} big={true} />
            </div>
            <div className="details__header__right">
              <div className="details__header__right__bar">
                { displayHints({
                  icon, iconBackgroundColor, label, detailsLink, actionLabel, actionIcon,
                  onClose, onAction, backUrl, fromDrawer, fromDetails
                }) }
              </div>
              <div className="details__header__right__extended">
                { extendedPanel }
              </div>
            </div>
          </Fragment>
        )
      }
    </header>
  );
};
