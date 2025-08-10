import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card, CardContent, CardHeader, CardTitle } from './card';

describe('Card', () => {
  it('renders header, title, and content', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Body</p>
        </CardContent>
      </Card>
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
  });
});
