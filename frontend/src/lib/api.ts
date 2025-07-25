import { PortfolioApiResponse } from "../interfaces/portfolio";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export async function getPortfolioData(): Promise<PortfolioApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/portfolio`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }
    const data: PortfolioApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching portfolio data:", error);
    throw error;
  }
}
