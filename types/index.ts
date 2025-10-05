export interface User {
  id: string
  name: string
  email: string
  isAdmin: boolean
  createdAt: string
}

export interface City {
  id: string
  name: string
  description: string
  image?: string
  createdAt: string
}

export interface Hotel {
  id: string
  name: string
  description: string
  price: number
  cityId: string
  city?: City
  image?: string
  rating?: number
  createdAt: string
}

export interface Attraction {
  id: string
  name: string
  description: string
  cityId: string
  city?: City
  image?: string
  createdAt: string
}

export interface Review {
  id: string
  rating: number
  comment: string
  userId: string
  user?: User
  hotelId?: string
  cityId?: string
  createdAt: string
}

export interface Reserva {
  id: string
  userId: string
  hotelId: string
  user?: User
  hotel?: Hotel
  checkIn: string
  checkOut: string
  guests: number
  totalPrice: number
  status: "pending" | "confirmed" | "cancelled"
  createdAt: string
}

export interface AuthResponse {
  token: string
  user: User
}
