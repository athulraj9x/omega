import React from 'react';
import "../../../../assets/scss/components/_skeleton-loading.scss";
import { Card, CardBody } from 'reactstrap';

const SkeletonLoading = () => {
  return (
    <Card className='widget-1'>
      <CardBody className='flex-grow-1 align-items-center p-2 px-4' style={{ height: "106px" }}>
        <div className='widget-content flex-grow-1'>
          <div className='widget-round skeleton'>
            {/* Skeleton for icon */}
            {/* <div className='bg-round skeleton-icon m-0'></div> */}
          </div>
          <div className='d-flex flex-column flex-grow-1 gap-1'>
            {/* Skeleton for total */}
            <div className='skeleton-total m-0'></div>
            {/* Skeleton for title */}
            <div className='skeleton-title'></div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default SkeletonLoading;
