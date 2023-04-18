import React from 'react';
import { renderLazy } from '@test/utils/lazy';
import { Markdown } from '../Markdown';

describe('Markdown', () => {
  test('heading', async () => {
    const text = `
# Heading1
## Heading2
### Heading3
#### Heading4
##### Heading5
    `;
    const wrapper = await renderLazy(<Markdown raw={text} />);
    expect(wrapper.container).toMatchSnapshot();
  });

  test('list', async () => {
    const text = `
- 1
- 2
- 3
  - 4
  - 5
    - 6
        `;
    const wrapper = await renderLazy(<Markdown raw={text} />);
    expect(wrapper.container).toMatchSnapshot();
  });

  describe('link', () => {
    const text = `
[https://tailchat.msgbyte.com/](https://tailchat.msgbyte.com/)
[./README.md](./README.md)
![](./demo.jpg)`;

    test('without baseUrl', async () => {
      const wrapper = await renderLazy(<Markdown raw={text} />);
      expect(wrapper.container).toMatchSnapshot();
    });

    test('with baseUrl', async () => {
      const wrapper = await renderLazy(
        <Markdown raw={text} baseUrl="https://tailchat.msgbyte.com/" />
      );
      expect(wrapper.container).toMatchSnapshot();
    });
  });

  test('table', async () => {
    const text = `
| A | B |
| --- | --- |
| 1 | 2 |
| 3 | 4 |
        `;
    const wrapper = await renderLazy(<Markdown raw={text} />);
    expect(wrapper.container).toMatchSnapshot();
  });
});
