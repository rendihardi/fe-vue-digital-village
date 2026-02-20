import { handleError } from "@/helpers/errorHelper";

import { axiosInstance } from "@/plugins/axios";
import { defineStore } from "pinia";
import router from "@/router/index.js";

// const router = useRouter();

export const useDevelopmentStore = defineStore("development", {
  state: () => ({
    developments: [],
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
    async fetchDevelopment(params) {
      this.loading = true;
      try {
        const response = await axiosInstance.get("/development", {
          params,
        });
        this.developments = response.data.data;
        this.meta = response.data.meta;
      } catch (error) {
        this.error = handleError(error);
      } finally {
        this.loading = false;
      }
    },
    async fetchDevelopmentPaginated(params) {
      this.loading = true;
      try {
        const response = await axiosInstance.get(
          "/development/all/paginated",
          { params },
        );
        this.developments = response.data.data.data;
        this.meta = response.data.data.meta;
      } catch (error) {
        this.error = handleError(error);
      } finally {
        this.loading = false;
      }
    },
    async getDevelopmentById(id) {
      this.loading = true;
      try {
        const response = await axiosInstance.get(`/development/${id}`);
        return response.data.data;
      } catch (error) {
        this.error = handleError(error);
      } finally {
        this.loading = false;
      }
    },
    async createDevelopment(development) {
      this.loading = true;
      this.error = null;
      this.success = null;
      try {
        const response = await axiosInstance.post(
          "/development",
          development,
        );
        this.success = response.data.message;
        return true;
        // router.router.push({ name: "development" });
      } catch (error) {
        this.error = handleError(error);
        return false;
      } finally {
        this.loading = false;
      }
    },
    async updateDevelopment(development) {
      this.loading = true;
      this.error = null;
      this.success = null;
      try {
        const response = await axiosInstance.post(
          `/development/${development.id}`,
          {
            ...development,
            _method: "put",
          },
        );
        this.success = response.data.message;
        // router.push({
        //   name: "manage-development",
        //   params: { id: Development.value.id },
        // });
        return true;
      } catch (error) {
        this.error = handleError(error);
        return false;
      } finally {
        this.loading = false;
      }
    },
    async deleteDevelopment(id) {
      this.loading = true;
      try {
        const response = await axiosInstance.delete(`/development/${id}`);
        this.success = response.data.message;
      } catch (error) {
        this.error = handleError(error);
      } finally {
        this.loading = false;
      }
    },
  },
});

