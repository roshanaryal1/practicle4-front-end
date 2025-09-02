import { render, screen } from '@testing-library/react';
import App from './App';

test('renders practical 4 application', () => {
  render(<App />);
  const headerElement = screen.getByText(/Practical 4 - Full Stack Application/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders navigation links', () => {
  render(<App />);
  const homeLink = screen.getByText(/🏠 Home/i);
  const productsLink = screen.getByText(/📦 Products/i);
  const attendantsLink = screen.getByText(/👥 Attendants/i);
  
  expect(homeLink).toBeInTheDocument();
  expect(productsLink).toBeInTheDocument();
  expect(attendantsLink).toBeInTheDocument();
});