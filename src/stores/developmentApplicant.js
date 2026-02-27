import { handleError } from "@/helpers/errorHelper";

import { axiosInstance } from "@/plugins/axios";
import { defineStore } from "pinia";
import router from "@/router/index.js";

// const router = useRouter();

export const useDevelopmentApplicantStore = defineStore(
  "development-applicant",
  {
    state: () => ({
      developmentApplicants: [],
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
      async fetchDevelopmentApplicant(params) {
        this.loading = true;
        try {
          const response = await axiosInstance.get("/development-applicant", {
            params,
          });
          this.developmentApplicants = response.data.data;
          this.meta = response.data.meta;
        } catch (error) {
          this.error = handleError(error);
        } finally {
          this.loading = false;
        }
      },
      async fetchDevelopmentApplicantPaginated(params) {
        this.loading = true;
        try {
          const response = await axiosInstance.get(
            "/development-applicant/all/paginated",
            {
              params,
            },
          );
          this.developmentApplicants = response.data.data.data;
          this.meta = response.data.data.meta;
        } catch (error) {
          this.error = handleError(error);
        } finally {
          this.loading = false;
        }
      },
      async getDevelopmentApplicantById(id) {
        this.loading = true;
        try {
          const response = await axiosInstance.get(
            `/development-applicant/${id}`,
          );
          return response.data.data;
        } catch (error) {
          this.error = handleError(error);
        } finally {
          this.loading = false;
        }
      },
      async createDevelopmentApplicant(development) {
        this.loading = true;
        this.error = null;
        this.success = null;
        try {
          const response = await axiosInstance.post(
            "/development-applicant",
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
      async updateDevelopmentApplicant(development) {
        this.loading = true;
        this.error = null;
        this.success = null;
        try {
          const response = await axiosInstance.post(
            `/development-applicant/${development.id}`,
            {
              ...development,
              _method: "put",
            },
          );
          this.success = response.data.message;
          // router.push({
          //   name: "manage-development",
          //   params: { id: DevelopmentApplicant.value.id },
          // });
          return true;
        } catch (error) {
          this.error = handleError(error);
          return false;
        } finally {
          this.loading = false;
        }
      },
      async deleteDevelopmentApplicant(id) {
        this.loading = true;
        try {
          const response = await axiosInstance.delete(
            `/development-applicant/${id}`,
          );
          this.success = response.data.message;
        } catch (error) {
          this.error = handleError(error);
        } finally {
          this.loading = false;
        }
      },
    },
  },
);
