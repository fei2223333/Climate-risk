import React from 'react';
import { shallow } from 'enzyme';
import { HomeLayout } from '../../../src/features/home/Layout';

describe('home/HomeLayout', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <HomeLayout {...props} />
    );

    expect(
      renderedComponent.find('.home-layout').length
    ).toBe(1);
  });
});
