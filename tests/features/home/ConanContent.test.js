import React from 'react';
import { shallow } from 'enzyme';
import { ConanContent } from '../../../src/features/home/ConanContent';

describe('home/ConanContent', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <ConanContent {...props} />
    );

    expect(
      renderedComponent.find('.home-conan-content').length
    ).toBe(1);
  });
});
