<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useEventStore } from "@/stores/event";
import { storeToRefs } from "pinia";
import ModalDelete from "@/components/ui/ModalDelete.vue";
import { RouterLink } from "vue-router";
import { formatDate, formatRupiah, calculateDays } from "@/helpers/format.js";
import { can } from "@/helpers/permissionHelper";
import { useAuthStore } from "@/stores/auth";
import { useEventParticipantStore } from "@/stores/eventParticipant";

const eventParticipantStore = useEventParticipantStore();
const {
  eventParticipants,
  loading: eventParticipantLoading,
  error: eventParticipantError,
  success: eventParticipantSuccess,
} = storeToRefs(eventParticipantStore);

const {
  createEventParticipant,
  getEventParticipantById,
  updateEventParticipant,
} = eventParticipantStore;

const eventParticipant = ref({});

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const route = useRoute();
const router = useRouter();

// const eventStore = useEventStore(); // ✅ BUAT DULU

// const { deleteEvent, getEventById } = eventStore;
// const { loading, error, success } = storeToRefs(eventStore);

// const event = ref({});
const showModalDelete = ref(false);

const fetchData = async () => {
  console.log("route.params.id:", route.params.id); // ← cek ini dulu
  const response = await getEventParticipantById(route.params.id);
  console.log("response:", response);
  eventParticipant.value = response;
};

const showSuccessModal = ref(false);

const handleSubmit = async () => {
  //   const response = await createEventParticipant(eventParticipant.value);
  const response = eventParticipant.value.snap_token;
  if (!response) {
    alert("Pembeyaran tidak ditemukan, silahkan buat order ulang");
    return;
  }
  window.snap.pay(response, {
    onSuccess: function (result) {
      /* You may add your own implementation here */
      showSuccessModal.value = true;
      fetchData();
      //   eventParticipant.value.quantity = 0;
      //   eventParticipant.value.total_price = 0;
    },
    onPending: function (result) {
      /* You may add your own implementation here */
      console.log(result);
    },
    onError: function (result) {
      /* You may add your own implementation here */
      console.log(result);
    },
    onClose: function () {
      /* You may add your own implementation here */
    },
  });
};

import dayjs from "dayjs";

function getAge(dob) {
  return dayjs().diff(dayjs(dob), "year");
}

onMounted(() => {
  fetchData();
});

