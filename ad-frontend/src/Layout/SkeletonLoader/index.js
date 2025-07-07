// components/FullBodySkeleton.js
import React from 'react';
import Skeleton from 'react-loading-skeleton';

const FullBodySkeleton = () => {
  return (
    <div>
      {/* Skeleton for head */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
        <Skeleton circle={true} height={100} width={100} />
      </div>

      {/* Skeleton for upper body */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Skeleton height={150} width={200} />
      </div>

      {/* Skeleton for lower body */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Skeleton height={150} width={200} />
      </div>
    </div>
  );
};

export default FullBodySkeleton;
