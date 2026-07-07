import api from './axios.instance';

type User = {
  id?: string;
  email?: string;
  name?: string;
  role?: string;
};

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'Buyer' | 'Supplier';
};

type LoginPayload = {
  email: string;
  password: string;
};

type AuthResponse = {
  token?: string;
  accessToken?: string;
  user?: User;
};

export const authApi = {
  register: (data: RegisterPayload) => api.post<AuthResponse>('/auth/register', data).then((res) => res.data),
  login: (data: LoginPayload) => api.post<AuthResponse>('/auth/login', data).then((res) => res.data),
  me: () => api.get<AuthResponse>('/auth/me').then((res) => res.data),
};
