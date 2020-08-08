import React from 'react';
import { T } from '@deity/falcon-i18n';

const Cms = ({ id, path, type }) => (
  <div>
    <h1>
      <T id="cms.title" />
    </h1>
    <p>{`type: ${type}`}</p>
    <p>{`id: ${id}`}</p>
    <p>{`path: ${path}`}</p>
  </div>
);

export default Cms;
