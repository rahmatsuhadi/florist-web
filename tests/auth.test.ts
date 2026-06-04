import { describe, it, expect, vi, beforeEach } from 'vitest';
import { encrypt, decrypt } from '@/lib/auth';
import { login, logout, LoginActionState } from '@/services/admin/authService';
import bcrypt from 'bcryptjs';

// Mock the environment variable
vi.stubEnv('JWT_SECRET', 'test-secret-key');

// Mock Next.js cookies
const mockSet = vi.fn();
const mockDelete = vi.fn();
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    set: mockSet,
    delete: mockDelete,
  })),
}));

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

describe('Auth Utilities', () => {
  it('should successfully encrypt and decrypt a payload', async () => {
    const payload = { user: { id: '1', role: 'Superadmin' } };
    const token = await encrypt(payload);

    expect(token).toBeDefined();
    expect(typeof token).toBe('string');

    const decrypted = await decrypt(token);
    expect(decrypted.user).toEqual(payload.user);
  });

  it('should fail to decrypt with wrong payload format if tampered', async () => {
    await expect(decrypt('invalid-token')).rejects.toThrow();
  });
});

describe('Auth Service (Login/Logout)', () => {
  const initialState: LoginActionState = { success: false };

  const createFormData = (email: string, password: string) => {
    const fd = new FormData();
    fd.append('email', email);
    fd.append('password', password);
    return fd;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should reject invalid email', async () => {
    const fd = createFormData('wrong@email.com', 'admin123');
    const result = await login(initialState, fd);
    expect(result.success).toBe(false);
    expect(result.message).toBe('Email atau password salah');
    expect(mockSet).not.toHaveBeenCalled();
  });

  it('should reject invalid password', async () => {
    const fd = createFormData('admin@fleuriste.com', 'wrongpassword');
    const result = await login(initialState, fd);
    expect(result.success).toBe(false);
    expect(result.message).toBe('Email atau password salah');
    expect(mockSet).not.toHaveBeenCalled();
  });

  it('should successfully login with valid credentials', async () => {
    // Generate the matching hash for our test (matches "admin123")
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('admin123', salt);

    const fd = createFormData('admin@fleuriste.com', 'admin123');
    const result = await login(initialState, fd);
    
    // redirect is called so the function will not return {success: true, user: ...} anymore
    // but we can check if cookie was set
    expect(mockSet).toHaveBeenCalledWith(
      'admin_session',
      expect.any(String),
      expect.objectContaining({ httpOnly: true })
    );
  });

  it('should successfully logout', async () => {
    const result = await logout();
    expect(result.success).toBe(true);
    expect(mockDelete).toHaveBeenCalledWith('admin_session');
  });
});
