import { render, screen } from '@testing-library/react';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }) => <div data-testid="browser-router">{children}</div>,
  Routes: ({ children }) => <div data-testid="routes">{children}</div>,
  Route: ({ element }) => <div data-testid="route">{element}</div>,
  Link: ({ children, to, ...props }) => <a href={to} {...props}>{children}</a>,
}));

import App from './App';

test('renders application without crashing', () => {
  render(<App />);
  // Check if the router wrapper is rendered
  expect(screen.getByTestId('browser-router')).toBeInTheDocument();
});

test('renders basic app structure', () => {
  render(<App />);
  // Basic structure test - the app should render without errors
  const routerElement = screen.getByTestId('browser-router');
  expect(routerElement).toBeInTheDocument();
});