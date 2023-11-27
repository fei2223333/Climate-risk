import React from 'react';
import { shallow } from 'enzyme';
import { UploadComponent } from '../../../src/features/home/UploadComponent';

describe('home/UploadComponent', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <UploadComponent {...props} />
    );

    expect(
      renderedComponent.find('.home-upload-component').length
    ).toBe(1);
  });
});