// async function handleDelete() {
//   await deleteEvent(route.params.id);
//   router.push({ name: "event" });
// }
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
          Detail Pemesanan Event Desa
        </p>
      </div>
      <h1 class="font-semibold text-2xl">Detail Pemesanan Event Desa</h1>
    </div>
  </div>
  <!-- <div
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
  </div> -->
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
            :src="eventParticipant?.event?.thumbnail"
            class="w-full h-full object-cover"
            alt="photo"
          />
        </div>
        <div class="flex flex-col gap-[6px] w-full ml-4 mr-9">
          <p class="font-semibold text-lg leading-[22.5px] line-clamp-1">
            {{ eventParticipant?.event?.name }}
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
                v-if="eventParticipant?.event?.is_active === 1"
              >
                Open
              </span>
              <span
                class="font-medium text-base text-desa-dark-red"
                v-if="eventParticipant?.event?.is_active === 0"
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
            Rp{{ formatRupiah(eventParticipant?.event?.price) }}
          </p>
          <span class="font-medium text-desa-secondary"> Harga Event </span>
        </div>
      </div>
      <hr class="border-desa-foreshadow" />
      <!-- <div class="flex items-center w-full gap-3">
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
            {{ eventParticipant?.event?.event_participants?.length ?? 0 }} Warga
          </p>
          <span class="font-medium text-desa-secondary">
            Total Partisipasi
          </span>
        </div>
      </div> -->
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
            {{ formatDate(eventParticipant?.event?.date) }}
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
            {{ eventParticipant?.event?.time }} WIB
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
          {{ eventParticipant?.event?.description }}
        </p>
      </div>
    </section>
    <section
      v-if="user.role === 'head-of-family'"
      id="Participants-join"
      class="flex flex-col flex-1 h-fit shrink-0 rounded-3xl p-6 gap-6 bg-white"
    >
      <form @submit.prevent="handleSubmit" class="flex-1">
        <div class="flex flex-col h-fit gap-6 rounded-2xl bg-white py-6 flex-1">
          <div class="flex items-center justify-between px-6">
            <h2
              class="font-medium text-sm leading-[17.5px] text-desa-secondary"
            >
              Detail Pembayaran
            </h2>

            <!-- STATUS -->
            <div>
              <span
                v-if="eventParticipant.payment_status === 'unpaid'"
                class="flex rounded-full py-[12px] w-[100px] justify-center bg-desa-yellow text-white font-semibold text-xs leading-[15px] shrink-0"
                >UNPAID</span
              >
              <span
                v-if="eventParticipant.payment_status === 'cancelled'"
                class="flex rounded-full py-[12px] w-[100px] justify-center bg-desa-red text-white font-semibold text-xs leading-[15px] shrink-0"
                >CANCELLED</span
              >
              <span
                v-if="eventParticipant.payment_status === 'paid'"
                class="flex rounded-full py-[12px] w-[100px] justify-center bg-desa-dark-green text-white font-semibold text-xs leading-[15px] shrink-0"
                >PAID</span
              >
            </div>
          </div>
          <section
            id="Harga-Event"
            class="flex items-center justify-between px-6"
          >
            <div class="point flex items-center gap-3">
              <div class="p-[14px] shrink-0 bg-[#FF507017] rounded-2xl">
                <img
                  src="@/assets/images/icons/ticket-2-red.svg"
                  alt="icon"
                  class="size-6 shrink-0"
                />
              </div>
              <div class="flex flex-col gap-1">
                <p class="font-semibold text-lg leading-[22.5px] text-desa-red">
                  Rp{{ formatRupiah(eventParticipant?.event?.price) }}
                </p>
                <h3
                  class="font-medium text-sm leading-[17.5px] text-desa-secondary"
                >
                  Harga Event
                </h3>
              </div>
            </div>
          </section>
          <hr class="border-desa-background" />
          <section id="Detail-Payment" class="flex flex-col gap-6 px-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-[6px]">
                <img
                  src="@/assets/images/icons/receipt-2-secondary-green.svg"
                  alt="icon"
                  class="size-6 shrink-0"
                />
                <h4
                  class="font-medium text-sm leading-[17.5px] text-desa-secondary"
                >
                  Metode Pembayaran
                </h4>
              </div>
              <img
                src="@/assets/images/icons/midtrans.svg"
                alt="icon"
                class="w-[108px] shrink-0"
              />
            </div>
            <hr class="border-desa-background" />

            <hr class="border-desa-background" />
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-[6px]">
                <img
                  src="@/assets/images/icons/profile-2user-secondary-green-bold.svg"
                  alt="icon"
                  class="size-6 shrink-0"
                />
                <h4
                  class="font-medium text-sm leading-[17.5px] text-desa-secondary"
                >
                  Quanity
                </h4>
              </div>
              <p class="font-semibold text-lg leading-[22.5px]">
                {{ eventParticipant?.quantity }}x orang
              </p>
            </div>
            <hr class="border-desa-background" />
            <label class="flex items-center justify-between">
              <div class="flex items-center gap-[6px]">
                <img
                  src="@/assets/images/icons/money-secondary-green.svg"
                  alt="icon"
                  class="size-6 shrink-0"
                />
                <h4
                  class="font-medium text-sm leading-[17.5px] text-desa-secondary"
                >
                  Harga Total
                </h4>
              </div>
              <input
                type="text"
                name="harga_total"
                class="font-semibold text-lg leading-[22.5px] text-right focus:outline-none"
                readonly
              />
              <p
                class="font-semibold text-lg leading-[22.5px] text-right focus:outline-none"
              >
                {{ formatRupiah(eventParticipant?.total_price) }}
              </p>
            </label>
            <hr class="border-desa-background" />
          </section>
          <button
            v-if="eventParticipant.payment_status === 'unpaid'"
            type="submit"
            class="bg-desa-dark-green mx-6 rounded-2xl py-[18px] flex justify-center items-center text-center text-white font-medium leading-5"
          >
            Bayar Sekarang
          </button>
        </div>
      </form>
    </section>
  </div>
  <div
    id="modal"
    class="fixed inset-0 flex items-center justify-center bg-[#001B1ACC] z-50"
    v-if="showSuccessModal"
  >
    <div
      class="bg-white rounded-2xl p-4 w-[320px] flex flex-col items-center gap-6"
    >
      <div class="flex flex-col items-center gap-4">
        <h3 class="font-semibold text-2xl leading-8 text-desa-secondary">
          Pembayaran Berhasil
        </h3>
        <p class="font-medium text-base leading-5 text-desa-secondary">
          Terima kasih telah berpartisipasi dalam acara ini.
        </p>
      </div>

      <button
        type="button"
        class="bg-desa-dark-green rounded-2xl py-[18px] flex justify-center items-center text-center text-white font-medium leading-5 w-full"
        @click="showSuccessModal = false"
      >
        Tutup
      </button>
    </div>
  </div>
</template>
