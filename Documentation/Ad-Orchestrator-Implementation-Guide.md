# Ad Orchestrator - Implementation Guide

## Quick Start

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd ad-orchestrator

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

### Environment Configuration
```env
# .env file
VITE_API_URL=https://adorchest6935back.builtwithrocket.new
VITE_PLATFORM_URL=https://application.rocket.new
VITE_APP_NAME=Ad Orchestrator
VITE_APP_VERSION=1.0.0

# AI Service Keys
VITE_ANTHROPIC_API_KEY=your-claude-api-key
VITE_OPENAI_API_KEY=your-openai-api-key
VITE_STABILITY_API_KEY=your-stability-ai-key

# Feature Flags
VITE_ENABLE_AI_GENERATION=true
VITE_ENABLE_INTEGRATIONS=true
VITE_ENABLE_ANALYTICS=true
```

---

## Core Patterns

### API Service Pattern
```javascript
// src/services/api.js
class ApiService {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new ApiError(response.status, await response.text());
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Campaign Methods
  async getCampaigns(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/api/campaigns?${params}`);
  }

  async createCampaign(data) {
    return this.request('/api/campaigns', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCampaign(id, data) {
    return this.request(`/api/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCampaign(id) {
    return this.request(`/api/campaigns/${id}`, {
      method: 'DELETE',
    });
  }

  // Asset Methods
  async uploadAsset(file, metadata) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', JSON.stringify(metadata));

    return this.request('/api/assets/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  }

  // AI Generation Methods
  async generateAd(prompt, options) {
    return this.request('/api/ai/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt, ...options }),
    });
  }

  // Approval Methods
  async getApprovalQueue(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/api/approvals/queue?${params}`);
  }

  async approveAsset(id, comments) {
    return this.request(`/api/approvals/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ comments }),
    });
  }

  async rejectAsset(id, reason, comments) {
    return this.request(`/api/approvals/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason, comments }),
    });
  }
}

export default new ApiService(import.meta.env.VITE_API_URL);
```

---

### React Context Pattern
```javascript
// src/contexts/CampaignContext.jsx
import { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';

const CampaignContext = createContext();

export function CampaignProvider({ children }) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    client: null,
    department: null,
    dateRange: null,
  });

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getCampaigns(filters);
      setCampaigns(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const createCampaign = async (campaignData) => {
    try {
      const newCampaign = await api.createCampaign(campaignData);
      setCampaigns(prev => [newCampaign, ...prev]);
      return newCampaign;
    } catch (err) {
      throw err;
    }
  };

  const updateCampaign = async (id, updates) => {
    try {
      const updated = await api.updateCampaign(id, updates);
      setCampaigns(prev =>
        prev.map(c => (c.id === id ? updated : c))
      );
      return updated;
    } catch (err) {
      throw err;
    }
  };

  const deleteCampaign = async (id) => {
    try {
      await api.deleteCampaign(id);
      setCampaigns(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      throw err;
    }
  };

  const value = {
    campaigns,
    loading,
    error,
    filters,
    setFilters,
    fetchCampaigns,
    createCampaign,
    updateCampaign,
    deleteCampaign,
  };

  return (
    <CampaignContext.Provider value={value}>
      {children}
    </CampaignContext.Provider>
  );
}

export function useCampaigns() {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error('useCampaigns must be used within CampaignProvider');
  }
  return context;
}
```

---

### Custom Hook Pattern
```javascript
// src/hooks/useApprovals.js
import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export function useApprovals(filters = {}) {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  });

  const fetchQueue = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getApprovalQueue(filters);
      setQueue(data.items);
      setStats(data.stats);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  const approve = async (id, comments = '') => {
    try {
      await api.approveAsset(id, comments);
      await fetchQueue(); // Refresh queue
    } catch (err) {
      throw err;
    }
  };

  const reject = async (id, reason, comments = '') => {
    try {
      await api.rejectAsset(id, reason, comments);
      await fetchQueue(); // Refresh queue
    } catch (err) {
      throw err;
    }
  };

  const bulkApprove = async (ids) => {
    try {
      await Promise.all(ids.map(id => api.approveAsset(id)));
      await fetchQueue();
    } catch (err) {
      throw err;
    }
  };

  return {
    queue,
    loading,
    error,
    stats,
    approve,
    reject,
    bulkApprove,
    refresh: fetchQueue,
  };
}
```

---

### Component Examples

#### Campaign Card Component
```javascript
// src/components/CampaignCard.jsx
import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { Calendar, Users, Target, TrendingUp } from 'lucide-react';
import { formatDate } from '../utils/date';

