import axios from "axios";
import { getBooks } from "../bookService";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("bookService - getBooks", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch books successfully (success case)", async () => {
    // Arrange
    const mockBooks = [
      { id: 1, title: "Book One", author: "Author One" },
      { id: 2, title: "Book Two", author: "Author Two" },
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: mockBooks });

    // Act
    const result = await getBooks();

    // Assert
    expect(mockedAxios.get).toHaveBeenCalledWith("http://localhost:8080/book/allBooks");
    expect(result).toEqual(mockBooks);
  });

  it("should throw error when API call fails (failure case)", async () => {
    // Arrange
    const mockError = new Error("Network Error");
    mockedAxios.get.mockRejectedValueOnce(mockError);

    // Act & Assert
    await expect(getBooks()).rejects.toThrow("Network Error");
    expect(mockedAxios.get).toHaveBeenCalledWith("http://localhost:8080/book/allBooks");
  });
});
