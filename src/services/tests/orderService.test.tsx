import axios from "axios";
import { placeOrder } from "../orderService"; 
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("placeOrder Service", () => {
  const orderData = { bookId: 1, quantity: 2 };
  const token = "mocked-jwt-token";

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should place an order successfully", async () => {
    const mockResponse = { data: { orderId: 123, status: "SUCCESS" } };
    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    const response = await placeOrder(orderData, token);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      "http://localhost:8080/orderApi/orderPlace",
      orderData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    expect(response).toEqual(mockResponse);
  });

  it("should fail to place an order", async () => {
    const mockError = new Error("Order placement failed");
    mockedAxios.post.mockRejectedValueOnce(mockError);

    await expect(placeOrder(orderData, token)).rejects.toThrow("Order placement failed");

    expect(mockedAxios.post).toHaveBeenCalledWith(
      "http://localhost:8080/orderApi/orderPlace",
      orderData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  });
});
