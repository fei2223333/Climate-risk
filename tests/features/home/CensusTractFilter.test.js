import React from 'react';
import { shallow } from 'enzyme';
import { CensusTractFilter } from '../../../src/features/home/CensusTractFilter';

describe('home/CensusTractFilter', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <CensusTractFilter {...props} />
    );

    expect(
      renderedComponent.find('.home-census-tract-filter').length
    ).toBe(1);
  });
});
