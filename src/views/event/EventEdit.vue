<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useEventStore } from "@/stores/event";
import { storeToRefs } from "pinia";
import ModalDelete from "@/components/ui/ModalDelete.vue";
import { RouterLink } from "vue-router";
import {
  formatDate,
  formatRupiah,
  calculateDays,
  parseRupiah,
} from "@/helpers/format.js";
import { watch } from "vue";
import iconEditSecondaryGreen from "@/assets/images/icons/edit-secondary-green.svg";
import iconEditBlack from "@/assets/images/icons/edit-black.svg";
import IconProfileCircleSecondaryGreen from "@/assets/images/icons/profile-circle-secondary-green.svg";
import IconProfileCircleBlack from "@/assets/images/icons/profile-circle-black.svg";
import iconDollarSecondaryGreen from "@/assets/images/icons/dollar-square-secondary-green.svg";
import iconDollarBlack from "@/assets/images/icons/dollar-square-black.svg";
import IconCalendarSecondaryGreen from "@/assets/images/icons/calendar-2-secondary-green.svg";
import IconCalendarBlack from "@/assets/images/icons/calendar-2-black.svg";
import Input from "@/components/ui/Input.vue";
import iconTimerSecondaryGreen from "@/assets/images/icons/timer-secondary-green.svg";
import iconTimerBlack from "@/assets/images/icons/timer-black.svg";

const route = useRoute();
const router = useRouter();

const eventStore = useEventStore(); // ✅ BUAT DULU

const { deleteEvent, getEventById, updateEvent } = eventStore;
const { loading, error, success } = storeToRefs(eventStore);

const event = ref({
  thumbnail: "",
  thumbnail_url: "",
  name: "",
  description: "",
  price: 0,
  date: "",
  time: "",
  is_active: 1,
});
const showModalDelete = ref(false);

const fetchData = async () => {
  const response = await getEventById(route.params.id);
  event.value = response;
  event.value.thumbnail_url = event.value.thumbnail;
  event.value.thumbnail = null;
};

import dayjs from "dayjs";

function getAge(dob) {
  return dayjs().diff(dayjs(dob), "year");
}

onMounted(() => {
  fetchData();
});

const handleSubmit = async () => {
  const payload = {
    ...event.value,
    price: parseRupiah(event.value.price),
  };

  const successUpdate = await updateEvent(payload);

  if (successUpdate) {
    router.push({
      name: "manage-event",
      params: { id: event.value.id },
    });
  }
};

const handleImageChange = (e) => {
  const file = e.target.files[0];
  event.value.thumbnail = file;
  event.value.thumbnail_url = URL.createObjectURL(file);
};