export function CampaignCard({ campaign, onClick }) {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    draft: 'bg-gray-100 text-gray-800',
    paused: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-blue-100 text-blue-800',
    archived: 'bg-red-100 text-red-800',
  };

  return _jsxs('div', {
    className: 'bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer',
    onClick: () => onClick(campaign),
    children: [
      // Header
      _jsxs('div', {
        className: 'flex justify-between items-start mb-4',
        children: [
          _jsxs('div', {
            children: [
              _jsx('h3', {
                className: 'text-lg font-semibold text-gray-900',
                children: campaign.title,
              }),
              _jsx('p', {
                className: 'text-sm text-gray-500 mt-1',
                children: campaign.client.name,
              }),
            ],
          }),
          _jsx('span', {
            className: `px-3 py-1 rounded-full text-xs font-medium ${statusColors[campaign.status]}`,
            children: campaign.status.toUpperCase(),
          }),
        ],
      }),

      // Description
      _jsx('p', {
        className: 'text-gray-600 text-sm mb-4 line-clamp-2',
        children: campaign.description,
      }),

      // Metrics
      _jsxs('div', {
        className: 'grid grid-cols-3 gap-4 mb-4',
        children: [
          _jsxs('div', {
            className: 'flex items-center text-sm',
            children: [
              _jsx(Calendar, { className: 'w-4 h-4 mr-2 text-gray-400' }),
              _jsx('span', { children: formatDate(campaign.createdAt) }),
            ],
          }),
          _jsxs('div', {
            className: 'flex items-center text-sm',
            children: [
              _jsx(Users, { className: 'w-4 h-4 mr-2 text-gray-400' }),
              _jsx('span', { children: `${campaign.targetAudience.length} audiences` }),
            ],
          }),
          _jsxs('div', {
            className: 'flex items-center text-sm',
            children: [
              _jsx(Target, { className: 'w-4 h-4 mr-2 text-gray-400' }),
              _jsx('span', { children: `${campaign.channels.length} channels` }),
            ],
          }),
        ],
      }),

      // Performance
      {campaign.performance && _jsxs('div', {
        className: 'flex items-center text-sm text-green-600',
        children: [
          _jsx(TrendingUp, { className: 'w-4 h-4 mr-2' }),
          _jsx('span', { children: `${campaign.performance.impressions.toLocaleString()} impressions` }),
        ],
      })},
    ],
  });
}
```

#### AI Generation Workspace
```javascript
// src/components/AIAdGenerationWorkspace.jsx
import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { useState } from 'react';
import { Sparkles, RefreshCw, Download } from 'lucide-react';
import api from '../services/api';

export function AIAdGenerationWorkspace() {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('claude');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [parameters, setParameters] = useState({
    temperature: 0.7,
    brandVoice: 'professional',
    targetAudience: 'corporate',
    seoKeywords: [],
  });

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const response = await api.generateAd(prompt, {
        model,
        ...parameters,
      });
      setResult(response);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setGenerating(false);
    }
  };

  return _jsxs('div', {
    className: 'flex h-screen',
    children: [
      // Left Panel - Controls
      _jsxs('div', {
        className: 'w-96 bg-gray-50 p-6 border-r overflow-y-auto',
        children: [
          _jsx('h2', {
            className: 'text-xl font-bold mb-4',
            children: 'AI Generation',
          }),

          // Model Selection
          _jsxs('div', {
            className: 'mb-6',
            children: [
              _jsx('label', {
                className: 'block text-sm font-medium mb-2',
                children: 'AI Model',
              }),
              _jsxs('select', {
                value: model,
                onChange: (e) => setModel(e.target.value),
                className: 'w-full px-3 py-2 border rounded-lg',
                children: [
                  _jsx('option', { value: 'claude', children: 'Claude (Anthropic)' }),
                  _jsx('option', { value: 'gpt4', children: 'GPT-4 (OpenAI)' }),
                  _jsx('option', { value: 'stable-diffusion', children: 'Stable Diffusion XL' }),
                  _jsx('option', { value: 'dalle', children: 'DALL-E' }),
                ],
              }),
            ],
          }),

          // Prompt Input
          _jsxs('div', {
            className: 'mb-6',
            children: [
              _jsx('label', {
                className: 'block text-sm font-medium mb-2',
                children: 'Prompt',
              }),
              _jsx('textarea', {
                value: prompt,
                onChange: (e) => setPrompt(e.target.value),
                placeholder: 'Describe the ad you want to generate...',
                className: 'w-full px-3 py-2 border rounded-lg h-32',
              }),
            ],
          }),

          // Parameters
          _jsxs('div', {
            className: 'mb-6',
            children: [
              _jsx('label', {
                className: 'block text-sm font-medium mb-2',
                children: `Temperature: ${parameters.temperature}`,
              }),
              _jsx('input', {
                type: 'range',
                min: '0',
                max: '1',
                step: '0.1',
                value: parameters.temperature,
                onChange: (e) =>
                  setParameters(prev => ({
                    ...prev,
                    temperature: parseFloat(e.target.value),
                  })),
                className: 'w-full',
              }),
            ],
          }),

          // Generate Button
          _jsxs('button', {
            onClick: handleGenerate,
            disabled: !prompt || generating,
            className: 'w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center hover:bg-blue-700 disabled:opacity-50',
            children: [
              generating ? (
                _jsx(RefreshCw, { className: 'w-5 h-5 mr-2 animate-spin' })
              ) : (
                _jsx(Sparkles, { className: 'w-5 h-5 mr-2' })
              ),
              _jsx('span', { children: generating ? 'Generating...' : 'Generate' }),
            ],
          }),
        ],
      }),

      // Right Panel - Preview
      _jsxs('div', {
        className: 'flex-1 p-6',
        children: [
          _jsx('h2', {
            className: 'text-xl font-bold mb-4',
            children: 'Preview',
          }),
          result ? (
            _jsxs('div', {
              className: 'bg-white rounded-lg shadow-lg p-6',
              children: [
                result.type === 'image' ? (
                  _jsx('img', {
                    src: result.url,
                    alt: 'Generated ad',
                    className: 'w-full rounded-lg',
                  })
                ) : (
                  _jsx('div', {
                    className: 'prose',
                    dangerouslySetInnerHTML: { __html: result.content },
                  })
                ),
                _jsxs('div', {
                  className: 'mt-4 flex justify-end space-x-2',
                  children: [
                    _jsxs('button', {
                      className: 'px-4 py-2 border rounded-lg hover:bg-gray-50',
                      children: [
                        _jsx(RefreshCw, { className: 'w-4 h-4 inline mr-2' }),
                        'Regenerate',
                      ],
                    }),
                    _jsxs('button', {
                      className: 'px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700',
                      children: [
                        _jsx(Download, { className: 'w-4 h-4 inline mr-2' }),
                        'Save',
                      ],
                    }),
                  ],
                }),
              ],
            })
          ) : (
            _jsx('div', {
              className: 'flex items-center justify-center h-full text-gray-400',
              children: 'Generated content will appear here',
            })
          ),
        ],
      }),
    ],
  });
}
```

---

### Utility Functions

#### Date Formatting
```javascript
// src/utils/date.js
export function formatDate(date, format = 'short') {
  const d = new Date(date);
  
  if (format === 'short') {
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
  
  if (format === 'long') {
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }
  
  if (format === 'relative') {
    return formatRelativeDate(d);
  }
  
  return d.toLocaleDateString();
}

function formatRelativeDate(date) {
  const now = new Date();
  const diff = now - date;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  
  return formatDate(date, 'short');
}
```

#### File Upload Helper
```javascript
// src/utils/fileUpload.js
export async function uploadFile(file, onProgress) {
  const formData = new FormData();
  formData.append('file', file);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const percentComplete = (e.loaded / e.total) * 100;
        onProgress(percentComplete);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(`Upload failed: ${xhr.statusText}`));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed'));
    });

    xhr.open('POST', '/api/assets/upload');
    xhr.setRequestHeader('Authorization', `Bearer ${getToken()}`);
    xhr.send(formData);
  });
}

