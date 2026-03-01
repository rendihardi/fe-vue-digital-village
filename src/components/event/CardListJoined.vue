<script setup>
import { RouterLink } from "vue-router";
import {
  formatToClientTimezone,
  formatDate,
  formatTime,
} from "@/helpers/format";
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const formatRupiah = (value) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(value);
};
</script>

<template>
  <div id="Recent-Event" class="flex flex-col gap-4">
    <div
      class="card flex flex-col gap-4 rounded-3xl p-6 bg-white border border-desa-background"
    >
      <div>
        <p class="flex items-center gap-1">
          <img
            src="@/assets/images/icons/calendar-2-secondary-green.svg"
            class="flex size-[18px] shrink-0"
            alt="icon"
          />
          <span class="font-medium text-sm text-desa-secondary">
            {{ formatToClientTimezone(item.created_at) }}
          </span>
          <!-- <span class="font-medium text-sm text-desa-secondary">
            {{ formatTime(item.event.time) }}
          </span> -->
        </p>
      </div>
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="group menunggu">
          <span
            v-if="item.payment_status === 'unpaid'"
            class="flex rounded-full py-[12px] w-[100px] justify-center bg-desa-yellow text-white font-semibold text-xs leading-[15px] shrink-0"
            >UNPAID</span
          >
          <span
            v-if="item.payment_status === 'cancelled'"
            class="flex rounded-full py-[12px] w-[100px] justify-center bg-desa-red text-white font-semibold text-xs leading-[15px] shrink-0"
            >CANCELLED</span
          >
          <span
            v-if="item.payment_status === 'paid'"
            class="flex rounded-full py-[12px] w-[100px] justify-center bg-desa-dark-green text-white font-semibold text-xs leading-[15px] shrink-0"
            >PAID</span
          >
        </div>
        <div>
          <RouterLink
            :to="{
              name: 'manage-event-participant',
              params: { id: item?.id },
            }"
            class="flex gap-[10px] rounded-2xl py-4 px-6 bg-desa-black"
          >
            <span
              class="font-medium text-white"
              v-if="user.role === 'head-of-family'"
            >
              Detail
            </span>
          </RouterLink>
        </div>
      </div>

      <hr class="border-desa-background" />

      <!-- Content Horizontal -->
      <div class="flex items-center w-full">
        <!-- Thumbnail -->
        <div
          class="flex w-[100px] h-20 shrink-0 rounded-2xl overflow-hidden bg-desa-foreshadow"
        >
          <img
            :src="item.event.thumbnail"
            class="w-full h-full object-cover"
            alt="photo"
          />
        </div>

        <!-- Info -->
        <div class="flex flex-col gap-[6px] w-full ml-4">
          <p class="font-semibold text-lg leading-[22.5px] line-clamp-1">
            {{ item.event.name }}
          </p>

          <div class="flex items-center gap-1">
            <img
              src="@/assets/images/icons/profile-2user-orange.svg"
              class="flex size-[18px] shrink-0"
              alt="icon"
            />
            <span class="font-medium text-sm text-desa-secondary">
              {{ item.quantity }} Jumlah Ticket
            </span>
          </div>
          <div class="flex items-center gap-1">
            <img
              src="@/assets/images/icons/calendar-2-secondary-green.svg"
              class="flex size-[18px] shrink-0"
              alt="icon"
            />
            <span class="font-medium text-sm text-desa-secondary">
              {{ formatDate(item.event.date) }}
            </span>
            <span class="font-medium text-sm text-desa-secondary">
              {{ formatTime(item.event.time) }}
            </span>
          </div>
        </div>

        <!-- Price -->
        <div class="flex items-center gap-3">
          <div class="flex flex-col gap-1 text-right">
            <p
              class="font-semibold text-lg leading-5 text-desa-dark-green text-nowrap"
            >
              {{ formatRupiah(item.total_price) }}
            </p>
            <p class="font-medium text-sm text-desa-secondary">Harga Bayar</p>
          </div>

          <div
            class="flex size-[52px] rounded-2xl items-center justify-center bg-desa-foreshadow overflow-hidden"
          >
            <img
              src="@/assets/images/icons/calendar-2-dark-green.svg"
              class="flex size-6 shrink-0"
              alt="icon"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
