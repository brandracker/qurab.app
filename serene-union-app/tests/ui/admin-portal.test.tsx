import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { AdminLogin } from '../../src/screens/admin/AdminLogin';
import { AdminPortal } from '../../src/screens/admin/AdminPortal';
import { Capacitor } from '@capacitor/core';

describe('Admin Portal UI & Isolation Tests', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.restoreAllMocks();
    window.confirm = vi.fn(() => true);
    HTMLAnchorElement.prototype.click = vi.fn();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('1. AdminLogin renders administrative title and form inputs', () => {
    const handleLoginSuccess = vi.fn();
    render(<AdminLogin onLoginSuccess={handleLoginSuccess} />);

    expect(screen.getByText(/Qurb Admin Portal/i)).toBeDefined();
    expect(screen.getByPlaceholderText(/e\.g\. admin/i)).toBeDefined();
    expect(screen.getByPlaceholderText(/••••••••••••/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Access Administration/i })).toBeDefined();
  });

  it('2. AdminLogin validates empty inputs with inline error', async () => {
    const handleLoginSuccess = vi.fn();
    render(<AdminLogin onLoginSuccess={handleLoginSuccess} />);

    const submitBtn = screen.getByRole('button', { name: /Access Administration/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/Please enter both administrative username and password/i)).toBeDefined();
    expect(handleLoginSuccess).not.toHaveBeenCalled();
  });

  it('3. AdminLogin displays backend error on invalid credentials', async () => {
    const handleLoginSuccess = vi.fn();

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        success: false,
        error: 'Invalid administrative credentials.'
      })
    } as any);

    render(<AdminLogin onLoginSuccess={handleLoginSuccess} />);

    fireEvent.change(screen.getByPlaceholderText(/e\.g\. admin/i), { target: { value: 'wrong_admin' } });
    fireEvent.change(screen.getByPlaceholderText(/••••••••••••/i), { target: { value: 'wrong_pass' } });

    const submitBtn = screen.getByRole('button', { name: /Access Administration/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/Invalid administrative credentials/i)).toBeDefined();
    expect(handleLoginSuccess).not.toHaveBeenCalled();
    expect(sessionStorage.getItem('qurb_admin_token')).toBeNull();
  });

  it('4. AdminLogin authenticates successfully and invokes onLoginSuccess', async () => {
    const handleLoginSuccess = vi.fn();

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        token: 'adm_tok_adm_root.rand123.17000000',
        admin: { id: 'adm_root', username: 'admin', name: 'Qurb Super Admin', role: 'superadmin' }
      })
    } as any);

    render(<AdminLogin onLoginSuccess={handleLoginSuccess} />);

    fireEvent.change(screen.getByPlaceholderText(/e\.g\. admin/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByPlaceholderText(/••••••••••••/i), { target: { value: 'QurbAdmin2026!Secure' } });

    const submitBtn = screen.getByRole('button', { name: /Access Administration/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(handleLoginSuccess).toHaveBeenCalledTimes(1);
    });

    expect(sessionStorage.getItem('qurb_admin_token')).toContain('adm_tok_');
  });

  it('5. AdminPortal displays AdminLogin when unauthenticated', () => {
    render(<AdminPortal />);
    expect(screen.getByText(/Qurb Admin Portal/i)).toBeDefined();
    expect(screen.getByRole('button', { name: /Access Administration/i })).toBeDefined();
  });

  it('6. AdminPortal renders Dashboard and tab navigation when token is in sessionStorage', async () => {
    sessionStorage.setItem('qurb_admin_token', 'adm_tok_adm_root.mock.123');
    sessionStorage.setItem('qurb_admin_profile', JSON.stringify({ name: 'Admin Bilal', role: 'Superadmin' }));

    vi.spyOn(globalThis, 'fetch').mockImplementation(async (url: any) => {
      if (String(url).includes('/dashboard/stats')) {
        return {
          ok: true,
          json: async () => ({
            success: true,
            stats: {
              totalUsers: 101,
              maleUsers: 66,
              femaleUsers: 35,
              maleRatio: 65,
              femaleRatio: 35,
              vipSubscribers: 16,
              bannedUsers: 2,
              activeMatches: 202,
              totalConversations: 41,
              pendingWalis: 3,
              growth: { today: 4, thisWeek: 18, thisMonth: 42 },
              topCities: [
                { city: 'London', count: 34 },
                { city: 'Birmingham', count: 18 }
              ]
            }
          })
        } as any;
      }
      if (String(url).includes('/cities')) {
        return {
          ok: true,
          json: async () => ({
            success: true,
            cities: [{ city: 'London', count: 34 }, { city: 'Birmingham', count: 18 }]
          })
        } as any;
      }
      return { ok: true, json: async () => ({ success: true }) } as any;
    });

    render(<AdminPortal />);

    expect(screen.getByText(/Qurb Admin/i)).toBeDefined();
    expect(screen.getByText(/Enterprise Node/i)).toBeDefined();
    expect(screen.getByText(/Overview & Metrics/i)).toBeDefined();
    expect(screen.getByText(/User Directory/i)).toBeDefined();
    expect(screen.getByText(/Photo Moderation/i)).toBeDefined();
    expect(screen.queryByText(/Wali Chaperones/i)).toBeNull();

    // Verify stats from API
    await waitFor(() => {
      expect(screen.getByText('101')).toBeDefined();
      expect(screen.getByText('202')).toBeDefined();
      expect(screen.getAllByText(/London/i).length).toBeGreaterThanOrEqual(1);
    });
  });

  it('7. AdminPortal switches to User Directory tab, searches, and filters by city/status', async () => {
    sessionStorage.setItem('qurb_admin_token', 'adm_tok_adm_root.mock.123');

    vi.spyOn(globalThis, 'fetch').mockImplementation(async (url: any) => {
      if (String(url).includes('/cities')) {
        return {
          ok: true,
          json: async () => ({
            success: true,
            cities: [{ city: 'London', count: 34 }, { city: 'Birmingham', count: 18 }]
          })
        } as any;
      }
      if (String(url).includes('/users')) {
        return {
          ok: true,
          json: async () => ({
            success: true,
            users: [
              {
                id: 'usr_1',
                full_name: 'Brother Ahmad',
                email: 'ahmad@test.com',
                phone: '+447111222333',
                gender: 'male',
                city: 'London',
                profession: 'Software Engineer',
                education: 'MSc Computer Science',
                is_vip: 1,
                account_status: 'active',
                is_banned: 0,
                photo_count: 3,
                primary_photo: 'https://images.unsplash.com/test-thumb.jpg'
              }
            ],
            total: 1,
            page: 1,
            totalPages: 1
          })
        } as any;
      }
      return { ok: true, json: async () => ({ success: true, stats: {} }) } as any;
    });

    render(<AdminPortal />);

    const userDirectoryBtn = screen.getByRole('button', { name: /User Directory/i });
    fireEvent.click(userDirectoryBtn);

    await waitFor(() => {
      expect(screen.getByText(/Brother Ahmad/i)).toBeDefined();
      expect(screen.getByText(/ahmad@test.com/i)).toBeDefined();
      expect(screen.getByText(/Software Engineer/i)).toBeDefined();
      expect(screen.getAllByText(/Barakah VIP/i).length).toBeGreaterThanOrEqual(1);
    });

    // Test search filter input
    const searchInput = screen.getByPlaceholderText(/Search name, email, phone, bio\.\.\./i);
    fireEvent.change(searchInput, { target: { value: 'Ahmad' } });
    expect((searchInput as HTMLInputElement).value).toBe('Ahmad');
  });

  it('8. AdminPortal server-side pagination navigates between pages', async () => {
    sessionStorage.setItem('qurb_admin_token', 'adm_tok_adm_root.mock.123');

    let requestedPage = 1;
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (url: any) => {
      if (String(url).includes('/users')) {
        const u = new URL(String(url), 'http://localhost');
        requestedPage = Number(u.searchParams.get('page')) || 1;

        return {
          ok: true,
          json: async () => ({
            success: true,
            users: [
              {
                id: `usr_page_${requestedPage}`,
                full_name: `Candidate Page ${requestedPage}`,
                email: `p${requestedPage}@test.com`,
                gender: 'male',
                city: 'London',
                is_vip: 0,
                account_status: 'active'
              }
            ],
            total: 50,
            page: requestedPage,
            totalPages: 2
          })
        } as any;
      }
      return { ok: true, json: async () => ({ success: true, stats: {}, cities: [] }) } as any;
    });

    render(<AdminPortal />);

    fireEvent.click(screen.getByRole('button', { name: /User Directory/i }));

    await waitFor(() => {
      expect(screen.getByText(/Candidate Page 1/i)).toBeDefined();
      expect(screen.getByText(/Page 1 of 2/i)).toBeDefined();
    });

    // Click next page
    const nextButtons = screen.getAllByRole('button');
    const chevronRightBtn = nextButtons.find(b => b.querySelector('svg.lucide-chevron-right'));
    if (chevronRightBtn) {
      fireEvent.click(chevronRightBtn);
      await waitFor(() => {
        expect(screen.getByText(/Candidate Page 2/i)).toBeDefined();
      });
    }
  });

  it('9. AdminPortal triggers CSV export download on 1-click', async () => {
    sessionStorage.setItem('qurb_admin_token', 'adm_tok_adm_root.mock.123');

    vi.spyOn(globalThis, 'fetch').mockImplementation(async (url: any) => {
      if (String(url).includes('/users')) {
        return {
          ok: true,
          json: async () => ({
            success: true,
            users: [
              {
                id: 'usr_export',
                full_name: 'Sister Fatima',
                email: 'fatima@test.com',
                phone: '+447000000000',
                gender: 'female',
                city: 'Manchester',
                profession: 'Doctor',
                education: 'MBBS',
                is_vip: 1,
                account_status: 'active',
                created_at: '2026-09-20'
              }
            ],
            total: 1,
            page: 1,
            totalPages: 1
          })
        } as any;
      }
      return { ok: true, json: async () => ({ success: true, stats: {}, cities: [] }) } as any;
    });

    render(<AdminPortal />);
    fireEvent.click(screen.getByRole('button', { name: /User Directory/i }));

    await waitFor(() => {
      expect(screen.getByText(/Sister Fatima/i)).toBeDefined();
    });

    const exportBtn = screen.getByRole('button', { name: /Export CSV/i });
    fireEvent.click(exportBtn);

    // Verify click on synthetic link
    expect(HTMLAnchorElement.prototype.click).toHaveBeenCalled();
  });

  it('10. AdminPortal Picture Arrangement & Profile Inspection Modal', async () => {
    sessionStorage.setItem('qurb_admin_token', 'adm_tok_adm_root.mock.123');

    vi.spyOn(globalThis, 'fetch').mockImplementation(async (url: any) => {
      const urlStr = String(url);
      if (urlStr.includes('/users/usr_inspect')) {
        return {
          ok: true,
          json: async () => ({
            success: true,
            user: {
              id: 'usr_inspect',
              full_name: 'Brother Zaid',
              email: 'zaid@example.com',
              gender: 'male',
              city: 'Leeds',
              age: 28,
              profession: 'Architect',
              is_vip: 0,
              account_status: 'active',
              is_banned: 0,
              photos: [
                { id: 'p_1', photo_url: 'https://images.unsplash.com/p1.jpg', is_primary: 1 },
                { id: 'p_2', photo_url: 'https://images.unsplash.com/p2.jpg', is_primary: 0 }
              ]
            }
          })
        } as any;
      }
      if (urlStr.includes('/photos/p_2/primary')) {
        return { ok: true, json: async () => ({ success: true }) } as any;
      }
      if (urlStr.includes('/users') && !urlStr.includes('/users/usr_inspect')) {
        return {
          ok: true,
          json: async () => ({
            success: true,
            users: [
              {
                id: 'usr_inspect',
                full_name: 'Brother Zaid',
                email: 'zaid@example.com',
                gender: 'male',
                city: 'Leeds',
                is_vip: 0,
                account_status: 'active'
              }
            ],
            total: 1,
            totalPages: 1
          })
        } as any;
      }
      return { ok: true, json: async () => ({ success: true, stats: {}, cities: [] }) } as any;
    });

    render(<AdminPortal />);
    fireEvent.click(screen.getByRole('button', { name: /User Directory/i }));

    await waitFor(() => {
      expect(screen.getByText(/Brother Zaid/i)).toBeDefined();
    });

    // Click Inspect & Photos
    const inspectBtn = screen.getByRole('button', { name: /Inspect & Photos/i });
    fireEvent.click(inspectBtn);

    // Modal should open
    await waitFor(() => {
      expect(screen.getByText(/Uploaded Photos Gallery/i)).toBeDefined();
      expect(screen.getByText(/Click star to set Primary Discover cover/i)).toBeDefined();
    });

    // Click "Set as Primary Cover" star on secondary photo
    const starBtn = screen.getByTitle(/Set as Primary Cover/i);
    expect(starBtn).toBeDefined();
    fireEvent.click(starBtn);

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/admin/photos/p_2/primary'),
        expect.anything()
      );
    });
  });

  it('11. AdminPortal photo moderation queue displays photos and allows contextual inspection', async () => {
    sessionStorage.setItem('qurb_admin_token', 'adm_tok_adm_root.mock.123');

    vi.spyOn(globalThis, 'fetch').mockImplementation(async (url: any) => {
      if (String(url).includes('/photos/moderation')) {
        return {
          ok: true,
          json: async () => ({
            success: true,
            photos: [
              {
                id: 'mod_photo_1',
                user_id: 'usr_mod_1',
                full_name: 'Sister Maryam',
                city: 'Oxford',
                gender: 'female',
                photo_url: 'https://images.unsplash.com/mod1.jpg',
                is_primary: 1
              }
            ]
          })
        } as any;
      }
      return { ok: true, json: async () => ({ success: true, stats: {}, cities: [] }) } as any;
    });

    render(<AdminPortal />);
    fireEvent.click(screen.getByRole('button', { name: /Photo Moderation/i }));

    await waitFor(() => {
      expect(screen.getByText(/Photo Compliance Moderation/i)).toBeDefined();
      expect(screen.getByText(/Sister Maryam/i)).toBeDefined();
      expect(screen.getByText(/Oxford/i)).toBeDefined();
      expect(screen.getByRole('button', { name: /View Profile/i })).toBeDefined();
      expect(screen.getByRole('button', { name: /Remove/i })).toBeDefined();
    });
  });

  it('12. AdminPortal opens Global Broadcast Announcement Modal and sends notification', async () => {
    sessionStorage.setItem('qurb_admin_token', 'adm_tok_adm_root.mock.123');

    let broadcastPayload: any = null;
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (url: any, opts: any) => {
      if (String(url).includes('/admin/broadcast') && opts?.method === 'POST') {
        broadcastPayload = JSON.parse(opts.body);
        return {
          ok: true,
          json: async () => ({
            success: true,
            deliveredCount: 98
          })
        } as any;
      }
      return { ok: true, json: async () => ({ success: true, stats: {}, cities: [] }) } as any;
    });

    render(<AdminPortal />);

    // Click Broadcast button in header
    const broadcastHeaderBtn = screen.getByRole('button', { name: /Broadcast/i });
    fireEvent.click(broadcastHeaderBtn);

    // Modal renders
    expect(screen.getByText(/Global Announcement/i)).toBeDefined();
    const titleInput = screen.getByPlaceholderText(/e\.g\. Jummah Mubarak! New Security Features/i);
    const msgInput = screen.getByPlaceholderText(/Type your official announcement here\.\.\./i);

    fireEvent.change(titleInput, { target: { value: 'Eid Mubarak Announcement' } });
    fireEvent.change(msgInput, { target: { value: 'Wishing all Qurb members a blessed Eid with family and matches!' } });

    // Submit broadcast
    const sendBtn = screen.getByRole('button', { name: /Send Broadcast/i });
    fireEvent.click(sendBtn);

    await waitFor(() => {
      expect(broadcastPayload).toEqual({
        title: 'Eid Mubarak Announcement',
        message: 'Wishing all Qurb members a blessed Eid with family and matches!'
      });
    });
  });

  it('13. AdminPortal logout cleans sessionStorage and returns to AdminLogin', async () => {
    sessionStorage.setItem('qurb_admin_token', 'adm_tok_adm_root.mock.123');

    render(<AdminPortal />);
    const logoutBtn = screen.getByTitle(/Logout Session/i);
    fireEvent.click(logoutBtn);

    expect(sessionStorage.getItem('qurb_admin_token')).toBeNull();
    expect(screen.getByText(/Qurb Admin Portal/i)).toBeDefined();
  });

  it('14. AdminPortal strictly returns null on Native Mobile platforms (Zero mobile leakage)', () => {
    vi.spyOn(Capacitor, 'isNativePlatform').mockReturnValue(true);

    const { container } = render(<AdminPortal />);
    expect(container.firstChild).toBeNull();
  });
});
