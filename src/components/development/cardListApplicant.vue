<script setup>
import { RouterLink } from "vue-router";
import { formatDate } from "@/helpers/format.js";
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
  <div id="Tabs-Content" class="flex flex-col">
    <div id="All" class="flex flex-col gap-6">
      <div class="card flex flex-col gap-6 rounded-3xl p-6 bg-white">
        <!-- Header -->
        <div class="flex items-center w-full">
          <div
            class="flex size-[54px] rounded-full bg-desa-foreshadow overflow-hidden shrink-0"
          >
            <img
              src="@/assets/images/photos/kk-photo-1.png"
              class="w-full h-full object-cover"
              alt="photo"
            />
          </div>
          <div class="flex flex-col gap-[6px] w-full ml-4 mr-9">
            <p class="font-semibold text-lg leading-[22.5px] line-clamp-1">
              {{ item.user?.name }}
            </p>
            <div class="flex items-center gap-1">
              <img
                src="@/assets/images/icons/user-square-secondary-green.svg"
                class="flex size-[18px] shrink-0"
                alt="icon"
              />
              <p class="font-medium text-sm text-desa-secondary">
                Email:
                <span class="font-medium text-base text-desa-dark-green">
                  {{ item.user?.email }}
                </span>
              </p>
            </div>
          </div>

          <!-- Badge Status -->
          <div
            class="flex rounded-full py-3 w-[100px] justify-center shrink-0"
            :class="{
              'bg-desa-yellow': item.status === 'pending',
              'bg-desa-green': item.status === 'approved',
              'bg-desa-red': item.status === 'rejected',
            }"
          >
            <span class="font-semibold text-xs text-white uppercase">
              {{ item.status }}
            </span>
          </div>
        </div>

        <hr class="border-desa-background" />

        <!-- Info Grid -->
        <div class="grid grid-cols-3 gap-3">
          <div class="flex items-center gap-3">
            <div
              class="flex size-[52px] rounded-2xl items-center justify-center bg-desa-foreshadow overflow-hidden"
            >
              <img
                src="@/assets/images/icons/calendar-2-dark-green.svg"
                class="flex size-6 shrink-0"
                alt="icon"
              />
            </div>
            <div class="flex flex-col gap-1">
              <p class="font-semibold text-lg leading-5 text-desa-dark-green">
                {{ formatDate(item.created_at) }}
              </p>
              <p class="font-medium text-sm text-desa-secondary">
                Tanggal Pengajuan
              </p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div
              class="flex size-[52px] rounded-2xl items-center justify-center bg-desa-blue/10 overflow-hidden"
            >
              <img
                src="@/assets/images/icons/profile-2user-blue.svg"
                class="flex size-6 shrink-0"
                alt="icon"
              />
            </div>
            <div class="flex flex-col gap-1">
              <p
                class="font-semibold text-lg leading-5 text-desa-blue line-clamp-1"
              >
                {{ item.development?.name }}
              </p>
              <p class="font-medium text-sm text-desa-secondary">
                Nama Pembangunan
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
