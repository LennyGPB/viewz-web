"use client";

// Client léger pour parler à nos propres Route Handlers (/api/admin/*, etc.),
// jamais directement à l'API NestJS : le token reste dans un cookie httpOnly
// que le navigateur ne peut pas lire.
// Représentation générique d'une ressource admin (post, event, spotlight...).
// Le détail des champs varie par type de ressource ; on ne type que ce qui
// est commun (id) et on accède au reste via String()/Number() côté UI.
export interface AdminRecord {
  id: string;
  [key: string]: unknown;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  const text = await response.text();
  let body: unknown = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!response.ok) {
    const message =
      body && typeof body === "object" && "message" in body
        ? String((body as { message: unknown }).message)
        : `Erreur (${response.status})`;
    throw new Error(message);
  }
  return body as T;
}

// --- Recherches (annonces) ---
export const getAdminPosts = (search?: string) =>
  request<AdminRecord[]>(`/api/admin/posts${search ? `?search=${encodeURIComponent(search)}` : ""}`);
export const deleteAdminPost = (id: string) => request(`/api/admin/posts/${id}`, { method: "DELETE" });
export const getAdminPost = (id: string) => request<AdminRecord>(`/api/admin/posts/${id}`);
export const updateAdminPost = (id: string, payload: Record<string, unknown>) =>
  request<AdminRecord>(`/api/admin/posts/${id}`, { method: "PATCH", body: JSON.stringify(payload) });

// --- Styles de danse (lus en base) ---
export interface AdminStyle {
  id: string;
  name: string;
  _count: { users: number; posts: number; events: number };
}
export const getAdminStyles = () => request<AdminStyle[]>("/api/admin/styles");
export const createAdminStyle = (name: string) =>
  request<AdminStyle>("/api/admin/styles", { method: "POST", body: JSON.stringify({ name }) });
export const deleteAdminStyle = (id: string) => request(`/api/admin/styles/${id}`, { method: "DELETE" });

// --- Événements ---
export const getAdminEvents = () => request<AdminRecord[]>("/api/admin/events");
export const getAdminEvent = (id: string) => request<AdminRecord>(`/api/admin/events/${id}`);
export const deleteAdminEvent = (id: string) => request(`/api/admin/events/${id}`, { method: "DELETE" });
export const createEvent = (payload: Record<string, unknown>) =>
  request<AdminRecord>("/api/events", { method: "POST", body: JSON.stringify(payload) });
export const updateAdminEvent = (id: string, payload: Record<string, unknown>) =>
  request<AdminRecord>(`/api/admin/events/${id}`, { method: "PATCH", body: JSON.stringify(payload) });

// --- Scène (vidéos / images) ---
export const getAdminSpotlights = () => request<AdminRecord[]>("/api/admin/spotlights");
export const deleteAdminSpotlight = (id: string) => request(`/api/admin/spotlights/${id}`, { method: "DELETE" });

// --- Spots de danse ---
export const getAdminDanceSpots = () => request<AdminRecord[]>("/api/admin/dance-spots");
export const getAdminDanceSpot = (id: string) => request<AdminRecord>(`/api/admin/dance-spots/${id}`);
export const deleteAdminDanceSpot = (id: string) => request(`/api/admin/dance-spots/${id}`, { method: "DELETE" });
export const createDanceSpot = (payload: Record<string, unknown>) =>
  request<AdminRecord>("/api/dance-spots", { method: "POST", body: JSON.stringify(payload) });
export const updateAdminDanceSpot = (id: string, payload: Record<string, unknown>) =>
  request<AdminRecord>(`/api/admin/dance-spots/${id}`, { method: "PATCH", body: JSON.stringify(payload) });

// --- Utilisateurs ---
export const getAdminUsers = (search?: string) =>
  request<AdminRecord[]>(`/api/admin/users${search ? `?search=${encodeURIComponent(search)}` : ""}`);
export const deleteAdminUser = (id: string) => request(`/api/admin/users/${id}`, { method: "DELETE" });
export type UserVerification = "DEFAULT" | "VERIFIED" | "OFFICIAL";
export const updateAdminUserVerification = (id: string, verification: UserVerification) =>
  request<AdminRecord>(`/api/admin/users/${id}/verification`, { method: "PATCH", body: JSON.stringify({ verification }) });

// --- Médias des profils ---
export interface AdminUserMedia {
  id: string;
  username: string;
  updatedAt: string;
  profilePic: string | null;
  videoUrl: string | null;
  profilePhotos: string[];
}
export const getAdminUserMedia = (search?: string) =>
  request<AdminUserMedia[]>(`/api/admin/user-media${search ? `?search=${encodeURIComponent(search)}` : ""}`);
export const deleteAdminUserMedia = (userId: string, url: string) =>
  request(`/api/admin/users/${userId}/media?url=${encodeURIComponent(url)}`, { method: "DELETE" });

// --- Stats ---
export interface AdminStats {
  posts: number;
  events: number;
  spotlights: number;
  danceSpots: number;
  users: number;
}
export const getAdminStats = () => request<AdminStats>("/api/admin/stats");

// --- Notifications à tout le monde ---
export const getBroadcastRecipients = () => request<{ count: number }>("/api/admin/notifications/recipients");
export const sendBroadcastNotification = (title: string, body: string) =>
  request<{ recipients: number }>("/api/admin/notifications/broadcast", {
    method: "POST",
    body: JSON.stringify({ title, body }),
  });

// --- Upload (présigné R2) ---
export interface PresignedUpload {
  uploadUrl: string;
  url: string;
  objectKey: string;
}
export const getPresignedUpload = (payload: { type: "image" | "video"; contentType: string; fileSize: number }) =>
  request<PresignedUpload>("/api/upload/presigned-url", { method: "POST", body: JSON.stringify(payload) });

// --- Lieux (autocomplete Google Places proxifié par l'API) ---
export interface PlacePrediction {
  place_id: string;
  description: string;
}
export const getPlacePredictions = (input: string) =>
  request<{ status: string; predictions: PlacePrediction[] }>(
    `/api/places/autocomplete?input=${encodeURIComponent(input)}`,
  );

export interface PlaceDetails {
  status: string;
  result: { geometry: { location: { lat: number; lng: number } } };
}
export const getPlaceDetails = (placeId: string) =>
  request<PlaceDetails>(`/api/places/details?placeId=${encodeURIComponent(placeId)}`);

export const uploadFileToR2 = async (uploadUrl: string, file: File) => {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!response.ok) throw new Error(`Échec de l'upload (${response.status})`);
};
