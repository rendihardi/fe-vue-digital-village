<script setup>
import { useProfileStore } from "@/stores/profile";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { RouterLink } from "vue-router";

const profileStore = useProfileStore();
const { profiles, success } = storeToRefs(profileStore);
const { fetchProfile } = profileStore;

const fetchData = () => {
  profileStore.fetchProfile();
};

onMounted(fetchData);
</script>

<template>
  <div v-if="!profiles">
    <div id="Header" class="flex items-center justify-between">
      <div class="flex flex-col gap-2">
        <h1 class="font-semibold text-2xl">Profile Desa</h1>
      </div>
      <RouterLink
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
              src="@/assets/images/thumbnails/desa-gallery-1.png"
              class="w-full h-full object-cover"
              alt="thumbnail"
            />
          </div>
          <div class="grid grid-cols-3 gap-[14px] w-[492px]">
            <button
              data-modal="Modal-Gallery"
              data-gallery="@/assets/images/thumbnails/desa-gallery-2.png"
              class="relative"
            >
              <div
                class="thumbnail-selection flex w-full h-[120px] shrink-0 rounded-3xl bg-desa-background overflow-hidden"
              >
                <img
                  src="@/assets/images/thumbnails/desa-gallery-2.png"
                  class="w-full h-full object-cover"
                  alt="thumbnail"
                />
              </div>
            </button>
            <button
              data-modal="Modal-Gallery"
              data-gallery="@/assets/images/thumbnails/desa-gallery-3.png"
              class="relative"
            >
              <div
                class="thumbnail-selection flex w-full h-[120px] shrink-0 rounded-3xl bg-desa-background overflow-hidden"
              >
                <img
                  src="@/assets/images/thumbnails/desa-gallery-3.png"
                  class="w-full h-full object-cover"
                  alt="thumbnail"
                />
              </div>
            </button>
            <button
              data-modal="Modal-Gallery"
              data-gallery="@/assets/images/thumbnails/desa-gallery-4.png"
              class="relative"
            >
              <div
                class="thumbnail-selection flex w-full h-[120px] shrink-0 rounded-3xl bg-desa-background overflow-hidden"
              >
                <img
                  src="@/assets/images/thumbnails/desa-gallery-4.png"
                  class="w-full h-full object-cover"
                  alt="thumbnail"
                />
              </div>
              <div
                class="absolute inset-0 rounded-3xl overflow-hidden flex flex-col items-center justify-center bg-[#001B1ACC] text-white"
              >
                <p class="font-semibold text-xl leading-6">2+</p>
                <p class="font-semibold text-sm text-white">Photo</p>
              </div>
            </button>
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
</template>
