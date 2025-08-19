import axios from "axios";
import { signUp, signIn } from "../userService";

// Mock axios globally
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("userService API calls", () => {
  afterEach(() => {
    jest.clearAllMocks(); // cleanup mocks after each test
  });

  // ✅ signUp Tests
  describe("signUp()", () => {
    it("should return data when signUp is successful", async () => {
      const mockData = { firstName: "Charlie", lastName: "Kyle", email: "charlie@gmail.com" };
      const mockResponse = { data: { id: 1, ...mockData } };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await signUp(mockData);

      // expect axios called correctly
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "http://localhost:8080/user/userRegistration",
        mockData
      );
      // expect response returned correctly
      expect(result).toEqual(mockResponse);
    });

    it("should throw an error when signUp fails", async () => {
      const mockError = new Error("SignUp failed");
      mockedAxios.post.mockRejectedValueOnce(mockError);

      await expect(signUp({})).rejects.toThrow("SignUp failed");
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "http://localhost:8080/user/userRegistration",
        {}
      );
    });
  });

  // ✅ signIn Tests
  describe("signIn()", () => {
    it("should return data when signIn is successful", async () => {
      const credentials = { email: "charlie@gmail.com", password: "charlie@123" };
      const mockResponse = { data: { token: "jwt-token" } };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await signIn(credentials);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "http://localhost:8080/user/login",
        credentials
      );
      expect(result).toEqual(mockResponse);
    });

    it("should throw an error when signIn fails", async () => {
      const mockError = new Error("Invalid credentials");
      mockedAxios.post.mockRejectedValueOnce(mockError);

      await expect(signIn({})).rejects.toThrow("Invalid credentials");
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "http://localhost:8080/user/login",
        {}
      );
    });
  });
});
