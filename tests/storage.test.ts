import { describe, it, expect, vi, beforeEach } from 'vitest';
import { uploadImageAction, removeImageAction } from '@/services/admin/storageService';

// Mock getSupabase
const mockUpload = vi.fn();
const mockRemove = vi.fn();
const mockGetPublicUrl = vi.fn();
const mockListBuckets = vi.fn();
const mockCreateBucket = vi.fn();

vi.mock('@/lib/supabase', () => ({
  getSupabase: () => ({
    storage: {
      from: vi.fn().mockReturnValue({
        upload: mockUpload,
        remove: mockRemove,
        getPublicUrl: mockGetPublicUrl,
      }),
      listBuckets: mockListBuckets,
      createBucket: mockCreateBucket,
    }
  })
}));

describe('Storage Service Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockListBuckets.mockResolvedValue({ data: [{ name: 'florist-images' }], error: null });
  });

  describe('uploadImageAction', () => {
    it('should upload image and return public URL', async () => {
      // Mock FormData
      const formData = new FormData();
      const mockFile = new File(['test image content'], 'test.png', { type: 'image/png' });
      formData.append('file', mockFile);

      // Mock Supabase success response
      mockUpload.mockResolvedValue({ data: { path: 'products/123-test.png' }, error: null });
      mockGetPublicUrl.mockReturnValue({ data: { publicUrl: 'https://mock-supabase.com/storage/v1/object/public/florist-images/products/123-test.png' } });

      const url = await uploadImageAction(formData, 'products');

      expect(mockUpload).toHaveBeenCalled();
      expect(mockGetPublicUrl).toHaveBeenCalledWith('products/123-test.png');
      expect(url).toBe('https://mock-supabase.com/storage/v1/object/public/florist-images/products/123-test.png');
    });

    it('should throw an error if upload fails', async () => {
      const formData = new FormData();
      const mockFile = new File(['test image content'], 'test.png', { type: 'image/png' });
      formData.append('file', mockFile);

      // Mock Supabase error response
      mockUpload.mockResolvedValue({ data: null, error: { message: 'Upload failed' } });

      await expect(uploadImageAction(formData, 'products')).rejects.toThrow('Failed to upload image: Upload failed');
    });
  });

  describe('removeImageAction', () => {
    it('should extract file path from URL and call remove', async () => {
      const testUrl = 'https://mock-supabase.com/storage/v1/object/public/florist-images/products/123-test.png';
      
      // Mock Supabase success response
      mockRemove.mockResolvedValue({ error: null });

      const result = await removeImageAction(testUrl);

      expect(mockRemove).toHaveBeenCalledWith(['products/123-test.png']);
      expect(result).toBe(true);
    });

    it('should return false if image URL is invalid', async () => {
      const invalidUrl = 'https://some-random-url.com/image.png';

      const result = await removeImageAction(invalidUrl);

      // The split logic won't find /florist-images/
      expect(mockRemove).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should return false if remove operation fails', async () => {
      const testUrl = 'https://mock-supabase.com/storage/v1/object/public/florist-images/products/123-test.png';
      
      // Mock Supabase error response
      mockRemove.mockResolvedValue({ error: { message: 'Remove failed' } });

      const result = await removeImageAction(testUrl);

      expect(mockRemove).toHaveBeenCalledWith(['products/123-test.png']);
      expect(result).toBe(false);
    });
  });
});
