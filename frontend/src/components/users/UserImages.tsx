import React from 'react';
import Avatar from './UserAvatar';

const UserImage = () => {


  return (
    <div className="flex flex-row items-center justify-center w-full bg-gray-100 bg-opacity-0 p-4 space-x-8" >
      <Avatar index={0}/>
      <Avatar index={1}/>
      <Avatar index={2}/>
      <Avatar index={3}/>
      <Avatar index={4}/>
    </div>

  );
}

export default UserImage;