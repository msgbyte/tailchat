// mock
jest.mock('tailchat-shared/i18n');
jest.mock('@iconify/react', () => ({
  Icon: ({ icon }) => `[iconify icon="${icon}"]`,
}));
jest.mock('../src/components/Loadable');

const ignoreErroMessages = [
  /Warning.*not wrapped in act/,
  /PluginManifest validation/,
];

// https://github.com/testing-library/react-testing-library#suppressing-unnecessary-warnings-on-react-dom-168
const originalError = console.error;
console.error = (...args) => {
  if (ignoreErroMessages.some((re) => re.test(args[0]))) {
    return;
  }

  originalError.call(console, ...args);
};
