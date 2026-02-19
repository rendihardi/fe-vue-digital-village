<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useSocialAssistanceRecipientStore } from "@/stores/socialAssistanceRecipient";
import { storeToRefs } from "pinia";
import ModalDelete from "@/components/ui/ModalDelete.vue";
import { RouterLink } from "vue-router";
import { parseRupiah, formatRupiah } from "@/helpers/format.js";

const route = useRoute();
const router = useRouter();

const socialAssistanceRecipientStore = useSocialAssistanceRecipientStore(); // ✅ BUAT DULU

const { getSocialAssistanceRecipientById, updateSocialAssistanceRecipient } =
  socialAssistanceRecipientStore;
const { loading, error, success } = storeToRefs(socialAssistanceRecipientStore);

const socialAssistanceRecipient = ref({
  id: "",
  social_assistance_id: "",
  head_of_family_id: "",
  amount: 0,
  reason: "",
  bank: "",
  account_number: "",
  proof: "",
  proof_url: "",
  status: "",
});
const showModalDelete = ref(false);

const fetchData = async () => {
  const response = await getSocialAssistanceRecipientById(route.params.id);
  socialAssistanceRecipient.value = response;
  socialAssistanceRecipient.value.proof_url =
    socialAssistanceRecipient.value.proof;
  //   socialAssistanceRecipient.value.proof = null;
  socialAssistanceRecipient.value.head_of_family_id =
    response.head_of_family?.id;
  socialAssistanceRecipient.value.social_assistance_id =
    response.social_assistance?.id;
};

const handleSubmit = async () => {
  const response = await updateSocialAssistanceRecipient({
    ...socialAssistanceRecipient.value,
    amount: parseRupiah(socialAssistanceRecipient.value.amount),
  });
  if (response) {
    router.push({
      name: "manage-social-assistance-recipient",
      params: { id: socialAssistanceRecipient.value.id },
    });
  }
};

import dayjs from "dayjs";

function getAge(dob) {
  return dayjs().diff(dayjs(dob), "year");
}

onMounted(() => {
  fetchData();
});
const handleImageChange = (event) => {
  const file = event.target.files[0];
  socialAssistanceRecipient.value.proof = file;
  socialAssistanceRecipient.value.proof_url = URL.createObjectURL(file);
};

