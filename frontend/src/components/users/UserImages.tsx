import React from 'react';
import Avatar from './UserAvatar';

const UserImage = () => {


  return (
    <div className="flex flex-row items-center justify-center w-full bg-gray-100 p-4">
      <Avatar index={1}/>
      <Avatar index={2}/>
      <Avatar index={3}/>
      <Avatar index={4}/>
    </div>

  );
}

export default UserImage;