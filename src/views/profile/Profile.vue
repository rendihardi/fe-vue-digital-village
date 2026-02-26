<script setup>
import { useProfileStore } from "@/stores/profile";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { RouterLink } from "vue-router";
import { ref } from "vue";
import { can } from "@/helpers/permissionHelper";

const profileStore = useProfileStore();
const { profiles, success } = storeToRefs(profileStore);
const { fetchProfile } = profileStore;

const fetchData = () => {
  profileStore.fetchProfile();
};

const showModalImage = ref(false);
const selectedImage = ref(null);

const selectImage = (index) => {
  selectedImage.value = profiles.value.images[index].image;
  showModalImage.value = true;
};

import { computed } from "vue";

const firstThreeImages = computed(() => {
  return profiles.value?.images?.slice(0, 3) || [];
});

const remainingCount = computed(() => {
  const total = profiles.value?.images?.length || 0;
  return total > 3 ? total - 2 : 0;
});
onMounted(fetchData);
</script>

<template>
  <div v-if="!profiles">
    <div id="Header" class="flex items-center justify-between">
      <div class="flex flex-col gap-2">
        <h1 class="font-semibold text-2xl">Profile Desa</h1>
      </div>
      <RouterLink
        v-if="can('profile-create')"
        :to="{ name: 'create-profile' }"
        class="flex items-center rounded-2xl py-4 px-6 gap-[10px] bg-desa-dark-green"
      >
        <p class="font-medium text-white">Create Profile</p>
        <img
          src="@/assets/images/icons/add-square-white.svg"
          class="flex size-6 shrink-0"
          alt="icon"
        />
      </RouterLink>
    </div>
    <div
      id="Empty-Profile"
      class="flex flex-col flex-1 items-center justify-center gap-6"
    >
      <img
        src="@/assets/images/icons/user-remove-secondary-green.svg"
        class="size-20 object-cover"
        alt="icon"
      />
      <p class="font-semibold text-lg text-desa-secondary">
        Ops, Saat ini kamu belum membuat profile desa
      </p>
    </div>
  </div>

  <div v-else>
    <div id="Header" class="flex items-center justify-between">
      <div class="flex flex-col gap-2">
        <h1 class="font-semibold text-2xl">Profile Desa</h1>
      </div>
      <a
        v-if="can('profile-edit')"
        class="flex items-center rounded-2xl py-4 px-6 gap-[10px] bg-desa-black"
      >
        <p class="font-medium text-white">Ubah Data</p>
        <img
          src="@/assets/images/icons/edit-white.svg"
          class="flex size-6 shrink-0"
          alt="icon"
        />
      </a>
    </div>
    <div class="flex gap-[14px]">
      <section
        id="Nama-Desa"
        class="flex flex-col shrink-0 w-[calc(565/1000*100%)] h-fit rounded-3xl p-6 gap-6 bg-white"
      >
        <div class="flex items-center justify-between">
          <p class="font-medium leading-5 text-desa-secondary">Nama Desa</p>
          <img
            src="@/assets/images/icons/building-foreshadow-background.svg"
            class="flex size-12 shrink-0"
            alt="icon"
          />
        </div>
        <div id="Nama-Desa" class="flex flex-col gap-[6px]">
          <h1 class="font-bold text-[32px] leading-10">
            {{ profiles.name }}
          </h1>
          <div class="flex items-center gap-0.5">
            <img
              src="@/assets/images/icons/location-secondary-green.svg"
              class="flex size-6 shrink-0"
              alt="icon"
            />
            <span class="font-medium text-sm text-desa-secondary">{{
              profiles.location
            }}</span>
          </div>
        </div>
        <div id="Gallery" class="flex flex-col gap-[14px]">
          <div
            data-modal="Modal-Gallery"
            data-gallery="@/assets/images/thumbnails/desa-gallery-1.png"
            id="Thumbnail-Desa"
            class="flex w-[492px] h-[300px] shrink-0 rounded-3xl bg-desa-background overflow-hidden"
          >
            <img
              :src="profiles.thumbnail"
              class="w-full h-full object-cover"
              alt="thumbnail"
            />
          </div>

          <div class="grid grid-cols-3 gap-[14px] w-[492px]">
            <div
              v-for="(image, index) in firstThreeImages"
              :key="index"
              class="relative"
            >
              <button class="relative w-full" @click="selectImage(index)">
                <div
                  class="flex w-full h-[120px] rounded-3xl bg-desa-background overflow-hidden"
                >
                  <img
                    :src="image.image"
                    class="w-full h-full object-cover"
                    alt="thumbnail"
                  />
                </div>

                <!-- Overlay -->
                <div
                  v-if="remainingCount > 0 && index === 2"
                  class="absolute inset-0 rounded-3xl flex flex-col items-center justify-center bg-[#001B1ACC] text-white"
                >
                  <p class="font-semibold text-xl leading-6">
                    {{ remainingCount }}+
                  </p>
                  <p class="font-semibold text-sm">Photo</p>
                </div>
              </button>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-3">
          <p class="font-medium text-sm text-desa-secondary">Tentang Desa</p>
          <p class="font-medium leading-8">
            {{ profiles.about }}
          </p>
        </div>
        <div class="flex flex-col gap-3">
          <p class="font-medium text-sm text-desa-secondary">Peta Desa</p>
          <div class="rounded-2xl overflow-hidden max-w-full w-full !h-[350px]">
            <div id="embedded-map-display" class="size-full max-w-full">
              <iframe
                class="size-full border-0"
                frameborder="0"
                src="https://www.google.com/maps/embed/v1/place?q=Kelurahan+Sukajaya&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"
              ></iframe>
            </div>
          </div>
          <p class="font-medium text-sm leading-[28px] text-desa-secondary">
            {{ profiles.location }}
          </p>
        </div>
      </section>
      <section
        id="Detail-Desa"
        class="flex flex-col flex-1 h-fit shrink-0 rounded-3xl p-6 gap-6 bg-white"
      >
        <p class="font-medium leading-5 text-desa-secondary">Detail Desa</p>
        <div class="flex flex-col gap-[14px]">
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
                {{ profiles.headman }}
              </p>
              <p class="flex items-center gap-1">
                <span class="font-medium text-sm text-desa-secondary"
                  >Kepala Desa</span
                >
              </p>
            </div>
          </div>
          <hr class="border-desa-background" />
          <div class="flex items-center gap-3 w-[302px] shrink-0">
            <div
              class="flex size-[52px] rounded-2xl items-center justify-center bg-desa-foreshadow overflow-hidden"
            >
              <img
                src="@/assets/images/icons/profile-2user-dark-green.svg"
                class="flex size-6 shrink-0"
                alt="icon"
              />
            </div>
            <div class="flex flex-col gap-1">
              <p class="font-semibold text-lg leading-5">
                {{ profiles.people }}
              </p>
              <p class="font-medium text-sm text-desa-secondary">
                Jumlah Penduduk
              </p>
            </div>
          </div>
          <hr class="border-desa-background" />
          <div class="flex items-center gap-3 w-[302px] shrink-0">
            <div
              class="flex size-[52px] rounded-2xl items-center justify-center bg-desa-foreshadow overflow-hidden"
            >
              <img
                src="@/assets/images/icons/tree-dark-green.svg"
                class="flex size-6 shrink-0"
                alt="icon"
              />
            </div>
            <div class="flex flex-col gap-1">
              <p class="font-semibold text-lg leading-5">
                {{ profiles.agricultural_area }}m<sup>2</sup>
              </p>
              <p class="font-medium text-sm text-desa-secondary">
                Luas Pertanian
              </p>
            </div>
          </div>
          <hr class="border-desa-background" />
          <div class="flex items-center gap-3 w-[302px] shrink-0">
            <div
              class="flex size-[52px] rounded-2xl items-center justify-center bg-desa-foreshadow overflow-hidden"
            >
              <img
                src="@/assets/images/icons/grid-5-dark-green.svg"
                class="flex size-6 shrink-0"
                alt="icon"
              />
            </div>
            <div class="flex flex-col gap-1">
              <p class="font-semibold text-lg leading-5">
                {{ profiles.total_area }}m<sup>2</sup>
              </p>
              <p class="font-medium text-sm text-desa-secondary">Luas Area</p>
            </div>
          </div>
          <hr class="border-desa-background" />
          <div class="flex items-center gap-3 w-[302px] shrink-0">
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
              <p class="font-semibold text-lg leading-5">Mon, 24 Feb 2012</p>
              <p class="font-medium text-sm text-desa-secondary">
                Desa Dibangun
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
  <div
    id="Modal-Gallery"
    class="modal fixed inset-0 flex flex-col h-screen z-40 bg-[#080C1ACC]"
    v-if="showModalImage"
  >
    <div class="flex flex-col items-center justify-center m-auto">
      <div
        id="Main-Image-Container"
        class="flex aspect-[805/492] w-full max-w-[805px] overflow-hidden mx-auto"
      >
        <img
          :src="selectedImage"
          class="size-full object-contain object-center"
        />
      </div>

      <button
        class="btn-close-modal flex items-center rounded-full border border-white/10 py-3 px-4 mx-auto mt-[30px]"
        @click="showModalImage = false"
      >
        <img
          src="@/assets/images/icons/close-circle-white.svg"
          class="flex size-6 shrink-0"
          alt="icon"
        />
        <p class="font-medium leading-5 text-white">Tutup</p>
      </button>
    </div>

    <div
      class="flex flex-wrap items-center w-full border border-white/10 gap-4 p-4"
    >
      <button
        v-for="(image, index) in profiles.images"
        :key="index"
        @click="selectImage(index)"
        class="group relative flex w-[140px] h-[120px] shrink-0 rounded-3xl bg-desa-background overflow-hidden active"
      >
        <img
          :src="image.image"
          class="size-full object-cover group-[.active]:blur"
          alt="thumbnail"
        />
        <img
          src="@/assets/images/icons/eye-white-fill.svg"
          class="absolute hidden size-9 shrink-0 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 group-[.active]:flex"
          alt="icon"
        />
      </button>
    </div>
  </div>
</template>