export function validateFile(file, options = {}) {
  const {
    maxSize = 10 * 1024 * 1024, // 10MB
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  } = options;

  if (file.size > maxSize) {
    throw new Error(`File size exceeds ${maxSize / 1024 / 1024}MB`);
  }

  if (!allowedTypes.includes(file.type)) {
    throw new Error(`File type ${file.type} not allowed`);
  }

  return true;
}
```

---

### Testing Examples

#### Component Test
```javascript
// src/components/__tests__/CampaignCard.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { CampaignCard } from '../CampaignCard';

describe('CampaignCard', () => {
  const mockCampaign = {
    id: '1',
    title: 'Summer Sale',
    description: 'Promotional campaign',
    status: 'active',
    client: { name: 'Acme Corp' },
    createdAt: '2024-01-15',
    targetAudience: ['corporate'],
    channels: ['email', 'social'],
  };

  it('renders campaign information', () => {
    render(<CampaignCard campaign={mockCampaign} onClick={() => {}} />);
    
    expect(screen.getByText('Summer Sale')).toBeInTheDocument();
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('ACTIVE')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<CampaignCard campaign={mockCampaign} onClick={handleClick} />);
    
    fireEvent.click(screen.getByText('Summer Sale'));
    expect(handleClick).toHaveBeenCalledWith(mockCampaign);
  });
});
```

---

## Deployment

### Build for Production
```bash
# Build the application
npm run build

# Preview production build
npm run preview

# Output will be in /dist directory
```

### Rocket.new Deployment
The application is automatically deployed via Rocket.new platform. Configuration is handled through the platform scripts loaded in the HTML.

---

## Best Practices

### 1. State Management
- Use Context for global state
- Keep component state local when possible
- Memoize expensive computations
- Use custom hooks for reusable logic

### 2. Performance
- Lazy load routes and components
- Optimize images before upload
- Use pagination for large lists
- Implement virtual scrolling for long lists
- Debounce search inputs

### 3. Error Handling
- Always handle API errors
- Provide user-friendly error messages
- Log errors for debugging
- Implement error boundaries

### 4. Accessibility
- Use semantic HTML
- Provide ARIA labels
- Ensure keyboard navigation
- Maintain color contrast
- Test with screen readers

### 5. Security
- Validate all inputs
- Sanitize user content
- Use HTTPS only
- Implement rate limiting
- Store tokens securely

---

*Implementation Guide for Ad Orchestrator Application*
