import React from 'react';
import { shallow } from 'enzyme';
import { TemplateChart } from '../../../src/features/home/TemplateChart';

describe('home/TemplateChart', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <TemplateChart {...props} />
    );

    expect(
      renderedComponent.find('.home-template-chart').length
    ).toBe(1);
  });
});
