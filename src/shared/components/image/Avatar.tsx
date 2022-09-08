import React, { FunctionComponent } from 'react';

import './Avatar.scss';
import { Button } from '@blueprintjs/core';

type AvatarProps = {
  image?: any;
  names?: string[];
  inline?: boolean;
  skeleton?: boolean;
  big?: boolean;
  rounded?: boolean;
  headerAvatar?:boolean;
};

function displayImageAvatar({
  image, inline, skeleton, big, rounded, headerAvatar = false,
}: AvatarProps) {
  return (
    <div className={`avatar ${skeleton ? 'bp3-skeleton' : ''}`}>
      {
        headerAvatar ?
          <Button icon={<img
            src={image}
            alt="Avatar"
            className={`avatar__image ${big ? 'big' : ''} ${rounded ? 'rounded' : ''} ${inline ? 'inline' : ''}`}
          />} className='bp3-button navigation-item bp3-large  bp3-minimal'/>:
          <img
            src={image}
            alt="Avatar"
            className={`avatar__image ${big ? 'big' : ''} ${rounded ? 'rounded' : ''} ${inline ? 'inline' : ''}`}
          />
      }
    </div>
  );
}

function displayInitialsAvatar({
  names, inline, skeleton, big, rounded, headerAvatar = false,
}: AvatarProps) {
  const initials = names?.map(name => name.substr(0, 1).toUpperCase()).join('');
  return (
    <div className={`avatar ${skeleton ? 'bp3-skeleton' : ''}`}>
      {
        headerAvatar ?
          <Button className='bp3-button navigation-item bp3-large  bp3-minimal'>{initials}</Button> :
          <div
            className={`avatar__initials ${big ? 'big' : ''} ${rounded ? 'rounded' : ''} ${inline ? 'inline' : ''} `}>
            {initials}
          </div>
      }
    </div>
  );
}

const Avatar: FunctionComponent<AvatarProps> = ({
  image, names, inline, skeleton, big, rounded = true, headerAvatar = false,
}: AvatarProps) => {
  return image ?
    displayImageAvatar({ image, inline, skeleton, big, rounded, headerAvatar }) :
    displayInitialsAvatar({ names, inline, skeleton, big, rounded, headerAvatar });
}

export default Avatar;
