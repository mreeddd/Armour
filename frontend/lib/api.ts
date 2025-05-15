import { Agent, Relationship, Conversation } from './types';

// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Helper function for API requests
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'An error occurred while fetching data');
  }

  return response.json();
}

// Agent API functions
export async function getAgents(): Promise<Agent[]> {
  return fetchAPI<Agent[]>('/agents');
}

export async function getAgent(id: string): Promise<Agent> {
  return fetchAPI<Agent>(`/agents/${id}`);
}

export async function createAgent(agentData: {
  name: string;
  personality: {
    traits: {
      openness: number;
      conscientiousness: number;
      extraversion: number;
      agreeableness: number;
      neuroticism: number;
      intelligence: number;
      creativity: number;
      humor: number;
    };
    interests: string[];
    values: string[];
    communication_style: string;
    relationship_preferences: Record<string, any>;
  };
}): Promise<Agent> {
  return fetchAPI<Agent>('/agents', {
    method: 'POST',
    body: JSON.stringify(agentData),
  });
}

export async function updateAgent(
  id: string,
  agentData: Partial<{
    personality: {
      traits: {
        openness: number;
        conscientiousness: number;
        extraversion: number;
        agreeableness: number;
        neuroticism: number;
        intelligence: number;
        creativity: number;
        humor: number;
      };
      interests: string[];
      values: string[];
      communication_style: string;
      relationship_preferences: Record<string, any>;
    };
  }>
): Promise<Agent> {
  return fetchAPI<Agent>(`/agents/${id}`, {
    method: 'PUT',
    body: JSON.stringify(agentData),
  });
}

// Conversation API functions
export async function sendMessage(
  agentId: string,
  message: {
    user_message: string;
    conversation_id: string;
    relationship_context?: Record<string, any>;
  }
): Promise<{
  agent_id: string;
  conversation_id: string;
  response: string;
  metadata: {
    emotional_tone: Record<string, number>;
    conversation_dynamics: Record<string, number>;
  };
}> {
  return fetchAPI<any>(`/agents/${agentId}/message`, {
    method: 'POST',
    body: JSON.stringify(message),
  });
}

export async function getAgentMemories(
  agentId: string,
  params: {
    memory_type?: string;
    limit?: number;
  } = {}
): Promise<{
  agent_id: string;
  memory_type: string;
  memories: Array<{
    content: string;
    timestamp: string;
    importance: number;
    metadata: Record<string, any>;
    last_accessed: string;
    access_count: number;
    speaker?: string;
    conversation_id?: string;
    emotional_context?: Record<string, any>;
    relationship_id?: string;
    event_type?: string;
    emotional_impact?: number;
  }>;
}> {
  const queryParams = new URLSearchParams();
  if (params.memory_type) queryParams.append('memory_type', params.memory_type);
  if (params.limit) queryParams.append('limit', params.limit.toString());

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  return fetchAPI<any>(`/agents/${agentId}/memories${queryString}`);
}

export async function searchAgentMemories(
  agentId: string,
  query: string,
  params: {
    memory_type?: string;
    limit?: number;
  } = {}
): Promise<{
  agent_id: string;
  query: string;
  memory_type: string;
  results: Array<{
    content: string;
    timestamp: string;
    importance: number;
    metadata: Record<string, any>;
    last_accessed: string;
    access_count: number;
  }>;
}> {
  return fetchAPI<any>(`/agents/${agentId}/search-memories`, {
    method: 'POST',
    body: JSON.stringify({
      query,
      memory_type: params.memory_type || 'all',
      limit: params.limit || 10,
    }),
  });
}

// Compatibility API functions
export async function calculateCompatibility(
  agentOneProfile: any,
  agentTwoProfile: any
): Promise<{
  overall_score: number;
  trait_compatibility: number;
  interest_compatibility: number;
  values_compatibility: number;
  match_quality: string;
  compatibility_details: {
    complementary_traits: string[];
    similar_traits: string[];
    potential_challenges: string[];
    shared_interests: string[];
    shared_values: string[];
    communication_compatibility: string;
  };
}> {
  return fetchAPI<any>('/compatibility', {
    method: 'POST',
    body: JSON.stringify({
      agent_one_profile: agentOneProfile,
      agent_two_profile: agentTwoProfile,
    }),
  });
}

// Relationship API functions
export async function getRelationships(): Promise<Relationship[]> {
  // This would be implemented in a real backend
  // For now, return mock data
  return fetchAPI<Relationship[]>('/relationships');
}

export async function getRelationship(id: string): Promise<Relationship> {
  return fetchAPI<Relationship>(`/relationships/${id}`);
}
