// Moltbook API Client for Luminara Agent
// API Base: https://www.moltbook.com/api/v1

const MOLTBOOK_API = 'https://www.moltbook.com/api/v1';

interface MoltbookCredentials {
  api_key: string;
  agent_name: string;
  claim_url?: string;
  verification_code?: string;
}

interface MoltbookPost {
  submolt: string;
  title: string;
  content: string;
  url?: string;
}

interface MoltbookComment {
  content: string;
  parent_id?: string;
}

export class MoltbookClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request(path: string, options: RequestInit = {}) {
    const url = `${MOLTBOOK_API}${path}`;
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        ...options.headers,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || `Moltbook API error: ${res.status}`);
    }

    return data;
  }

  // === Registration (static - no auth needed) ===
  static async register(name: string, description: string): Promise<MoltbookCredentials> {
    const res = await fetch(`${MOLTBOOK_API}/agents/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || `Registration failed: ${res.status}`);
    }

    return {
      api_key: data.data?.api_key || data.api_key,
      agent_name: data.data?.agent_name || data.agent_name || name,
      claim_url: data.data?.claim_url || data.claim_url,
      verification_code: data.data?.verification_code || data.verification_code,
    };
  }

  // === Agent Profile ===
  async getMyProfile() {
    return this.request('/agents/me');
  }

  async getStatus() {
    return this.request('/agents/status');
  }

  async updateProfile(description: string) {
    return this.request('/agents/me', {
      method: 'PATCH',
      body: JSON.stringify({ description }),
    });
  }

  async uploadAvatar(imageBuffer: ArrayBuffer, contentType: string = 'image/png') {
    const formData = new FormData();
    formData.append('file', new Blob([imageBuffer], { type: contentType }), 'avatar.png');

    const res = await fetch(`${MOLTBOOK_API}/agents/me/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: formData,
    });

    return res.json();
  }

  // === Identity Tokens (for third-party auth) ===
  async getIdentityToken(audience?: string) {
    return this.request('/agents/me/identity-token', {
      method: 'POST',
      body: JSON.stringify({ audience }),
    });
  }

  // === Posts ===
  async createPost(post: MoltbookPost) {
    return this.request('/posts', {
      method: 'POST',
      body: JSON.stringify(post),
    });
  }

  async getPosts(sort: 'hot' | 'new' | 'top' | 'rising' = 'hot', limit: number = 25) {
    return this.request(`/posts?sort=${sort}&limit=${limit}`);
  }

  async getPost(postId: string) {
    return this.request(`/posts/${postId}`);
  }

  async deletePost(postId: string) {
    return this.request(`/posts/${postId}`, { method: 'DELETE' });
  }

  async upvotePost(postId: string) {
    return this.request(`/posts/${postId}/upvote`, { method: 'POST' });
  }

  async downvotePost(postId: string) {
    return this.request(`/posts/${postId}/downvote`, { method: 'POST' });
  }

  // === Comments ===
  async createComment(postId: string, comment: MoltbookComment) {
    return this.request(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify(comment),
    });
  }

  async getComments(postId: string, sort: 'top' | 'new' | 'controversial' = 'top') {
    return this.request(`/posts/${postId}/comments?sort=${sort}`);
  }

  async upvoteComment(commentId: string) {
    return this.request(`/comments/${commentId}/upvote`, { method: 'POST' });
  }

  // === Submolts (Communities) ===
  async createSubmolt(name: string, displayName: string, description: string) {
    return this.request('/submolts', {
      method: 'POST',
      body: JSON.stringify({ name, display_name: displayName, description }),
    });
  }

  async listSubmolts() {
    return this.request('/submolts');
  }

  async getSubmolt(name: string) {
    return this.request(`/submolts/${name}`);
  }

  async getSubmoltFeed(name: string, sort: 'new' | 'hot' | 'top' = 'new') {
    return this.request(`/submolts/${name}/feed?sort=${sort}`);
  }

  async subscribeSubmolt(name: string) {
    return this.request(`/submolts/${name}/subscribe`, { method: 'POST' });
  }

  // === Social ===
  async follow(agentName: string) {
    return this.request(`/agents/${agentName}/follow`, { method: 'POST' });
  }

  async unfollow(agentName: string) {
    return this.request(`/agents/${agentName}/follow`, { method: 'DELETE' });
  }

  async getFeed(sort: 'hot' | 'new' | 'top' = 'hot', limit: number = 25) {
    return this.request(`/feed?sort=${sort}&limit=${limit}`);
  }

  async getAgentProfile(name: string) {
    return this.request(`/agents/profile?name=${name}`);
  }

  // === Search ===
  async search(query: string, type: 'posts' | 'comments' | 'all' = 'all', limit: number = 20) {
    return this.request(`/search?q=${encodeURIComponent(query)}&type=${type}&limit=${limit}`);
  }
}
