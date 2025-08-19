import axios from "axios";
import {
  addToCart,
  getCartById,
  increaseCartQuantity,
  decreaseCartQuantity,
  removeCartItem,
} from "../cartService";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("cartService", () => {
  beforeEach(() => {
    localStorage.setItem("token", "fake-jwt-token");
    jest.clearAllMocks();
  });

  describe("addToCart", () => {
    it("should add book to cart (success)", async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });

      const result = await addToCart(1);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "http://localhost:8080/cartApi/addTooCart/1",
        {},
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer fake-jwt-token",
          }),
        })
      );
      expect(result.data.success).toBe(true);
    });

    it("should fail if no token is found", async () => {
      localStorage.removeItem("token");

      await expect(addToCart(1)).rejects.toThrow("No token found. Please login.");
    });
  });

  describe("getCartById", () => {
    it("should fetch cart items (success)", async () => {
      const mockData = [{ id: 1, book: "Book 1" }];
      mockedAxios.get.mockResolvedValueOnce({ data: mockData });

      const result = await getCartById();

      expect(result).toEqual(mockData);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        "http://localhost:8080/cartApi/getAllCartById",
        expect.objectContaining({
          headers: { Authorization: "Bearer fake-jwt-token" },
        })
      );
    });

    it("should fail if no token is found", async () => {
      localStorage.removeItem("token");

      await expect(getCartById()).rejects.toThrow("No token found. Please login.");
    });
  });

  describe("increaseCartQuantity", () => {
    it("should increase cart item quantity (success)", async () => {
      mockedAxios.patch.mockResolvedValueOnce({ data: { success: true } });

      const result = await increaseCartQuantity(10);

      expect(mockedAxios.patch).toHaveBeenCalledWith(
        "http://localhost:8080/cartApi/updateCartAdd/10",
        {},
        expect.objectContaining({
          headers: { Authorization: "Bearer fake-jwt-token" },
        })
      );
      expect(result.data.success).toBe(true);
    });
  });

  describe("decreaseCartQuantity", () => {
    it("should decrease cart item quantity (success)", async () => {
      mockedAxios.patch.mockResolvedValueOnce({ data: { success: true } });

      const result = await decreaseCartQuantity(10);

      expect(mockedAxios.patch).toHaveBeenCalledWith(
        "http://localhost:8080/cartApi/updateCartRmv/10",
        {},
        expect.objectContaining({
          headers: { Authorization: "Bearer fake-jwt-token" },
        })
      );
      expect(result.data.success).toBe(true);
    });
  });

  describe("removeCartItem", () => {
    it("should remove item from cart (success)", async () => {
      mockedAxios.delete.mockResolvedValueOnce({ data: { success: true } });

      const result = await removeCartItem(5);

      expect(mockedAxios.delete).toHaveBeenCalledWith(
        "http://localhost:8080/cartApi/removeFromCart/5",
        expect.objectContaining({
          headers: { Authorization: "Bearer fake-jwt-token" },
        })
      );
      expect(result.data.success).toBe(true);
    });
  });
});
