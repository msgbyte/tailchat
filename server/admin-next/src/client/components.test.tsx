import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { BarChart, Button, Card, LineChart } from './components';

test('renders shared primitives with Arco Design', () => {
  assert.match(renderToStaticMarkup(<Button>Save</Button>), /arco-btn/);
  assert.match(renderToStaticMarkup(<Card>Content</Card>), /arco-card/);
});

test('renders line and bar charts with Recharts', () => {
  const data = [
    { label: 'Monday', value: 3 },
    { label: 'Tuesday', value: 7 },
  ];

  for (const Chart of [LineChart, BarChart]) {
    assert.match(
      renderToStaticMarkup(<Chart data={data} />),
      /recharts-responsive-container/
    );
  }
});

test('styles Arco controls without generic native form overrides', () => {
  const styles = readFileSync(`${__dirname}/styles.css`, 'utf8');

  assert.match(styles, /\.admin-table \.arco-table-th/);
  assert.match(styles, /\.resource-pagination/);
  assert.doesNotMatch(styles, /:where\(input:not/);
});

test('maps Arco dark theme variables to the existing admin palette', () => {
  const styles = readFileSync(`${__dirname}/styles.css`, 'utf8');

  assert.match(styles, /--color-bg-1:\s*var\(--panel\)/);
  assert.match(styles, /--primary-6:\s*var\(--primary-rgb\)/);
  assert.match(styles, /--border-radius-small:\s*var\(--control-radius\)/);
});

test('uses Arco controls for forms, tables, pagination, and confirmations', () => {
  const app = readFileSync(`${__dirname}/App.tsx`, 'utf8');
  const pages = readFileSync(`${__dirname}/pages.tsx`, 'utf8');
  const resources = readFileSync(`${__dirname}/resources.tsx`, 'utf8');

  assert.match(app, /<Input\.Password/);
  assert.match(pages, /<Radio\.Group/);
  assert.match(pages, /<Upload/);
  assert.match(resources, /<Table/);
  assert.match(resources, /<Pagination/);
  assert.match(resources, /<Popconfirm/);
  assert.doesNotMatch(`${pages}\n${resources}`, /window\.confirm/);
});

test('keeps inactive navigation neutral and groups user actions in a dropdown', () => {
  const styles = readFileSync(`${__dirname}/styles.css`, 'utf8');
  const resources = readFileSync(`${__dirname}/resources.tsx`, 'utf8');

  assert.match(styles, /\.sidebar \.nav \.arco-btn-text:not\(\.active\)/);
  assert.match(resources, /<Dropdown/);
  assert.match(resources, /<Menu\.Item key="delete"/);
  assert.match(resources, /icon="more"/);
  assert.match(
    styles,
    /\.user-action-menu \.arco-dropdown-menu-item \{[^}]*grid-template-columns:\s*24px 1fr/
  );
  assert.match(styles, /column-gap:\s*12px/);
});

test('collapses the sidebar to icons on desktop', () => {
  const components = readFileSync(`${__dirname}/components.tsx`, 'utf8');
  const styles = readFileSync(`${__dirname}/styles.css`, 'utf8');

  assert.match(components, /className="icon-button sidebar-toggle"/);
  assert.match(components, /aria-expanded=\{!collapsed\}/);
  assert.match(styles, /\.sidebar-collapsed \.sidebar \{ width: 68px; \}/);
  assert.match(
    styles,
    /\.sidebar-collapsed \.nav button span[^}]*display: none/
  );
});
