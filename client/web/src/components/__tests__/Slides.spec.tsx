import { render } from '@testing-library/react';
import React from 'react';
import { Slides } from '../Slides';

describe('Slides', () => {
  test('render', () => {
    const wrapper = render(
      <Slides>
        <div>
          <h1>1</h1>
        </div>
        <div>
          <h1>2</h1>
        </div>
        <div>
          <h1>3</h1>
        </div>
      </Slides>
    );
    expect(wrapper.container).toMatchSnapshot();
  });
});
