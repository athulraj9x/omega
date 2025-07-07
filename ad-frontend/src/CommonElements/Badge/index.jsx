import React from 'react';
import { Badge } from 'reactstrap';

const Badges = (props) => (
  <Badge className='d-flex align-items-center justify-content-center'
    style={{
      width: '30px',
      height: '18px',
      borderRadius: '5px',
    }} {...props.attrBadge}>{props.children}</Badge>
);

export default Badges;