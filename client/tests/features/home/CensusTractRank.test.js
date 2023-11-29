import React from 'react';
import { shallow } from 'enzyme';
import { CensusTractRank } from '../../../src/features/home/CensusTractRank';

describe('home/CensusTractRank', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <CensusTractRank {...props} />
    );

    expect(
      renderedComponent.find('.home-census-tract-rank').length
    ).toBe(1);
  });
});
