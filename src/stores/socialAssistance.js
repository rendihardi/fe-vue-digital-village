import { handleError } from "@/helpers/errorHelper";

import { axiosInstance } from "@/plugins/axios";
import { defineStore } from "pinia";

export const useSocialAssistanceStore = defineStore("social-assistance", {
  state: () => ({
    socialAssistances: [],
    meta: {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
    },
    loading: false,
    error: null,
    success: null,
  }),
  actions: {
    async fetchSocialAssistance(params) {
      this.loading = true;
      try {
        const response = await axiosInstance.get("/social-assistance", {
          params,
        });
        this.socialAssistances = response.data.data;
        this.meta = response.data.meta;
      } catch (error) {
        this.error = handleError(error);
      } finally {
        this.loading = false;
      }
    },
    async fetchSocialAssistancePaginated(params) {
      this.loading = true;
      try {
        const response = await axiosInstance.get(
          "/social-assistance/all/paginated",
          { params },
        );
        this.socialAssistances = response.data.data.data;
        this.meta = response.data.data.meta;
      } catch (error) {
        this.error = handleError(error);
      } finally {
        this.loading = false;
      }
    },
    async getSocialAssistanceById(id) {
      this.loading = true;
      try {
        const response = await axiosInstance.get(`/social-assistance/${id}`);
        return response.data.data;
      } catch (error) {
        this.error = handleError(error);
      } finally {
        this.loading = false;
      }
    },
    async createSocialAssistance(socialAssistance) {
      this.loading = true;
      this.error = null;
      this.success = null;
      try {
        const response = await axiosInstance.post(
          "/social-assistance",
          socialAssistance,
        );
        this.success = response.data.message;
        // router.router.push({ name: "social-assistance" });
      } catch (error) {
        this.error = handleError(error);
      } finally {
        this.loading = false;
      }
    },
    async updateSocialAssistance(socialAssistance) {
      this.loading = true;
      this.error = null;
      this.success = null;
      try {
        const response = await axiosInstance.put(
          `/social-assistance/${socialAssistance.id}`,
          socialAssistance,
        );
        this.success = response.data.message;
        // router.router.push({ name: "social-assistance" });
      } catch (error) {
        this.error = handleError(error);
      } finally {
        this.loading = false;
      }
    },
    async deleteSocialAssistance(id) {
      this.loading = true;
      try {
        const response = await axiosInstance.delete(`/social-assistance/${id}`);
        this.success = response.data.message;
      } catch (error) {
        this.error = handleError(error);
      } finally {
        this.loading = false;
      }
    },
  },
});
