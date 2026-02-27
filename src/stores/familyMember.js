import { handleError } from "@/helpers/errorHelper";

import { axiosInstance } from "@/plugins/axios";
import { defineStore } from "pinia";
import router from "@/router";

export const useFamilyMemberStore = defineStore("family-member", {
  state: () => ({
    familyMembers: [],
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
    async fetchFamilyMembers(params) {
      this.loading = true;
      try {
        const response = await axiosInstance.get("/family-member", { params });
        this.familyMembers = response.data.data;
        this.meta = response.data.meta;
      } catch (error) {
        this.error = handleError(error);
      } finally {
        this.loading = false;
      }
    },

    async fetchFamilyMembersPaginated(params) {
      this.loading = true;
      try {
        const response = await axiosInstance.get(
          "/family-member/all/paginated",
          { params },
        );
        this.familyMembers = response.data.data.data;
        this.meta = response.data.data.meta;
      } catch (error) {
        this.error = handleError(error);
      } finally {
        this.loading = false;
      }
    },

    async getFamilyMemberById(id) {
      this.loading = true;
      try {
        const response = await axiosInstance.get(`/family-member/${id}`);
        return response.data.data;
      } catch (error) {
        this.error = handleError(error);
      } finally {
        this.loading = false;
      }
    },

    async createFamilyMember(familyMember) {
      this.loading = true;
      this.error = null;
      this.success = null;
      try {
        const response = await axiosInstance.post(
          "/family-member",
          familyMember,
        );
        this.success = response.data.message;
        // router.router.push({ name: "family-member" });
      } catch (error) {
        this.error = handleError(error);
      } finally {
        this.loading = false;
      }
    },

    async deleteFamilyMember(id) {
      this.loading = true;
      try {
        const response = await axiosInstance.delete(`/family-member/${id}`);
        this.success = response.data.message;
      } catch (error) {
        this.error = handleError(error);
      } finally {
        this.loading = false;
      }
    },
  },
});
