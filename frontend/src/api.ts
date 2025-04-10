import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

export const fetchPolygonsApi = () => api.get('/polygons');

export const createPolygonApi = (name: string, points: number[][]) => api.post('/polygons', { name, points });

export const deletePolygonApi = (id: number) => api.delete(`/polygons/${id}`);