<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useEventStore } from "@/stores/event";
import { storeToRefs } from "pinia";
import ModalDelete from "@/components/ui/ModalDelete.vue";
import { RouterLink } from "vue-router";
import { formatDate, formatRupiah, calculateDays } from "@/helpers/format.js";
import { can } from "@/helpers/permissionHelper";

const route = useRoute();
const router = useRouter();

const eventStore = useEventStore(); // ✅ BUAT DULU

const { deleteEvent, getEventById } = eventStore;
const { loading, error, success } = storeToRefs(eventStore);

const event = ref({});
const showModalDelete = ref(false);

const fetchData = async () => {
  const response = await getEventById(route.params.id);
  event.value = response;
};

import dayjs from "dayjs";

function getAge(dob) {
  return dayjs().diff(dayjs(dob), "year");
}

onMounted(() => {
  fetchData();
});

async function handleDelete() {
  await deleteEvent(route.params.id);
  router.push({ name: "event" });
}

// const formatRupiah = (value) => {
//   return new Intl.NumberFormat("id-ID", {
//     style: "currency",
//     currency: "IDR",
//   }).format(value);
// };

// const formatToClientTimeZone = (date) => {
//   return dayjs(date).format("DD MMMM YYYY, HH:mm");
// };
</script>

<template>
  <div id="Header" class="flex items-center justify-between">
    <div class="flex flex-col gap-2">
      <div class="flex gap-1 items-center leading-5 text-desa-secondary">
        <p
          class="last-of-type:text-desa-dark-green last-of-type:font-semibold capitalize"
        >
          Events desa
        </p>
        <span>/</span>
        <p
          class="last-of-type:text-desa-dark-green last-of-type:font-semibold capitalize"
        >
          Detail Event Desa
        </p>
      </div>
      <h1 class="font-semibold text-2xl">Detail Event Desa</h1>
    </div>
    <RouterLink
      v-if="can('event-edit')"
      :to="{ name: 'edit-event', params: { id: event.id } }"
      class="flex items-center rounded-2xl py-4 px-6 gap-[10px] bg-desa-black"
    >
      <p class="font-medium text-white">Ubah Data</p>
      <img
        src="@/assets/images/icons/edit-white.svg"
        class="flex size-6 shrink-0"
        alt="icon"
      />
    </RouterLink>
  </div>
  <div
    v-if="success"
    class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-2xl relative mb-4"
    role="alert"
  >
    <span class="block sm:inline">{{ success }}</span>
    <button
      type="button"
      @click="success = null"
      class="absolute top-1/2 -translate-y-1/2 right-4"
    >
      <img
        src="@/assets/images/icons/close-circle-white.svg"
        class="flex size-6 shrink-0"
        alt="icon"
      />
    </button>
  </div>
  <div class="flex gap-[14px]">
    <section
      id="Informasi"
      class="flex flex-col shrink-0 w-[calc(525/1000*100%)] h-fit rounded-3xl p-6 gap-6 bg-white"
    >
      <p class="font-medium leading-5 text-desa-secondary">Informasi Event</p>
      <div class="flex items-center w-full">
        <div
          class="flex w-[100px] h-20 shrink-0 rounded-2xl overflow-hidden bg-desa-foreshadow"
        >
          <img
            :src="event.thumbnail"
            class="w-full h-full object-cover"
            alt="photo"
          />
        </div>
        <div class="flex flex-col gap-[6px] w-full ml-4 mr-9">
          <p class="font-semibold text-lg leading-[22.5px] line-clamp-1">
            {{ event.name }}
          </p>
          <div class="flex items-center gap-1">
            <img
              src="@/assets/images/icons/ticket-secondary-green.svg"
              class="flex size-[18px] shrink-0"
              alt="icon"
            />
            <p class="font-medium text-sm text-desa-secondary">
              Registration:
              <span
                class="font-medium text-base text-desa-dark-green"
                v-if="event.is_active === 1"
              >
                Open
              </span>
              <span
                class="font-medium text-base text-desa-dark-red"
                v-if="event.is_active === 0"
              >
                Close
              </span>
            </p>
          </div>
        </div>
      </div>
      <hr class="border-desa-foreshadow" />
      <div class="flex items-center w-full gap-3">
        <div
          class="flex size-[52px] shrink-0 rounded-2xl bg-desa-red/10 items-center justify-center"
        >
          <img
            src="@/assets/images/icons/ticket-2-red.svg"
            class="flex size-6 shrink-0"
            alt="icon"
          />
        </div>
        <div class="flex flex-col gap-1 w-full">
          <p class="font-semibold text-lg leading-[22.5px] text-desa-red">
            Rp{{ formatRupiah(event.price) }}
          </p>
          <span class="font-medium text-desa-secondary"> Harga Event </span>
        </div>
      </div>
      <hr class="border-desa-foreshadow" />
      <div class="flex items-center w-full gap-3">
        <div
          class="flex size-[52px] shrink-0 rounded-2xl bg-desa-blue/10 items-center justify-center"
        >
          <img
            src="@/assets/images/icons/profile-2user-blue.svg"
            class="flex size-6 shrink-0"
            alt="icon"
          />
        </div>
        <div class="flex flex-col gap-1 w-full">
          <p class="font-semibold text-lg leading-[22.5px] text-desa-blue">
            {{ event.event_participants?.length ?? 0 }} Warga
          </p>
          <span class="font-medium text-desa-secondary">
            Total Partisipasi
          </span>
        </div>
      </div>
      <hr class="border-desa-foreshadow" />
      <div class="flex items-center w-full gap-3">
        <div
          class="flex size-[52px] shrink-0 rounded-2xl bg-desa-foreshadow items-center justify-center"
        >
          <img
            src="@/assets/images/icons/calendar-2-dark-green.svg"
            class="flex size-6 shrink-0"
            alt="icon"
          />
        </div>
        <div class="flex flex-col gap-1 w-full">
          <p
            class="font-semibold text-lg leading-[22.5px] text-desa-dark-green"
          >
            {{ formatDate(event.date) }}
          </p>
          <span class="font-medium text-desa-secondary">
            Tanggal Pelaksaaan
          </span>
        </div>
      </div>
      <hr class="border-desa-foreshadow" />
      <div class="flex items-center w-full gap-3">
        <div
          class="flex size-[52px] shrink-0 rounded-2xl bg-desa-yellow/10 items-center justify-center"
        >
          <img
            src="@/assets/images/icons/clock-yellow.svg"
            class="flex size-6 shrink-0"
            alt="icon"
          />
        </div>
        <div class="flex flex-col gap-1 w-full">
          <p class="font-semibold text-lg leading-[22.5px] text-desa-yellow">
            {{ event.time }} WIB
          </p>
          <span class="font-medium text-desa-secondary">
            Tanggal Pelaksaaan
          </span>
        </div>
      </div>
      <hr class="border-desa-foreshadow" />
      <div class="flex flex-col gap-3">
        <p class="font-medium text-sm text-desa-secondary">Tentang Event</p>
        <p class="font-medium leading-8">
          {{ event.description }}
        </p>
      </div>
    </section>
    <section
      id="Participants"
      class="flex flex-col flex-1 h-fit shrink-0 rounded-3xl p-6 gap-6 bg-white"
    >
      <p class="font-medium leading-5 text-desa-secondary">
        Latest Participants
      </p>
      <div
        class="flex flex-col gap-[14px]"
        v-for="participant in event?.event_participants"
      >
        <div class="flex items-center gap-3 w-[302px] shrink-0">
          <div
            class="flex size-[54px] rounded-full bg-desa-foreshadow overflow-hidden"
          >
            <img
              src="@/assets/images/photos/kk-photo-1.png"
              class="w-full h-full object-cover"
              alt="icon"
            />
          </div>
          <div class="flex flex-col gap-1">
            <p class="font-semibold text-lg leading-5 text-desa-black">
              {{ participant.head_of_family?.user?.name }}
            </p>
            <p class="flex items-center gap-1">
              <img
                src="@/assets/images/icons/briefcase-secondary-green.svg"
                class="flex size-[18px] shrink-0"
                alt="icon"
              />
              <span class="font-medium text-sm text-desa-secondary">{{
                participant.head_of_family?.occupation
              }}</span>
            </p>
          </div>
        </div>
      </div>
      <a
        href="#"
        class="flex items-center justify-center h-14 rounded-2xl py-4 px-6 gap-[10px] bg-desa-dark-green"
      >
        <span class="font-medium leading-5 text-white">View All</span>
      </a>
    </section>
  </div>
</template>
