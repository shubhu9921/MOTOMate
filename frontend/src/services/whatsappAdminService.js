import api from './api';

export const whatsappAdminService = {
  getStatus: async () => {
    const response = await api.get('/admin/whatsapp/status');
    return response.data;
  },
  
  getStatistics: async () => {
    const response = await api.get('/admin/whatsapp/statistics');
    return response.data;
  },

  getConversations: async (page = 0, size = 20) => {
    const response = await api.get(`/admin/whatsapp/conversations?page=${page}&size=${size}`);
    return response.data;
  },

  getConversationDetail: async (id) => {
    const response = await api.get(`/admin/whatsapp/conversations/${id}`);
    return response.data;
  },

  getMessages: async (page = 0, size = 20) => {
    const response = await api.get(`/admin/whatsapp/messages?page=${page}&size=${size}`);
    return response.data;
  },

  getNotifications: async (page = 0, size = 20) => {
    const response = await api.get(`/admin/whatsapp/notifications?page=${page}&size=${size}`);
    return response.data;
  }
};
