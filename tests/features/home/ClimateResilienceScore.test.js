import React from 'react';
import { shallow } from 'enzyme';
import { ClimateResilienceScore } from '../../../src/features/home/ClimateResilienceScore';

describe('home/ClimateResilienceScore', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <ClimateResilienceScore {...props} />
    );

    expect(
      renderedComponent.find('.home-climate-resilience-score').length
    ).toBe(1);
  });
});