// const formatRupiah = (value) => {
//   return new Intl.NumberFormat("id-ID", {
//     style: "currency",
//     currency: "IDR",
//   }).format(value);
// };

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
          Pengajuan Bantuan sosial
        </p>
        <span>/</span>
        <p
          class="last-of-type:text-desa-dark-green last-of-type:font-semibold capitalize"
        >
          Manage bansos
        </p>
      </div>
      <h1 class="font-semibold text-2xl">Manage Bansos</h1>
    </div>
  </div>
  <div class="flex gap-[14px]">
    <section
      id="Detail"
      class="flex flex-col shrink-0 w-[calc(545/1000*100%)] h-fit rounded-3xl p-6 gap-6 bg-white"
    >
      <p class="font-medium leading-5 text-desa-secondary">
        Detail Bantuan Sosial
      </p>
      <div class="flex items-center justify-between gap-4">
        <div
          class="flex w-[120px] h-[100px] shrink-0 rounded-2xl overflow-hidden bg-desa-foreshadow"
        >
          <img
            :src="socialAssistanceRecipient?.social_assistance?.thumbnail"
            class="w-full h-full object-cover"
            alt="photo"
          />
        </div>
        <div
          class="badge rounded-full p-3 gap-2 flex w-[100px] justify-center shrink-0 bg-desa-yellow"
          v-if="socialAssistanceRecipient.status === 'pending'"
        >
          <span class="font-semibold text-xs text-white uppercase">{{
            socialAssistanceRecipient.status
          }}</span>
        </div>
        <div
          class="badge rounded-full p-3 gap-2 flex w-[100px] justify-center shrink-0 bg-desa-red"
          v-if="socialAssistanceRecipient.status === 'rejected'"
        >
          <span class="font-semibold text-xs text-white uppercase">{{
            socialAssistanceRecipient.status
          }}</span>
        </div>
        <div
          class="badge rounded-full p-3 gap-2 flex w-[100px] justify-center shrink-0 bg-desa-dark-green"
          v-if="socialAssistanceRecipient.status === 'approved'"
        >
          <span class="font-semibold text-xs text-white uppercase">{{
            socialAssistanceRecipient.status
          }}</span>
        </div>
      </div>
      <div class="flex flex-col gap-[6px] w-full">
        <p class="font-semibold text-xl line-clamp-1">
          {{ socialAssistanceRecipient?.social_assistance?.name }}
        </p>
        <p class="flex items-center gap-1">
          <img
            src="@/assets/images/icons/profile-secondary-green.svg"
            class="flex size-[18px] shrink-0"
            alt="icon"
          />
          <span class="font-medium text-sm text-desa-secondary">{{
            socialAssistanceRecipient?.social_assistance?.provider
          }}</span>
        </p>
      </div>
      <hr class="border-desa-foreshadow" />
      <div class="flex items-center w-full gap-3">
        <div
          class="flex size-[52px] shrink-0 rounded-2xl bg-desa-foreshadow items-center justify-center"
        >
          <img
            src="@/assets/images/icons/money-dark-green.svg"
            class="flex size-6 shrink-0"
            alt="icon"
          />
        </div>
        <div class="flex flex-col gap-1 w-full">
          <p
            class="font-semibold text-lg leading-[22.5px] text-desa-dark-green"
          >
            {{ formatRupiah(socialAssistanceRecipient?.amount) }}
          </p>
          <span class="font-medium text-desa-secondary">
            {{ socialAssistanceRecipient?.social_assistance?.category }}</span
          >
        </div>
      </div>
      <hr class="border-desa-foreshadow" />
      <div class="flex items-center w-full gap-3">
        <div
          class="flex size-[52px] shrink-0 rounded-2xl bg-desa-red/10 items-center justify-center"
        >
          <img
            src="@/assets/images/icons/minus-square-red.svg"
            class="flex size-6 shrink-0"
            alt="icon"
          />
        </div>
        <div class="flex flex-col gap-1 w-full">
          <p class="font-semibold text-lg leading-[22.5px] text-desa-red">
            Rp92.000.000
          </p>
          <span class="font-medium text-desa-secondary"> Sisa Bansos </span>
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
            {{
              socialAssistanceRecipient?.social_assistance
                ?.social_assistance_recipients?.length ?? 0
            }}
            Warga
          </p>
          <span class="font-medium text-desa-secondary"> Total Pengajuan </span>
        </div>
      </div>
      <hr class="border-desa-foreshadow" />
      <div class="flex flex-col gap-3">
        <p class="font-medium text-sm text-desa-secondary">Tentang Bantuan</p>
        <p class="font-medium leading-8">
          {{ socialAssistanceRecipient?.social_assistance?.description }}
        </p>
      </div>
    </section>
    <section
      class="flex flex-col flex-1 h-fit shrink-0 rounded-3xl p-6 gap-6 bg-white"
    >
      <p class="font-medium leading-5 text-desa-secondary">Detail Pengajuan</p>
      <div class="flex items-center gap-3 w-[302px] shrink-0">
        <div
          class="flex size-[54px] rounded-full bg-desa-foreshadow overflow-hidden"
        >
          <img
            :src="socialAssistanceRecipient?.head_of_family?.profile_picture"
            class="w-full h-full object-cover"
            alt="icon"
          />
        </div>
        <div class="flex flex-col gap-1">
          <p class="font-semibold text-lg leading-5 text-desa-black">
            {{ socialAssistanceRecipient?.head_of_family?.user?.name }}
          </p>
          <p class="flex items-center gap-1">
            <img
              src="@/assets/images/icons/briefcase-secondary-green.svg"
              class="flex size-[18px] shrink-0"
              alt="icon"
            />
            <span class="font-medium text-sm text-desa-secondary">
              {{ socialAssistanceRecipient?.head_of_family?.occupation }}</span
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
            {{
              socialAssistanceRecipient?.head_of_family?.family_members?.length
            }}
          </p>
          <p class="font-medium text-sm text-desa-secondary">Total Keluarga</p>
        </div>
      </div>
      <hr class="border-desa-background" />
      <div class="flex items-center gap-3 w-[302px] shrink-0">
        <div
          class="flex size-[52px] rounded-2xl items-center justify-center bg-desa-foreshadow overflow-hidden"
        >
          <img
            src="@/assets/images/icons/keyboard-dark-green.svg"
            class="flex size-6 shrink-0"
            alt="icon"
          />
        </div>
        <div class="flex flex-col gap-1">
          <p class="font-semibold text-lg leading-5">
            {{ socialAssistanceRecipient?.head_of_family?.identity_number }}
          </p>
          <p class="font-medium text-sm text-desa-secondary">NIK</p>
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
          <p class="font-semibold text-lg leading-5">
            {{ formatToClientTimeZone(socialAssistanceRecipient?.created_at) }}
          </p>
          <p class="font-medium text-sm text-desa-secondary">
            Tanggal Pengajuan
          </p>
        </div>
      </div>
      <hr class="border-desa-background" />
      <div class="flex items-center gap-3 w-[302px] shrink-0">
        <div
          class="flex size-[52px] rounded-2xl items-center justify-center bg-desa-foreshadow overflow-hidden"
        >
          <img
            src="@/assets/images/icons/receive-square-2-dark-green.svg"
            class="flex size-6 shrink-0"
            alt="icon"
          />
        </div>
        <div class="flex flex-col gap-1">
          <p class="font-semibold text-lg leading-5">
            {{ socialAssistanceRecipient?.amount }}
          </p>
          <p class="font-medium text-sm text-desa-secondary">
            Nominal Pengajuan
          </p>
        </div>
      </div>
      <hr class="border-desa-background" />
      <div class="flex flex-col gap-1">
        <p class="font-medium text-sm text-desa-secondary">Pesan Pengajuan:</p>
        <p class="font-medium leading-8">
          “{{ socialAssistanceRecipient?.reason }}”
        </p>
      </div>
      <hr class="border-desa-background" />
      <div class="flex flex-col gap-6">
        <p class="font-medium text-sm text-desa-secondary">
          Rekening Kepala Rumah
        </p>
        <div class="flex items-center gap-3">
          <div
            class="flex w-[120px] h-[60px] rounded-2xl border border-desa-background py-3 px-0.5 items-center justify-center bg-desa-blue/10 overflow-hidden"
          >
            <img
              src="@/assets/images/logos/bca.svg"
              class="w-full h-full object-contain"
              alt="icon"
              v-if="socialAssistanceRecipient?.bank === 'bca'"
            />
            <img
              src="@/assets/images/logos/bni.png"
              class="w-full h-full object-contain"
              alt="icon"
              v-if="socialAssistanceRecipient?.bank === 'bni'"
            />
            <img
              src="@/assets/images/logos/bri.png"
              class="w-full h-full object-contain"
              alt="icon"
              v-if="socialAssistanceRecipient?.bank === 'bri'"
            />
            <img
              src="@/assets/images/logos/mandiri.png"
              class="w-full h-full object-contain"
              alt="icon"
              v-if="socialAssistanceRecipient?.bank === 'mandiri'"
            />
          </div>
          <div>
            <p class="font-medium text-sm text-desa-secondary">
              {{ socialAssistanceRecipient?.head_of_family?.user?.name }}
            </p>
            <div class="flex items-center gap-1">
              <img
                src="@/assets/images/icons/document-copy-dark-green.svg"
                class="flex size-[18px] shrink-0"
                alt="icon"
              />
              <p class="font-semibold text-lg text-desa-dark-green">
                {{ socialAssistanceRecipient?.account_number }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <hr class="border-desa-background" />
      <form @submit.prevent="handleSubmit" class="flex flex-col gap-6">
        <p class="font-medium text-sm text-desa-secondary">
          Bukti Pemberian Bansos
        </p>
        <div class="flex-1 flex items-center justify-between">
          <div
            id="Photo-Preview"
            class="flex itce justify-center w-[120px] h-[100px] rounded-2xl overflow-hidden bg-desa-foreshadow"
          >
            <img
              id="Photo"
              :src="socialAssistanceRecipient.proof_url"
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
              ref="proof"
            />
            <button
              id="Upload"
              type="button"
              class="relative flex items-center py-4 px-6 rounded-2xl bg-desa-black gap-[10px]"
              @click="$refs.proof.click()"
              v-show="socialAssistanceRecipient.status === 'pending'"
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
        <hr class="border-desa-background" />
        <div
          class="flex items-center gap-3 w-full"
          v-show="socialAssistanceRecipient.status === 'pending'"
        >
          <button
            type="submit"
            @click="socialAssistanceRecipient.status = 'rejected'"
            class="flex items-center w-full justify-center gap-[10px] rounded-2xl py-4 px-6 bg-desa-red/10"
          >
            <span class="font-medium text-desa-red">Tolak</span>
          </button>
          <button
            type="submit"
            @click="socialAssistanceRecipient.status = 'approved'"
            class="flex items-center w-full justify-center gap-[10px] rounded-2xl py-4 px-6 bg-desa-dark-green"
          >
            <span class="font-medium text-white">Setuju</span>
          </button>
        </div>
      </form>
    </section>
  </div>
</template>
