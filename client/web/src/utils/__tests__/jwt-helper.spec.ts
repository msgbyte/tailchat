import { getJWTPayload } from '../jwt-helper';

describe('jwt-helper', () => {
  test('getJWTPayload', () => {
    // 这个case是直接转base64无法正常转换的数据
    const jwt =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiZWFmZGQwYzAtNmRjYy0xMWVhLWEwODctOWQxMTM4OTYzMDhlIiwibmFtZSI6IuWGsOe-vSIsImF2YXRhciI6Imh0dHA6Ly8xMjcuMC4wLjE6MjMyNTYvYXZhdGFyL3RodW1ibmFpbC9iMDkxMWViN2I0ZTQ2MGMzZDBmZjk5NGYzYjhkZWYyZmE0Y2FjMmNiY2MyOTk0ODY1MTllNDdmODc1ODY2NzgwLmpwZyIsImlhdCI6MTU4NTM4NDYwNywiZXhwIjoxNTg1NDcxMDA3LCJpc3MiOiJ0cnBnIn0.Lx26jO8Q4KqNKnpYIKLWqi-pae2kS8C7S2l47IN9jYA';
    const payload = getJWTPayload(jwt);

    expect(payload).toMatchObject({
      uuid: 'eafdd0c0-6dcc-11ea-a087-9d113896308e',
      name: '冰羽',
      avatar:
        'http://127.0.0.1:23256/avatar/thumbnail/b0911eb7b4e460c3d0ff994f3b8def2fa4cac2cbcc299486519e47f875866780.jpg',
      iat: 1585384607,
      exp: 1585471007,
      iss: 'trpg',
    });
  });
});
