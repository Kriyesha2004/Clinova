const API_URL = 'http://localhost:5000/api/dengue-content';

export interface DengueContentItem {
  _id?: string;
  title: string;
  category: 'prevention' | 'safety' | 'help';
  content: string;
  image?: string; // base64 string
  createdAt?: string;
  updatedAt?: string;
}

export const dengueContentService = {
  // Get all content items
  getAllContent: async (): Promise<DengueContentItem[]> => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch dengue content');
      return await response.json();
    } catch (error) {
      console.error('Error fetching dengue content:', error);
      return [];
    }
  },

  // Create new content item
  createContent: async (data: DengueContentItem): Promise<DengueContentItem> => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to create content');
      }
      const resJson = await response.json();
      return resJson.data;
    } catch (error) {
      console.error('Error creating dengue content:', error);
      throw error;
    }
  },

  // Update an existing content item
  updateContent: async (id: string, data: Partial<DengueContentItem>): Promise<DengueContentItem> => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to update content');
      }
      const resJson = await response.json();
      return resJson.data;
    } catch (error) {
      console.error('Error updating dengue content:', error);
      throw error;
    }
  },

  // Delete a content item
  deleteContent: async (id: string): Promise<DengueContentItem> => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to delete content');
      }
      const resJson = await response.json();
      return resJson.data;
    } catch (error) {
      console.error('Error deleting dengue content:', error);
      throw error;
    }
  },
};
