import axios from "axios";
import  { signUp }  from "../services/userService";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("User Service API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // ---------- SIGNUP ----------
  describe("signUp", () => {
    it("register a user successfully", async () => {
      const mockData = { name: "Charlie", email: "charlie@gmail.com", password: "charlie@123" };
      const mockResponse = { data: { message: "User registered successfully" } };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const response = await signUp(mockData);

      expect(response).toEqual(mockResponse);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "http://localhost:8080/user/userRegistration",
        mockData
      );
    });

    it("fail to register a user", async () => {
      const mockData = { name: "Saurabh", email: "bad@test.com", password: "1234" };
      const mockError = new Error("Registration failed");

      mockedAxios.post.mockRejectedValueOnce(mockError);

      await expect(signUp(mockData)).rejects.toThrow("Registration failed");
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "http://localhost:8080/user/userRegistration",
        mockData
      );
    });
  });
});
