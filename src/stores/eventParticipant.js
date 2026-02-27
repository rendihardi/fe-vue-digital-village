import { handleError } from "@/helpers/errorHelper";

import { axiosInstance } from "@/plugins/axios";
import { defineStore } from "pinia";
import router from "@/router/index.js";

// const router = useRouter();

export const useEventParticipantStore = defineStore("event-participant", {
  state: () => ({
    eventParticipants: [],
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
    async fetchEventParticipant(params) {
      this.loading = true;
      try {
        const response = await axiosInstance.get("/event-participant", {
          params,
        });
        this.eventParticipants = response.data.data;
        this.meta = response.data.meta;
      } catch (error) {
        this.error = handleError(error);
      } finally {
        this.loading = false;
      }
    },
    async fetchEventParticipantPaginated(params) {
      this.loading = true;
      try {
        const response = await axiosInstance.get(
          "/event-participant/all/paginated",
          { params },
        );
        this.eventParticipants = response.data.data.data;
        this.meta = response.data.data.meta;
      } catch (error) {
        this.error = handleError(error);
      } finally {
        this.loading = false;
      }
    },
    async getEventParticipantById(id) {
      this.loading = true;
      try {
        const response = await axiosInstance.get(`/event-participant/${id}`);
        return response.data.data;
      } catch (error) {
        this.error = handleError(error);
      } finally {
        this.loading = false;
      }
    },
    async createEventParticipant(event) {
      this.loading = true;
      this.error = null;
      this.success = null;
      try {
        const response = await axiosInstance.post("/event-participant", event);
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
    async updateEventParticipant(event) {
      this.loading = true;
      this.error = null;
      this.success = null;
      try {
        const response = await axiosInstance.post(
          `/event-participant/${event.id}`,
          {
            ...event,
            _method: "put",
          },
        );
        this.success = response.data.message;
        // router.push({
        //   name: "manage-event",
        //   params: { id: EventParticipant.value.id },
        // });
        return true;
      } catch (error) {
        this.error = handleError(error);
        return false;
      } finally {
        this.loading = false;
      }
    },
    async deleteEventParticipant(id) {
      this.loading = true;
      try {
        const response = await axiosInstance.delete(`/event-participant/${id}`);
        this.success = response.data.message;
      } catch (error) {
        this.error = handleError(error);
      } finally {
        this.loading = false;
      }
    },
  },
});
