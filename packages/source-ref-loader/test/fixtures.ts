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
		export const HelloWorld2 = <React.Fragment><div>hello world</div></React.Fragment>;
		export const HelloWorld3 = <Fragment><div>hello world</div></Fragment>;
		export default class Foo {
			render() {
				return <div className="class-name">content</div>
			}
		}
	`,
};
