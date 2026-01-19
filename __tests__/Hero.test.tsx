import { render, screen } from '@testing-library/react';
import Hero from '@/components/Hero';

describe('Hero', () => {
  it('renders the main heading and primary links', () => {
    render(<Hero />);

    expect(
      screen.getByRole('heading', { name: /hyperion tech hub/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /explore services/i })
    ).toHaveAttribute('href', '#services');
    expect(
      screen.getByRole('link', { name: /get started/i })
    ).toHaveAttribute('href', '/get-started');
  });
});

