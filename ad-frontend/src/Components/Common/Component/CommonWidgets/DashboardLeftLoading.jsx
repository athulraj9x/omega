import React from 'react';
import { Col } from 'reactstrap';
import { H4, LI, UL } from '../../../../AbstractElements';
import "./DashboardLeftLoading.scss"

const OrderContentSkeleton = () => {
  return (
    <div className='d-flex align-items-center flex-wrap gap-1'>
      <Col className='p-0 d-flex justify-content-center flex-grow-1'>
        <div className='recent-chart skeleton-chart'></div>
      </Col>
      <Col className='flex-grow-1'>
        <UL attrUL={{ className: 'order-content ' }}>
          <li className='skeleton-order'>
            <div>
              <span className='f-light f-w-500'>&nbsp;</span>
              <H4 attrH4={{ className: 'mt-1 mb-0' }}>&nbsp;</H4>
            </div>
          </li>
          <li className='skeleton-order'>
            <div>
              <span className='f-light f-w-500'>&nbsp;</span>
              <H4 attrH4={{ className: 'mt-1 mb-0' }}>&nbsp;</H4>
            </div>
          </li>
        </UL>
      </Col>
    </div>
  )
};

export { OrderContentSkeleton };