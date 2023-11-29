import React from 'react';
import { shallow } from 'enzyme';
import { ConanLayout } from '../../../src/features/home/ConanLayout';

describe('home/ConanLayout', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <ConanLayout {...props} />
    );

    expect(
      renderedComponent.find('.home-conan-layout').length
    ).toBe(1);
  });
});
