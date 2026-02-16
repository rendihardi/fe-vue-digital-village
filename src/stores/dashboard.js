import { handleError } from "@/helpers/errorHelper";
import { axiosInstance } from "@/plugins/axios";
import Cookies from "js-cookie";
import { defineStore } from "pinia";

export const useDashboardStore = defineStore("dashboard", {
  state: () => ({
    dashboardData :null,
    loading: false,
    error: null,
    success: false,
  }),
  // getters: {
  //   isAuthenticated: (state) => state.user !== null,
  // },
  actions: {
    async fetchDashboardData() {
      this.loading = true;

      try {
        const response = await axiosInstance.get(
          "/dashboard",
        );

        this.dashboardData = response.data.data;
      } catch (error) {
        this.error = handleError(error);
      } finally {
        this.loading = false;
      }
    },
  },
});
