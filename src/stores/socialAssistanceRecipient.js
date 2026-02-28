import { handleError } from "@/helpers/errorHelper";

import { axiosInstance } from "@/plugins/axios";
import { defineStore } from "pinia";
import router from "@/router/index.js";

// const router = useRouter();

export const useSocialAssistanceRecipientStore = defineStore(
  "social-assistance-recipient",
  {
    state: () => ({
      socialAssistanceRecipients: [],
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
      async fetchSocialAssistanceRecipient(params) {
        this.loading = true;
        try {
          const response = await axiosInstance.get(
            "/social-assistance-recipient",
            {
              params,
            },
          );
          this.socialAssistanceRecipients = response.data.data;
          this.meta = response.data.meta;
        } catch (error) {
          this.error = handleError(error);
        } finally {
          this.loading = false;
        }
      },
      async fetchSocialAssistanceRecipientPaginated(params) {
        this.loading = true;
        try {
          const response = await axiosInstance.get(
            "/social-assistance-recipient/all/paginated",
            { params },
          );
          this.socialAssistanceRecipients = response.data.data.data;
          this.meta = response.data.data.meta;
        } catch (error) {
          this.error = handleError(error);
        } finally {
          this.loading = false;
        }
      },
      async getSocialAssistanceRecipientById(id) {
        this.loading = true;
        try {
          const response = await axiosInstance.get(
            `/social-assistance-recipient/${id}`,
          );
          return response.data.data;
        } catch (error) {
          this.error = handleError(error);
        } finally {
          this.loading = false;
        }
      },
      async createSocialAssistanceRecipient(socialAssistance) {
        this.loading = true;
        this.error = null;
        this.success = null;
        try {
          const response = await axiosInstance.post(
            "/social-assistance-recipient",
            socialAssistance,
          );
          this.success = response.data.message;
          return true;
          // router.router.push({ name: "social-assistance" });
        } catch (error) {
          this.error = handleError(error);
          return false;
        } finally {
          this.loading = false;
        }
      },

      // async updateSocialAssistanceRecipient(socialAssistanceRecipient) {
      //   this.loading = true;
      //   this.error = null;
      //   this.success = null;
      //   try {
      //     const response = await axiosInstance.post(
      //       `/social-assistance-recipient/${socialAssistanceRecipient.id}`,
      //       {
      //         ...socialAssistanceRecipient,
      //         _method: "put",
      //       },
      //     );
      //     this.success = response.data.message;
      //     // router.push({
      //     //   name: "manage-social-assistance",
      //     //   params: { id: socialAssistanceRecipient.value.id },
      //     // });
      //     return true;
      //   } catch (error) {
      //     this.error = handleError(error);
      //     return false;
      //   } finally {
      //     this.loading = false;
      //   }
      // },

      async updateSocialAssistanceRecipient(socialAssistance) {
        this.loading = true;
        this.error = null;
        this.success = null;
        try {
          const formData = new FormData();
          formData.append("_method", "PUT");

          for (const key in socialAssistance) {
            if (
              socialAssistance[key] !== null &&
              socialAssistance[key] !== undefined
            ) {
              formData.append(key, socialAssistance[key]);
            }
          }

          const response = await axiosInstance.post(
            `/social-assistance-recipient/${socialAssistance.id}`,
            formData,
          );

          this.success = response.data.message;
          return true;
        } catch (error) {
          this.error = handleError(error);
          return false;
        } finally {
          this.loading = false;
        }
      },

      async deleteSocialAssistanceRecipient(id) {
        this.loading = true;
        try {
          const response = await axiosInstance.delete(
            `/social-assistance-recipient/${id}`,
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
