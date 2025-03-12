const API_BASE_URL = 'http://localhost:8000';

export interface Practice {
  id: string;
  type: string;
  title: string;
  timestamp: string;
  content: any;
}

export function getFullAudioUrl(audioPath: string): string {
  return `${API_BASE_URL}${audioPath}`;
}

export async function generatePractice(type: 'listening' | 'reading'): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate practice');
  }

  const data = await response.json();
  if (data.audioPath) {
    data.audioPath = getFullAudioUrl(data.audioPath);
  }
  return data;
}

export async function getSavedPractices(): Promise<Practice[]> {
  const response = await fetch(`${API_BASE_URL}/saved_practices`);

  if (!response.ok) {
    throw new Error('Failed to fetch saved practices');
  }

  return response.json();
}

export async function getPracticeById(id: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/practice/${id}`);

  if (!response.ok) {
    throw new Error('Failed to fetch practice');
  }

  const data = await response.json();
  if (data.audioPath) {
    data.audioPath = getFullAudioUrl(data.audioPath);
  }
  return data;
} 