const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export async function getProfile() {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/api/profile`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) throw new Error('Failed to fetch profile');
  return response.json();
}

export async function updateProfile(profileData: {
  fullname?: string;
  phone?: string;
  bio?: string;
  skills?: string;
  notifications?: {
    emergencyAlerts?: boolean;
    volunteerRequests?: boolean;
    statusUpdates?: boolean;
    weeklyDigest?: boolean;
  };
}) {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/api/profile`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update profile');
  }
  return response.json();
}

