import React from 'react';
import { shallow } from 'enzyme';
import { RankTable } from '../../../src/features/home/RankTable';

describe('home/RankTable', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RankTable {...props} />
    );

    expect(
      renderedComponent.find('.home-rank-table').length
    ).toBe(1);
  });
});
