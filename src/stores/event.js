import { handleError } from "@/helpers/errorHelper";

import { axiosInstance } from "@/plugins/axios";
import { defineStore } from "pinia";
import router from "@/router/index.js";

// const router = useRouter();

export const useEventStore = defineStore("event", {
  state: () => ({
    events: [],
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
    async fetchEvent(params) {
      this.loading = true;
      try {
        const response = await axiosInstance.get("/event", {
          params,
        });
        this.events = response.data.data;
        this.meta = response.data.meta;
      } catch (error) {
        this.error = handleError(error);
      } finally {
        this.loading = false;
      }
    },
    async fetchEventPaginated(params) {
      this.loading = true;
      try {
        const response = await axiosInstance.get(
          "/event/all/paginated",
          { params },
        );
        this.events = response.data.data.data;
        this.meta = response.data.data.meta;
      } catch (error) {
        this.error = handleError(error);
      } finally {
        this.loading = false;
      }
    },
    async getEventById(id) {
      this.loading = true;
      try {
        const response = await axiosInstance.get(`/event/${id}`);
        return response.data.data;
      } catch (error) {
        this.error = handleError(error);
      } finally {
        this.loading = false;
      }
    },
    async createEvent(event) {
      this.loading = true;
      this.error = null;
      this.success = null;
      try {
        const response = await axiosInstance.post(
          "/event",
          event,
        );
        this.success = response.data.message;
        return true;
        // router.router.push({ name: "event" });
      } catch (error) {
        this.error = handleError(error);
        return false;
      } finally {
        this.loading = false;
      }
    },
    async updateEvent(event) {
      this.loading = true;
      this.error = null;
      this.success = null;
      try {
        const response = await axiosInstance.post(
          `/event/${event.id}`,
          {
            ...event,
            _method: "put",
          },
        );
        this.success = response.data.message;
        // router.push({
        //   name: "manage-event",
        //   params: { id: Event.value.id },
        // });
        return true;
      } catch (error) {
        this.error = handleError(error);
        return false;
      } finally {
        this.loading = false;
      }
    },
    async deleteEvent(id) {
      this.loading = true;
      try {
        const response = await axiosInstance.delete(`/event/${id}`);
        this.success = response.data.message;
      } catch (error) {
        this.error = handleError(error);
      } finally {
        this.loading = false;
      }
    },
  },
});

