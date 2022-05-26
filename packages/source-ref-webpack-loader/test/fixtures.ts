export const tsx = {
  '/src/index.js': `
		import Foo, { HelloWorld } from './foo.tsx'
		export default [
			HelloWorld,
			(new Foo()).render(),
		];
	`,

  '/src/foo.tsx': `
		export const HelloWorld = <><div>hello world</div></>;
		export default class Foo {
			render() {
				return <div className="class-name">content</div>
			}
		}
	`,
};
