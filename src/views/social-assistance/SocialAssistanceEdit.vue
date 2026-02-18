<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useSocialAssistanceStore } from "@/stores/socialAssistance";
import { storeToRefs } from "pinia";
import ModalDelete from "@/components/ui/ModalDelete.vue";
import Input from "@/components/ui/Input.vue";
import iconEditSecondaryGreen from "@/assets/images/icons/edit-secondary-green.svg";
import iconEditBlack from "@/assets/images/icons/edit-black.svg";

import iconDollarSecondaryGreen from "@/assets/images/icons/dollar-square-secondary-green.svg";
import iconDollarBlack from "@/assets/images/icons/dollar-square-black.svg";
import iconUserSecondaryGreen from "@/assets/images/icons/user-square-secondary-green.svg";
import iconUserBlack from "@/assets/images/icons/user-square-black.svg";
import { formatRupiah, parseRupiah } from "@/helpers/format";
import { watch } from "vue";

const route = useRoute();
const router = useRouter();

const socialAssistanceStore = useSocialAssistanceStore(); // ✅ BUAT DULU

const {
  deleteSocialAssistance,
  getSocialAssistanceById,
  updateSocialAssistance,
} = socialAssistanceStore;
const { loading, error, success } = storeToRefs(socialAssistanceStore);

const socialAssistance = ref({
  thumbnail: null,
  thumbnail_url: "",
  name: "",
  description: "",
  category: "",
  amount: 0,
  provider: "",
  is_available: true,
});
const handleImageChange = (event) => {
  const file = event.target.files[0];
  socialAssistance.value.thumbnail = file;
  socialAssistance.value.thumbnail_url = URL.createObjectURL(file);
};
const categories = ref(["staple", "cash", "health", "subsidized fuel"]);
const showModalDelete = ref(false);

const fetchData = async () => {
  const response = await getSocialAssistanceById(route.params.id);
  socialAssistance.value = response;
  socialAssistance.value.thumbnail_url = socialAssistance.value.thumbnail;
  socialAssistance.value.thumbnail = null;
};

import dayjs from "dayjs";

function getAge(dob) {
  return dayjs().diff(dayjs(dob), "year");
}

onMounted(() => {
  fetchData();
});

async function handleDelete() {
  await deleteSocialAssistance(route.params.id);
  router.push({ name: "social-assistance" });
}

// const formatRupiah = (value) => {
//   return new Intl.NumberFormat("id-ID", {
//     style: "currency",
//     currency: "IDR",
//   }).format(value);
// };

watch(
  () => socialAssistance.value.amount,
  (newAmount) => {
    socialAssistance.value.amount = formatRupiah(newAmount);
  },
);

const hadleSubmit = async () => {
  const payload = {
    ...socialAssistance.value,
    amount: parseRupiah(socialAssistance.value.amount),
  };

  const successUpdate = await updateSocialAssistance(payload);

  if (successUpdate) {
    router.push({
      name: "manage-social-assistance",
      params: { id: socialAssistance.value.id },
    });
  }
};

const formatToClientTimeZone = (date) => {
  return dayjs(date).format("DD MMMM YYYY, HH:mm");
};
</script>

