
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

class ApiService {
  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("auth_token")
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getAuthToken()

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || "Erro na requisição")
    }

    return response.json()
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request<{ token: string; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async register(name: string, email: string, password: string) {
    return this.request<{ token: string; user: any }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    })
  }

  async getMe() {
    return this.request<any>("/auth/me")
  }

  // Cities endpoints
  async getCities() {
    return this.request<any[]>("/cities")
  }

  async getCity(id: string) {
    return this.request<any>(`/cities/${id}`)
  }

  // Hotels endpoints
  async getHotels() {
    return this.request<any[]>("/hotels")
  }

  async getHotel(id: string) {
    return this.request<any>(`/hotels/${id}`)
  }

  // Attractions endpoints
  async getAttractions() {
    return this.request<any[]>("/attractions")
  }

  async getAttraction(id: string) {
    return this.request<any>(`/attractions/${id}`)
  }

  // Reviews endpoints
  async createReview(data: { rating: number; comment: string; hotelId?: string; cityId?: string }) {
    return this.request<any>("/reviews", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getHotelReviews(hotelId: string) {
    return this.request<any[]>(`/hotels/${hotelId}/reviews`)
  }

  async getCityReviews(cityId: string) {
    return this.request<any[]>(`/reviews/city/${cityId}`)
  }

  // Reservas endpoints
  async createReserva(data: {
    hotelId: string
    checkIn: string
    checkOut: string
    guests: number
    totalPrice: number
  }) {
    return this.request<any>("/reservas", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getUserReservas(userId: string) {
    return this.request<any[]>(`/reservas/user/${userId}`)
  }
}

export const api = new ApiService()
