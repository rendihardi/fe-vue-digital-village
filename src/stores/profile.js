import { handleError } from "@/helpers/errorHelper";

import { axiosInstance } from "@/plugins/axios";
import { defineStore } from "pinia";
import router from "@/router/index.js";

// const router = useRouter();

export const useProfileStore = defineStore("profile", {
  state: () => ({
    profiles: [],
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
    async fetchProfile(params) {
      this.loading = true;
      try {
        const response = await axiosInstance.get("/profile", {
          params,
        });
        this.profiles = response.data.data;
        this.meta = response.data.meta;
      } catch (error) {
        this.error = handleError(error);
      } finally {
        this.loading = false;
      }
    },
    async fetchProfilePaginated(params) {
      this.loading = true;
      try {
        const response = await axiosInstance.get(
          "/profile/all/paginated",
          { params },
        );
        this.profiles = response.data.data.data;
        this.meta = response.data.data.meta;
      } catch (error) {
        this.error = handleError(error);
      } finally {
        this.loading = false;
      }
    },
    async getProfileById(id) {
      this.loading = true;
      try {
        const response = await axiosInstance.get(`/profile/${id}`);
        return response.data.data;
      } catch (error) {
        this.error = handleError(error);
      } finally {
        this.loading = false;
      }
    },
    async createProfile(profile) {
      this.loading = true;
      this.error = null;
      this.success = null;
      try {
        const response = await axiosInstance.post(
          "/profile",
          profile,
        );
        this.success = response.data.message;
        return true;
        // router.router.push({ name: "profile" });
      } catch (error) {
        this.error = handleError(error);
        return false;
      } finally {
        this.loading = false;
      }
    },
    async updateProfile(profile) {
      this.loading = true;
      this.error = null;
      this.success = null;
      try {
        const response = await axiosInstance.post(
          `/profile/${profile.id}`,
          {
            ...profile,
            _method: "put",
          },
        );
        this.success = response.data.message;
        // router.push({
        //   name: "manage-profile",
        //   params: { id: Profile.value.id },
        // });
        return true;
      } catch (error) {
        this.error = handleError(error);
        return false;
      } finally {
        this.loading = false;
      }
    },
    async deleteProfile(id) {
      this.loading = true;
      try {
        const response = await axiosInstance.delete(`/profile/${id}`);
        this.success = response.data.message;
      } catch (error) {
        this.error = handleError(error);
      } finally {
        this.loading = false;
      }
    },
  },
});

