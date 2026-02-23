// API Base URL - configurable via environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Token storage keys
const ACCESS_TOKEN_KEY = 'lakshya_access_token';
const REFRESH_TOKEN_KEY = 'lakshya_refresh_token';
const USER_KEY = 'lakshya_user';

// ==================== TYPE DEFINITIONS ====================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: UserResponse;
}

export interface UserResponse {
  id: number;
  email: string;
  name: string;
  role: string;
  education?: string;
  created_at: string;
  updated_at: string;
}

export interface UserSkillResponse {
  id: number;
  user_id: number;
  skill_name: string;
  proficiency: number;
  created_at: string;
}

export interface UserPreferenceResponse {
  id: number;
  user_id: number;
  interest?: string;
  goal?: string;
  created_at: string;
}

export interface UserWithSkills {
  id: number;
  email: string;
  name: string;
  role: string;
  education?: string;
  skills: UserSkillResponse[];
  preferences: UserPreferenceResponse[];
  created_at: string;
  updated_at: string;
}

export interface OnboardingRequest {
  education: string;
  skills: string[];
  interests: string[];
  goals: string[];
}

export interface UserUpdate {
  name?: string;
  education?: string;
  role?: string;
}

export interface UserSkillCreate {
  skill_name: string;
  proficiency: number;
}

export interface UserSkillUpdate {
  skill_name?: string;
  proficiency?: number;
}

export interface CareerMatch {
  id: number;
  role: string;
  match_percentage: number;
  demand: 'High' | 'Medium' | 'Low';
  salary_range?: string;
  description?: string;
}

export interface ReadinessScore {
  overall_score: number;
  technical_skills_score: number;
  soft_skills_score: number;
  experience_score: number;
  breakdown: Record<string, number>;
}

export interface DashboardStats {
  readiness_score: number;
  readiness_score_change: number;
  skills_acquired: number;
  skills_change: number;
  learning_hours: number;
  hours_change: number;
  career_matches_count: number;
}

export interface CareerTrend {
  month: string;
  score: number;
}

export interface ActivityData {
  day: string;
  hours: number;
}

export interface Course {
  id: number;
  title: string;
  description?: string;
  duration: string;
  topics: number;
  status: 'not-started' | 'in-progress' | 'completed' | 'locked';
  progress?: number;
}

export interface RoadmapStage {
  stage: string;
  description: string;
  progress: number;
  courses: Course[];
}

export interface LearningRoadmap {
  stages: RoadmapStage[];
  milestones: { title: string; completed: boolean; date: string }[];
}

export interface RecommendedCourse {
  id: number;
  title: string;
  provider: string;
  duration: string;
  level: string;
  url: string;
  reason: string;
}

export interface InterviewQuestion {
  id: number;
  question: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  answered: boolean;
  rating?: number;
}

export interface InterviewCategory {
  category: string;
  count: number;
  questions: InterviewQuestion[];
}

export interface InterviewStats {
  total_questions: number;
  answered_count: number;
  average_rating: number;
  time_invested: string;
}

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  message: string;
  timestamp: string;
}

// ==================== FETCH HELPERS ====================

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchWithAuth<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (refreshToken && !endpoint.includes('/auth/')) {
      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
        
        if (refreshResponse.ok) {
          const data: TokenResponse = await refreshResponse.json();
          authHelpers.setTokens(data.access_token, data.refresh_token, data.user);
          
          const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
              ...headers,
              Authorization: `Bearer ${data.access_token}`,
            },
          });
          
          if (!retryResponse.ok) {
            const errorData = await retryResponse.json().catch(() => ({}));
            throw new ApiError(retryResponse.status, errorData.detail || 'Request failed');
          }
          
          return retryResponse.json();
        }
      } catch {
        // Refresh failed
      }
    }
    
    authHelpers.clearAuth();
    window.location.href = '/';
    throw new ApiError(401, 'Unauthorized');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(response.status, errorData.detail || 'Request failed');
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// ==================== AUTH API ====================

export const authApi = {
  login: async (data: LoginRequest): Promise<TokenResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new ApiError(response.status, error.detail || 'Login failed');
    }
    
    return response.json();
  },
  
  register: async (data: RegisterRequest): Promise<TokenResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new ApiError(response.status, error.detail || 'Registration failed');
    }
    
    return response.json();
  },
  
  getCurrentUser: async (): Promise<UserResponse> => {
    return fetchWithAuth<UserResponse>('/auth/me');
  },
};

// ==================== USER API ====================

