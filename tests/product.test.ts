import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getProducts, getProductById, createProduct, deleteProduct } from '@/services/admin/productService';

// Mock the DB and Drizzle ORM
const mockSelect = vi.fn();
const mockInsert = vi.fn();
const mockDelete = vi.fn();
const mockFrom = vi.fn();
const mockWhere = vi.fn();
const mockOrderBy = vi.fn();
const mockLimit = vi.fn();
const mockValues = vi.fn();
const mockReturning = vi.fn();

vi.mock('@/db', () => ({
  db: {
    select: (...args: any[]) => {
      mockSelect(...args);
      return {
        from: (...args: any[]) => {
          mockFrom(...args);
          return {
            orderBy: (...args: any[]) => {
              mockOrderBy(...args);
              return mockDbResponses.getProducts;
            },
            where: (...args: any[]) => {
              mockWhere(...args);
              return {
                limit: (...args: any[]) => {
                  mockLimit(...args);
                  return mockDbResponses.getProductById;
                }
              };
            }
          };
        }
      };
    },
    insert: (...args: any[]) => {
      mockInsert(...args);
      return {
        values: (...args: any[]) => {
          mockValues(...args);
          return {
            returning: (...args: any[]) => {
              mockReturning(...args);
              return mockDbResponses.createProduct;
            }
          };
        }
      };
    },
    delete: (...args: any[]) => {
      mockDelete(...args);
      return {
        where: (...args: any[]) => {
          mockWhere(...args);
          return {
            returning: (...args: any[]) => {
              mockReturning(...args);
              return mockDbResponses.deleteProduct;
            }
          };
        }
      };
    }
  }
}));

vi.mock('drizzle-orm', () => ({
  eq: vi.fn(),
  desc: vi.fn(),
}));

let mockDbResponses: any = {
  getProducts: [],
  getProductById: [],
  createProduct: [],
  deleteProduct: [],
};

describe('Product Service Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDbResponses = {
      getProducts: [],
      getProductById: [],
      createProduct: [],
      deleteProduct: [],
    };
  });

  describe('getProducts', () => {
    it('should return an empty array if no products exist', async () => {
      mockDbResponses.getProducts = [];
      const result = await getProducts();
      expect(result).toEqual([]);
      expect(mockSelect).toHaveBeenCalled();
      expect(mockFrom).toHaveBeenCalled();
      expect(mockOrderBy).toHaveBeenCalled();
    });

    it('should correctly format and return the products', async () => {
      mockDbResponses.getProducts = [
        {
          id: 1,
          name: 'Classic Red Rose',
          basePrice: '450000',
          category: 'Bouquet',
          description: 'A classic rose bouquet',
          images: ['img1.jpg'],
          variantGroups: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ];

      const result = await getProducts();
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Classic Red Rose');
      expect(result[0].images).toEqual(['img1.jpg']);
      expect(result[0].variantGroups).toEqual([]);
    });
  });

  describe('getProductById', () => {
    it('should return null if product is not found', async () => {
      mockDbResponses.getProductById = [];
      const result = await getProductById(999);
      expect(result).toBeNull();
      expect(mockWhere).toHaveBeenCalled();
      expect(mockLimit).toHaveBeenCalledWith(1);
    });

    it('should correctly format and return a product if found', async () => {
      mockDbResponses.getProductById = [
        {
          id: 1,
          name: 'Classic Red Rose',
          basePrice: '450000',
          category: 'Bouquet',
          description: 'A classic rose bouquet',
          images: ['img1.jpg'],
          variantGroups: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ];

      const result = await getProductById(1);
      expect(result).not.toBeNull();
      expect(result?.id).toBe(1);
      expect(result?.name).toBe('Classic Red Rose');
    });
  });

  describe('createProduct', () => {
    it('should insert a product and return true', async () => {
      mockDbResponses.createProduct = [{ id: 1, name: 'New Bouquet' }]; // Returning array with inserted row

      const newProductPayload = {
        name: 'New Bouquet',
        basePrice: '500000',
        category: 'Bouquet',
        description: 'New Description',
        images: ['img1.jpg'],
        variantGroups: [],
      };

      const result = await createProduct(newProductPayload);
      
      expect(mockInsert).toHaveBeenCalled();
      expect(mockValues).toHaveBeenCalled();
      expect(mockReturning).toHaveBeenCalled();
      expect(result.id).toBe(1);
    });

    it('should throw an error if insert fails (no row returned)', async () => {
      mockDbResponses.createProduct = []; // Mock failure
      
      const newProductPayload = {
        name: 'Fail Bouquet',
        basePrice: '1000',
        category: 'Bouquet',
        description: '',
        images: [],
        variantGroups: [],
      };

      await expect(createProduct(newProductPayload)).rejects.toThrow();
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product and return true if successful', async () => {
      mockDbResponses.deleteProduct = [{ id: 1 }]; // Returning deleted row

      const result = await deleteProduct(1);
      
      expect(mockDelete).toHaveBeenCalled();
      expect(mockWhere).toHaveBeenCalled();
      expect(mockReturning).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false if product does not exist (no row deleted)', async () => {
      mockDbResponses.deleteProduct = []; // No row returned

      const result = await deleteProduct(999);
      expect(result).toBe(false);
    });
  });
});
