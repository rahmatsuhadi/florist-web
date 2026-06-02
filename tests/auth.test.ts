import { describe, it, expect, vi, beforeEach } from 'vitest';
import { encrypt, decrypt } from '@/lib/auth';
import { login, logout } from '@/services/admin/authService';
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
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should reject invalid email', async () => {
    const result = await login('wrong@email.com', 'admin123');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid credentials');
    expect(mockSet).not.toHaveBeenCalled();
  });

  it('should reject invalid password', async () => {
    const result = await login('admin@fleuriste.com', 'wrongpassword');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid credentials');
    expect(mockSet).not.toHaveBeenCalled();
  });

  it('should successfully login with valid credentials', async () => {
    // Generate the matching hash for our test (matches "admin123")
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('admin123', salt);

    // We don't really need to mock bcrypt.compare since we're providing the correct password
    // But since the actual file has a hardcoded hash, "admin123" will match it natively!
    const result = await login('admin@fleuriste.com', 'admin123');

    expect(result.success).toBe(true);
    expect(result.user?.id).toBe('1');
    expect(result.user?.role).toBe('Superadmin');
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
