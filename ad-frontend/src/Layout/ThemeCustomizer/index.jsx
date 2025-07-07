import React, { Fragment } from 'react';
import { useState } from 'react';
import TabCustomizer from './TabCustomizer';

const Themecustomizer = () => {
  const [selected, setSelected] = useState('check-layout');
  const [openCus, setOpenCus] = useState(false);

  const callbackNav = ((select, open) => {
    setSelected(select);
    setOpenCus(open);
  });

  return (
    <Fragment>
      <div className={`customizer-contain ${openCus ? 'open' : ''}`}>
        <TabCustomizer selected={selected} callbackNavTab={callbackNav} />
      </div>
    </Fragment>
  );
};

export default Themecustomizer;
