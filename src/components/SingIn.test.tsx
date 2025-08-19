import axios from "axios";
import { signIn } from "../services/userService"; 


jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("User Service API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // ---------- SIGNIN ----------
  describe("signIn", () => {
    it("login a user successfully", async () => {
      const mockData = { email: "test@test.com", password: "1234" };
      const mockResponse = { data: { token: "jwt-token" } };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const response = await signIn(mockData);

      expect(response).toEqual(mockResponse);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "http://localhost:8080/user/login",
        mockData
      );
    });

    it("fail to login a user", async () => {
      const mockData = { email: "wrong@test.com", password: "badpass" };
      const mockError = new Error("Invalid credentials");

      mockedAxios.post.mockRejectedValueOnce(mockError);

      await expect(signIn(mockData)).rejects.toThrow("Invalid credentials");
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "http://localhost:8080/user/login",
        mockData
      );
    });
  });
});