export const userApi = {
  getProfile: async (): Promise<UserWithSkills> => {
    return fetchWithAuth<UserWithSkills>('/users/me');
  },
  
  updateProfile: async (data: UserUpdate): Promise<UserResponse> => {
    return fetchWithAuth<UserResponse>('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  completeOnboarding: async (data: OnboardingRequest): Promise<UserResponse> => {
    return fetchWithAuth<UserResponse>('/users/onboarding', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  getSkills: async (): Promise<UserSkillResponse[]> => {
    return fetchWithAuth<UserSkillResponse[]>('/users/skills');
  },
  
  addSkill: async (data: UserSkillCreate): Promise<UserSkillResponse> => {
    return fetchWithAuth<UserSkillResponse>('/users/skills', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  updateSkill: async (skillId: number, data: UserSkillUpdate): Promise<UserSkillResponse> => {
    return fetchWithAuth<UserSkillResponse>(`/users/skills/${skillId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  deleteSkill: async (skillId: number): Promise<void> => {
    return fetchWithAuth<void>(`/users/skills/${skillId}`, {
      method: 'DELETE',
    });
  },
  
  getPreferences: async (): Promise<UserPreferenceResponse[]> => {
    return fetchWithAuth<UserPreferenceResponse[]>('/users/preferences');
  },
  
  addPreference: async (data: { interest?: string; goal?: string }): Promise<UserPreferenceResponse> => {
    return fetchWithAuth<UserPreferenceResponse>('/users/preferences', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ==================== CAREERS API ====================

export const careersApi = {
  getCareerMatches: async (): Promise<CareerMatch[]> => {
    return fetchWithAuth<CareerMatch[]>('/careers/matches');
  },
  
  getCareerMatch: async (matchId: number): Promise<CareerMatch> => {
    return fetchWithAuth<CareerMatch>(`/careers/matches/${matchId}`);
  },
  
  getReadinessScore: async (): Promise<ReadinessScore> => {
    return fetchWithAuth<ReadinessScore>('/careers/readiness');
  },
  
  getDashboardStats: async (): Promise<DashboardStats> => {
    return fetchWithAuth<DashboardStats>('/careers/dashboard-stats');
  },
  
  getCareerTrends: async (): Promise<CareerTrend[]> => {
    return fetchWithAuth<CareerTrend[]>('/careers/trends');
  },
  
  getActivityData: async (): Promise<ActivityData[]> => {
    return fetchWithAuth<ActivityData[]>('/careers/activity');
  },
};

// ==================== ROADMAP API ====================

export const roadmapApi = {
  getLearningRoadmap: async (): Promise<LearningRoadmap> => {
    return fetchWithAuth<LearningRoadmap>('/roadmap');
  },
  
  getRecommendedCourses: async (): Promise<RecommendedCourse[]> => {
    return fetchWithAuth<RecommendedCourse[]>('/roadmap/recommended');
  },
  
  updateCourseProgress: async (courseId: number, progress: number, status: string): Promise<void> => {
    return fetchWithAuth<void>(`/roadmap/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify({ progress, status }),
    });
  },
};

// ==================== INTERVIEW API ====================

export const interviewApi = {
  getAllQuestions: async (): Promise<InterviewQuestion[]> => {
    return fetchWithAuth<InterviewQuestion[]>('/interview/questions');
  },
  
  getQuestion: async (questionId: number): Promise<InterviewQuestion> => {
    return fetchWithAuth<InterviewQuestion>(`/interview/questions/${questionId}`);
  },
  
  getCategories: async (): Promise<InterviewCategory[]> => {
    return fetchWithAuth<InterviewCategory[]>('/interview/categories');
  },
  
  getQuestionsByCategory: async (category: string): Promise<InterviewCategory> => {
    return fetchWithAuth<InterviewCategory>(`/interview/categories/${category}`);
  },
  
  getStats: async (): Promise<InterviewStats> => {
    return fetchWithAuth<InterviewStats>('/interview/stats');
  },
};

// ==================== CHAT API ====================

export const chatApi = {
  sendMessage: async (message: string): Promise<ChatResponse> => {
    return fetchWithAuth<ChatResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },
};

// ==================== AUTH HELPERS ====================

export const authHelpers = {
  setTokens: (accessToken: string, refreshToken: string, user: UserResponse): void => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  
  getAccessToken: (): string | null => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  
  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  
  getUser: (): UserResponse | null => {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },
  
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  
  clearAuth: (): void => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

export { ApiError };