<template>
  <div id="Header" class="flex items-center justify-between">
    <div class="flex flex-col gap-2">
      <div class="flex gap-1 items-center leading-5 text-desa-secondary">
        <p
          class="last-of-type:text-desa-dark-green last-of-type:font-semibold capitalize"
        >
          Bantuan sosial
        </p>
        <span>/</span>
        <p
          class="last-of-type:text-desa-dark-green last-of-type:font-semibold capitalize"
        >
          Ubah bantuan sosial
        </p>
      </div>
      <h1 class="font-semibold text-2xl">Ubah Bantuan Sosial</h1>
    </div>
  </div>
  <form @submit.prevent="hadleSubmit" id="myForm" class="capitalize">
    <div class="shrink-0 rounded-3xl p-6 bg-white flex flex-col gap-6 h-fit">
      <section id="Thumbnail" class="flex items-center justify-between">
        <h2
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Thumbnail Bantuan Sosial
        </h2>
        <div class="flex-1 flex items-center justify-between">
          <div
            id="Photo-Preview"
            class="flex itce justify-center w-[120px] h-[100px] rounded-2xl overflow-hidden bg-desa-foreshadow"
          >
            <img
              id="Photo"
              :src="socialAssistance.thumbnail_url"
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
      <section
        id="Nama-Bantuan-Sosial"
        class="flex items-center justify-between"
      >
        <p
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Nama Bantuan Sosial
        </p>
        <div class="flex flex-col gap-3 flex-1 shrink-0">
          <Input
            v-model="socialAssistance.name"
            type="text"
            placeholder="Ketik Nama Bantuan"
            :error-message="error?.name"
            :icon="iconEditSecondaryGreen"
            :filled-icon="iconEditBlack"
          />
        </div>
      </section>
      <hr class="border-desa-background" />
      <section id="Kategori" class="flex items-center justify-between">
        <p
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Pilih Opsi Kategori
        </p>
        <div class="grid grid-cols-2 flex-1 gap-6 shrink-0">
          <label
            class="group flex w-full items-center h-14 rounded-2xl p-4 ring-[1.5px] ring-desa-background gap-2 has-[:checked]:ring-none has-[:checked]:bg-desa-foreshadow transition-setup"
          >
            <input
              type="radio"
              name="category"
              id=""
              value="staple"
              v-model="socialAssistance.category"
              class="flex size-[18px] shrink-0 accent-desa-secondary checked:accent-desa-dark-green transition-setup"
            />
            <span
              class="font-medium leading-5 text-desa-secondary w-full group-has-[:checked]:text-desa-dark-green transition-setup"
            >
              Bahan Pokok
            </span>
            <div class="flex size-6 shrink-0">
              <img
                src="@/assets/images/icons/bag-2-secondary-green.svg"
                class="size-6 flex group-has-[:checked]:hidden"
                alt="icon"
              />
              <img
                src="@/assets/images/icons/bag-2-dark-green.svg"
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
              name="category"
              id=""
              value="cash"
              v-model="socialAssistance.category"
              class="flex size-[18px] shrink-0 accent-desa-secondary checked:accent-desa-dark-green transition-setup"
            />
            <span
              class="font-medium leading-5 text-desa-secondary w-full group-has-[:checked]:text-desa-dark-green transition-setup"
            >
              Uang Tunai
            </span>
            <div class="flex size-6 shrink-0">
              <img
                src="@/assets/images/icons/money-secondary-green.svg"
                class="size-6 flex group-has-[:checked]:hidden"
                alt="icon"
              />
              <img
                src="@/assets/images/icons/money-dark-green.svg"
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
              name="category"
              id=""
              value="subsidized fuel"
              v-model="socialAssistance.category"
              class="flex size-[18px] shrink-0 accent-desa-secondary checked:accent-desa-dark-green transition-setup"
            />
            <span
              class="font-medium leading-5 text-desa-secondary w-full group-has-[:checked]:text-desa-dark-green transition-setup"
            >
              BBM Subsidi
            </span>
            <div class="flex size-6 shrink-0">
              <img
                src="@/assets/images/icons/gas-station-secondary-green.svg"
                class="size-6 flex group-has-[:checked]:hidden"
                alt="icon"
              />
              <img
                src="@/assets/images/icons/gas-station-dark-green.svg"
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
              name="category"
              id=""
              value="health"
              v-model="socialAssistance.category"
              class="flex size-[18px] shrink-0 accent-desa-secondary checked:accent-desa-dark-green transition-setup"
            />
            <span
              class="font-medium leading-5 text-desa-secondary w-full group-has-[:checked]:text-desa-dark-green transition-setup"
            >
              Kesehatan
            </span>
            <div class="flex size-6 shrink-0">
              <img
                src="@/assets/images/icons/health-secondary-green.svg"
                class="size-6 flex group-has-[:checked]:hidden"
                alt="icon"
              />
              <img
                src="@/assets/images/icons/health-secondary-green.svg"
                class="size-6 hidden group-has-[:checked]:flex"
                alt="icon"
              />
            </div>
          </label>
        </div>
      </section>
      <hr class="border-desa-background" />
      <section id="Nominal Bantuan" class="flex items-center justify-between">
        <p
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Nominal Bantuan
        </p>
        <div class="flex flex-col gap-3 flex-1 shrink-0">
          <label class="relative group peer w-full">
            <Input
              v-model="socialAssistance.amount"
              type="text"
              placeholder="Ketik Nominal Bantuan"
              :error-message="error?.amount"
              :icon="iconDollarSecondaryGreen"
              :filled-icon="iconDollarBlack"
            />
          </label>
        </div>
      </section>
      <hr class="border-desa-background" />
      <section
        id="Nama-Pemberi-Bantuan"
        class="flex items-center justify-between"
      >
        <p
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Nama Pemberi Bantuan
        </p>
        <div class="flex flex-col gap-3 flex-1 shrink-0">
          <label class="relative group peer w-full">
            <Input
              v-model="socialAssistance.provider"
              type="text"
              placeholder="Ketik Pemberi Bantuan"
              :error-message="error?.provider"
              :icon="iconUserSecondaryGreen"
              :filled-icon="iconUserBlack"
            />
          </label>
        </div>
      </section>
      <hr class="border-desa-background" />
      <section id="Deskripsi" class="flex items-center justify-between">
        <p
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Deskripsi Bantuan Sosial
        </p>
        <div class="flex flex-col gap-3 flex-1 shrink-0">
          <textarea
            name=""
            id=""
            v-model="socialAssistance.description"
            placeholder="Jelaskan lebih detail tentang bantuan"
            rows="6"
            class="appearance-none outline-none w-full rounded-2xl ring-[1.5px] ring-desa-background focus:ring-desa-black py-4 px-4 gap-2 font-medium placeholder:text-desa-secondary transition-all duration-300"
          >
          </textarea>
        </div>
      </section>
      <hr class="border-desa-background" />
      <section id="Ketersediaan" class="flex items-center justify-between">
        <p
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Pilih Opsi Ketersediaan
        </p>
        <div class="flex flex-1 gap-6 shrink-0">
          <label
            class="group flex w-full items-center h-14 rounded-2xl p-4 ring-[1.5px] ring-desa-background gap-2 has-[:checked]:ring-none has-[:checked]:bg-desa-foreshadow transition-setup"
          >
            <input
              type="radio"
              name="gender"
              id=""
              value="1"
              v-model="socialAssistance.is_available"
              class="flex size-[18px] shrink-0 accent-desa-secondary checked:accent-desa-dark-green transition-setup"
            />
            <span
              class="font-medium leading-5 text-desa-secondary w-full group-has-[:checked]:text-desa-dark-green transition-setup"
            >
              Tersedia
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
              name="gender"
              id=""
              value="0"
              v-model="socialAssistance.is_available"
              class="flex size-[18px] shrink-0 accent-desa-secondary checked:accent-desa-dark-green transition-setup"
            />
            <span
              class="font-medium leading-5 text-desa-secondary w-full group-has-[:checked]:text-desa-dark-green transition-setup"
            >
              Tidak Tersedia
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
      <hr class="border-desa-background w-[calc(100%+48px)] -mx-6" />
      <section id="Buttons" class="flex items-center justify-end gap-4">
        <RouterLink
          :to="{
            name: 'manage-social-assistance',
            params: { id: socialAssistance.id },
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
