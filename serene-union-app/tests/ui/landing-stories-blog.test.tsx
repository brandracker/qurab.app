import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { LandingPage } from '../../src/components/LandingPage';
import { HalalStoriesPage } from '../../src/components/HalalStoriesPage';
import { BlogPage } from '../../src/components/BlogPage';

describe('Landing Page: Testimonials, Halal Stories & Matrimony Journal Suite', () => {

  beforeEach(() => {
    window.location.hash = '';
  });

  it('1. Renders Testimonials section with all 4 couple reviews and ratings', () => {
    const handleLaunch = vi.fn();
    const handleGetStarted = vi.fn();
    const handleLogin = vi.fn();

    render(
      <LandingPage
        onLaunchWebApp={handleLaunch}
        onGetStarted={handleGetStarted}
        onLogin={handleLogin}
      />
    );

    // Verify Section Header
    expect(screen.getByText(/Blessed Testimonials/i)).toBeDefined();
    expect(screen.getByText(/Words from Real Muslim Couples/i)).toBeDefined();

    // Verify Testimonials Cards
    expect(screen.getAllByText('Zaid & Ayesha').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Tariq & Dr. Fatima').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Hamza & Maryam').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Bilal & Sarah').length).toBeGreaterThanOrEqual(1);

    // Verify Islamic tags and locations
    expect(screen.getAllByText(/London, United Kingdom/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Dallas, Texas, USA/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Toronto, Canada/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Lahore, Pakistan/i).length).toBeGreaterThanOrEqual(1);
  });

  it('2. Renders Halal Stories section and switches to dedicated Halal Stories page', () => {
    const handleLaunch = vi.fn();
    const handleGetStarted = vi.fn();
    const handleLogin = vi.fn();

    render(
      <LandingPage
        onLaunchWebApp={handleLaunch}
        onGetStarted={handleGetStarted}
        onLogin={handleLogin}
      />
    );

    // Verify Halal Stories Section Header
    expect(screen.getByText(/Halal Stories: Sincere Hearts, Blessed Unions/i)).toBeDefined();

    // Verify Featured Story Card Excerpts
    expect(screen.getByText(/Dignity First: How Ayesha’s Father Chaperoned/i)).toBeDefined();

    // Click "Explore All Stories" button in the section
    const exploreBtn = screen.getByRole('button', { name: /Explore All Stories/i });
    expect(exploreBtn).toBeDefined();
    fireEvent.click(exploreBtn);

    // Dedicated Halal Stories Page should now be displayed
    expect(screen.getByText(/Halal Nikahs Completed/i)).toBeDefined();
    expect(screen.getByText(/Wali-Chaperone Supported/i)).toBeDefined();
    expect(screen.getByText(/Avg. Time to Nikah/i)).toBeDefined();
  });

  it('3. Renders Blog & Matrimony Journal section and switches to dedicated Blog page', () => {
    const handleLaunch = vi.fn();
    const handleGetStarted = vi.fn();
    const handleLogin = vi.fn();

    render(
      <LandingPage
        onLaunchWebApp={handleLaunch}
        onGetStarted={handleGetStarted}
        onLogin={handleLogin}
      />
    );

    // Verify Blog Section Header
    expect(screen.getByText(/The Qurb Matrimony Journal/i)).toBeDefined();

    // Verify Featured Article Card
    expect(screen.getByText(/The Etiquette of Halal Courtship: Moving from Salam to Nikah with Haya/i)).toBeDefined();

    // Click "Visit Full Blog" button
    const visitBlogBtn = screen.getByRole('button', { name: /Visit Full Blog/i });
    expect(visitBlogBtn).toBeDefined();
    fireEvent.click(visitBlogBtn);

    // Dedicated Blog Page should now be rendered
    expect(screen.getByText(/Knowledge & Sunnah Wisdom for/i)).toBeDefined();
    expect(screen.getByPlaceholderText(/Search articles on Mahr, Wali, courtship, Istikhara/i)).toBeDefined();
  });

  it('4. HalalStoriesPage allows category filtering and reading a full story modal', () => {
    const handleBack = vi.fn();
    const handleGetStarted = vi.fn();
    const handleLogin = vi.fn();

    render(
      <HalalStoriesPage
        onBackToLanding={handleBack}
        onGetStarted={handleGetStarted}
        onLogin={handleLogin}
      />
    );

    // Verify filter categories
    const revertBtn = screen.getByRole('button', { name: 'Revert Journey' });
    expect(revertBtn).toBeDefined();
    fireEvent.click(revertBtn);

    // Verify filtered story appears
    expect(screen.getByText(/Brother Yusuf & Sister Aminah/i)).toBeDefined();

    // Click "Read Full Halal Story"
    const readStoryBtn = screen.getByRole('button', { name: /Read Full Halal Story/i });
    fireEvent.click(readStoryBtn);

    // Verify Story Reader Modal content
    expect(screen.getByText(/The Wali’s Chaperoning & Family Blessing/i)).toBeDefined();
    expect(screen.getByText(/From Salam to Nikah: The Timeline/i)).toBeDefined();
    expect(screen.getByText(/Their Advice to Marriage Seekers/i)).toBeDefined();

    // Close Modal
    const closeBtns = screen.getAllByRole('button', { name: /Close Story/i });
    fireEvent.click(closeBtns[0]);
    expect(screen.queryByText(/From Salam to Nikah: The Timeline/i)).toBeNull();

    // Back to Home
    const backBtn = screen.getByRole('button', { name: /Back to Home/i });
    fireEvent.click(backBtn);
    expect(handleBack).toHaveBeenCalledTimes(1);
  });

  it('5. BlogPage supports search filtering and reading full article modal', () => {
    const handleBack = vi.fn();
    const handleGetStarted = vi.fn();
    const handleLogin = vi.fn();

    render(
      <BlogPage
        onBackToLanding={handleBack}
        onGetStarted={handleGetStarted}
        onLogin={handleLogin}
      />
    );

    // Search for "Mahr"
    const searchInput = screen.getByPlaceholderText(/Search articles on Mahr, Wali, courtship, Istikhara/i);
    fireEvent.change(searchInput, { target: { value: 'Mahr' } });

    expect(screen.getByText(/Understanding Mahr in Islam: Rights, Wisdom, and Avoiding Extravagance/i)).toBeDefined();

    // Open article modal
    const readBtn = screen.getByText(/Understanding Mahr in Islam: Rights, Wisdom, and Avoiding Extravagance/i);
    fireEvent.click(readBtn);

    // Verify Article Reader Modal content
    expect(screen.getByText(/The True Meaning of Mahr/i)).toBeDefined();
    expect(screen.getByText(/The Barakah of Simplicity/i)).toBeDefined();
    expect(screen.getByText(/Summary Takeaways/i)).toBeDefined();

    // Close Article Modal
    const closeBtns = screen.getAllByRole('button', { name: /Close Article/i });
    fireEvent.click(closeBtns[0]);
    expect(screen.queryByText(/Summary Takeaways/i)).toBeNull();

    // Back to Home
    const backBtn = screen.getByRole('button', { name: /Back to Home/i });
    fireEvent.click(backBtn);
    expect(handleBack).toHaveBeenCalledTimes(1);
  });

});