watch(
  () => event.value.price,
  (newAmount) => {
    event.value.price = formatRupiah(newAmount);
  },
);

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
          Events Desa
        </p>
        <span>/</span>
        <p
          class="last-of-type:text-desa-dark-green last-of-type:font-semibold capitalize"
        >
          Edit Event Desa
        </p>
      </div>
      <h1 class="font-semibold text-2xl">Edit Event Desa</h1>
    </div>
  </div>
  <form @submit.prevent="handleSubmit" id="myForm" class="capitalize">
    <div class="shrink-0 rounded-3xl p-6 bg-white flex flex-col gap-6 h-fit">
      <section id="Thumbnail" class="flex items-center justify-between">
        <h2
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Thumbnail Event Terkait
        </h2>
        <div class="flex-1 flex items-center justify-between">
          <div
            id="Photo-Preview"
            class="flex itce justify-center w-[120px] h-[100px] rounded-2xl overflow-hidden bg-desa-foreshadow"
          >
            <img
              id="Photo"
              :src="event.thumbnail_url"
              alt="image"
              class="size-full object-cover"
            />
          </div>
          <div class="relative">
            <input
              id="File"
              type="file"
              name="file"
              class="absolute opacity-0 left-0 w-full top-0 h-full"
              @change="handleImageChange"
              ref="thumbnail"
            />
            <button
              @click="$refs.thumbnail.click()"
              id="Upload"
              type="button"
              class="relative flex items-center py-4 px-6 rounded-2xl bg-desa-black gap-[10px]"
            >
              <img
                src="@/assets/images/icons/send-square-white.svg"
                alt="icon"
                class="size-6 shrink-0"
              />
              <p class="font-medium leading-5 text-white">Upload</p>
            </button>
          </div>
        </div>
      </section>
      <hr class="border-desa-background" />
      <section id="Nama-Event" class="flex items-center justify-between">
        <p
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Nama Event
        </p>
        <div class="flex flex-col gap-3 flex-1 shrink-0">
          <label class="relative group peer w-full">
            <input
              type="text"
              v-model="event.name"
              value="Belajar HTML Dasar Bersama"
              placeholder="Ketik nama event terkait"
              class="appearance-none outline-none w-full h-14 rounded-2xl ring-[1.5px] ring-desa-background focus:ring-desa-black py-4 px-12 gap-2 font-medium placeholder:text-desa-secondary transition-all duration-300"
            />
            <div
              class="absolute transform -translate-y-1/2 top-1/2 left-4 flex size-6 shrink-0"
            >
              <img
                src="@/assets/images/icons/edit-secondary-green.svg"
                class="size-6 hidden group-has-[:placeholder-shown]:flex"
                alt="icon"
              />
              <img
                src="@/assets/images/icons/edit-black.svg"
                class="size-6 flex group-has-[:placeholder-shown]:hidden"
                alt="icon"
              />
            </div>
          </label>
        </div>
      </section>
      <hr class="border-desa-background" />
      <section id="Status" class="flex items-center justify-between">
        <p
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Pilih status event
        </p>
        <div class="flex flex-1 gap-6 shrink-0">
          <label
            class="group flex w-full items-center h-14 rounded-2xl p-4 ring-[1.5px] ring-desa-background gap-2 has-[:checked]:ring-none has-[:checked]:bg-desa-foreshadow transition-setup"
          >
            <input
              type="radio"
              v-model="event.is_active"
              value="1"
              checked
              name="status"
              id=""
              class="flex size-[18px] shrink-0 accent-desa-secondary checked:accent-desa-dark-green transition-setup"
            />
            <span
              class="font-medium leading-5 text-desa-secondary w-full group-has-[:checked]:text-desa-dark-green transition-setup"
            >
              Open
            </span>
            <div class="flex size-6 shrink-0">
              <img
                src="@/assets/images/icons/tick-circle-secondary-green.svg"
                class="size-6 flex group-has-[:checked]:hidden"
                alt="icon"
              />
              <img
                src="@/assets/images/icons/tick-circle-dark-green.svg"
                class="size-6 hidden group-has-[:checked]:flex"
                alt="icon"
              />
            </div>
          </label>
          <label
            class="group flex w-full items-center h-14 rounded-2xl p-4 ring-[1.5px] ring-desa-background gap-2 has-[:checked]:ring-none has-[:checked]:bg-desa-foreshadow transition-setup"
          >
            <input
              type="radio"
              v-model="event.is_active"
              value="0"
              name="status"
              id=""
              class="flex size-[18px] shrink-0 accent-desa-secondary checked:accent-desa-dark-green transition-setup"
            />
            <span
              class="font-medium leading-5 text-desa-secondary w-full group-has-[:checked]:text-desa-dark-green transition-setup"
            >
              Closed
            </span>
            <div class="flex size-6 shrink-0">
              <img
                src="@/assets/images/icons/close-circle-secondary-green.svg"
                class="size-6 flex group-has-[:checked]:hidden"
                alt="icon"
              />
              <img
                src="@/assets/images/icons/close-circle-secondary-green.svg"
                class="size-6 hidden group-has-[:checked]:flex"
                alt="icon"
              />
            </div>
          </label>
        </div>
      </section>
      <hr class="border-desa-background" />
      <section id="Harga-Event" class="flex items-center justify-between">
        <p
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Harga Event
        </p>
        <div class="flex flex-col gap-3 flex-1 shrink-0">
          <Input
            v-model="event.price"
            type="text"
            placeholder="Ketik Nominal Event"
            :error-message="error?.price"
            :icon="iconDollarSecondaryGreen"
            :filled-icon="iconDollarBlack"
          />
        </div>
      </section>
      <hr class="border-desa-background" />
      <section id="Tanggal" class="flex items-center justify-between">
        <p
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Tanggal event dilakukan
        </p>
        <div class="flex items-center gap-6 flex-1 shrink-0">
          <Input
            v-model="event.date"
            type="date"
            placeholder="Ketik Tanggal Mulai Pembangunan"
            :error-message="error?.date"
            :icon="IconCalendarSecondaryGreen"
            :filled-icon="IconCalendarBlack"
          />
        </div>
      </section>
      <hr class="border-desa-background" />
      <section id="Waktu" class="flex items-center justify-between">
        <p
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Waktu event dilakukan
        </p>
        <div class="flex flex-col gap-3 flex-1 shrink-0">
          <Input
            v-model="event.time"
            type="time"
            placeholder="Ketik Waktu Event "
            :error-message="error?.Time"
            :icon="iconTimerSecondaryGreen"
            :filled-icon="iconTimerBlack"
          />
        </div>
      </section>
      <hr class="border-desa-background" />
      <section id="Deskripsi" class="flex items-center justify-between">
        <p
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Deskripsi event terkait
        </p>
        <div class="flex flex-col gap-3 flex-1 shrink-0">
          <textarea
            name=""
            v-model="event.description"
            id=""
            placeholder="Jelaskan lebih detail tentang event"
            rows="6"
            class="appearance-none outline-none w-full rounded-2xl ring-[1.5px] ring-desa-background focus:ring-desa-black py-4 px-4 gap-2 font-medium placeholder:text-desa-secondary transition-all duration-300"
          >
Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi, quisquam!
                                    </textarea
          >
        </div>
      </section>
      <hr class="border-desa-background w-[calc(100%+48px)] -mx-6" />
      <section id="Buttons" class="flex items-center justify-end gap-4">
        <RouterLink
          :to="{
            name: 'manage-event',
            params: { id: event.id },
          }"
        >
          <div
            class="py-[18px] rounded-2xl bg-desa-red w-[180px] text-center flex justify-center font-medium text-white"
          >
            Batal, Tidak jadi
          </div>
        </RouterLink>
        <button
          :disabled="loading"
          id="submitButton"
          type="submit"
          class="py-[18px] rounded-2xl disabled:bg-desa-grey w-[180px] text-center flex justify-center font-medium text-white bg-desa-dark-green transition-all duration-300"
        >
          <span v-if="!loading">Update</span>
          <span v-else>Loading...</span>
        </button>
      </section>
    </div>
  </form>
</template>
