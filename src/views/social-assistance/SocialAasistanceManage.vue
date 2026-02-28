<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useSocialAssistanceStore } from "@/stores/socialAssistance";
import { useSocialAssistanceRecipientStore } from "@/stores/socialAssistanceRecipient";
import { storeToRefs } from "pinia";
import ModalDelete from "@/components/ui/ModalDelete.vue";
import { RouterLink } from "vue-router";
import { can } from "@/helpers/permissionHelper.js";
import { formatRupiah, parseRupiah } from "@/helpers/format.js";

import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const socialAssistanceRecipient = ref({
  social_assistance_id: "",
  amount: 0,
  reason: "",
  bank: "",
  account_number: "",
});

const socialAssistanceRecipientStore = useSocialAssistanceRecipientStore();
const { getSocialAssistanceRecipientById, createSocialAssistanceRecipient } =
  socialAssistanceRecipientStore;
const { loading: loadingSocialAssistanceRecipient } = storeToRefs(
  socialAssistanceRecipientStore,
);

const route = useRoute();
const router = useRouter();

const socialAssistanceStore = useSocialAssistanceStore(); // ✅ BUAT DULU

const { deleteSocialAssistance, getSocialAssistanceById } =
  socialAssistanceStore;
const { loading, error, success } = storeToRefs(socialAssistanceStore);

const socialAssistance = ref({});
const showModalDelete = ref(false);

const fetchData = async () => {
  const response = await getSocialAssistanceById(route.params.id);
  socialAssistance.value = response;
  socialAssistanceRecipient.value.social_assistance_id = response.id;
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
async function handleSubmit() {
  const success = await createSocialAssistanceRecipient({
    ...socialAssistanceRecipient.value,
    amount: parseRupiah(socialAssistanceRecipient.value.amount),
  });
  console.log("SUCCESS:", success);
  if (success) {
    router.push({ name: "social-assistance-recipient" });
  }
}
import { watch } from "vue";

watch(
  () => socialAssistanceRecipient.value.amount,
  (newAmount) => {
    socialAssistanceRecipient.value.amount = formatRupiah(newAmount);
  },
);

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
          Bantuan sosial
        </p>
        <span>/</span>
        <p
          class="last-of-type:text-desa-dark-green last-of-type:font-semibold capitalize"
        >
          Manage bantuan sosial
        </p>
      </div>
      <h1 class="font-semibold text-2xl">Manage Bantuan Sosial</h1>
    </div>
    <div class="flex items-center gap-3">
      <button
        v-if="can('social-assistance-delete')"
        data-modal="Modal-Delete"
        class="flex items-center rounded-2xl py-4 px-6 gap-[10px] bg-desa-red"
        @click="showModalDelete = true"
      >
        <p class="font-medium text-white">Hapus Data</p>
        <img
          src="@/assets/images/icons/trash-white.svg"
          class="flex size-6 shrink-0"
          alt="icon"
        />
      </button>
      <RouterLink
        v-if="can('social-assistance-edit')"
        :to="{
          name: 'edit-social-assistance',
          params: { id: socialAssistance?.id },
        }"
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
      id="Informasi-Bantuan-Sosial"
      class="flex flex-col shrink-0 w-[calc(545/1000*100%)] h-fit rounded-3xl p-6 gap-6 bg-white"
    >
      <p class="font-medium leading-5 text-desa-secondary">
        Informasi Bantuan Sosial
      </p>
      <div class="flex items-center justify-between gap-4">
        <div
          class="flex w-[120px] h-[100px] shrink-0 rounded-2xl overflow-hidden bg-desa-foreshadow"
        >
          <img
            :src="socialAssistance?.thumbnail"
            class="w-full h-full object-cover"
            alt="photo"
          />
        </div>
        <div
          class="badge rounded-full p-3 gap-2 flex w-[100px] justify-center shrink-0 bg-desa-soft-green"
          v-if="socialAssistance.is_available"
        >
          <span class="font-semibold text-xs text-white uppercase">
            Tersedia
          </span>
        </div>

        <div
          class="badge rounded-full p-3 gap-2 flex justify-center shrink-0 bg-desa-red"
          v-if="!socialAssistance.is_available"
        >
          <span class="font-semibold text-xs text-white uppercase">
            Tidak Tersedia
          </span>
        </div>
      </div>
      <div class="flex flex-col gap-[6px] w-full">
        <p class="font-semibold text-xl">{{ socialAssistance?.name }}</p>
        <p class="flex items-center gap-1">
          <img
            src="@/assets/images/icons/profile-secondary-green.svg"
            class="flex size-[18px] shrink-0"
            alt="icon"
          />
          <span class="font-medium text-sm text-desa-secondary">{{
            socialAssistance?.provider
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
            {{ formatRupiah(socialAssistance?.amount) }}
          </p>
          <span class="font-medium text-desa-secondary">
            {{ socialAssistance?.category }}
          </span>
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
            {{ socialAssistance?.social_assistance_recipients?.length }}
          </p>
          <span class="font-medium text-desa-secondary"> Total Pengajuan </span>
        </div>
      </div>
      <hr class="border-desa-foreshadow" />
      <div class="flex flex-col gap-3">
        <p class="font-medium text-sm text-desa-secondary">Tentang Bantuan</p>
        <p class="font-medium leading-8">
          {{ socialAssistance?.description }}
        </p>
      </div>
    </section>
    <section
      id="Penerima-Bansos-Terakhir"
      class="flex flex-col flex-1 h-fit shrink-0 rounded-3xl p-6 gap-6 bg-white"
      v-if="user.role === 'admin'"
    >
      <p class="font-medium leading-5 text-desa-secondary">
        Penerima Bansos Terakhir
      </p>
      <div id="List-Bansos-Terkahir" class="flex flex-col gap-6">
        <div
          class="card flex flex-col rounded-2xl border border-desa-background p-4 gap-4"
          v-for="recipient in socialAssistance?.social_assistance_recipients"
        >
          <div class="flex items-center justify-between">
            <p class="font-medium text-sm text-desa-secondary">
              {{ formatToClientTimeZone(recipient.created_at) }}
            </p>
            <img
              src="@/assets/images/icons/calendar-2-secondary-green.svg"
              class="flex size-[18px] shrink-0"
              alt="icon"
            />
          </div>
          <hr class="border-desa-background" />
          <div class="flex items-center gap-3">
            <div class="flex flex-col gap-[6px] w-full">
              <p class="font-semibold text-lg leading-5">
                {{ formatRupiah(recipient.amount) }}
              </p>
              <p class="font-medium text-sm text-desa-secondary">
                Nominal Pengajuan
              </p>
            </div>
            <div
              class="badge rounded-full p-3 gap-2 flex w-[100px] justify-center shrink-0 bg-desa-yellow"
              v-if="recipient.status === 'pending'"
            >
              <span class="font-semibold text-xs text-white uppercase">{{
                recipient.status
              }}</span>
            </div>
            <div
              class="badge rounded-full p-3 gap-2 flex w-[100px] justify-center shrink-0 bg-desa-red"
              v-if="recipient.status === 'rejected'"
            >
              <span class="font-semibold text-xs text-white uppercase">{{
                recipient.status
              }}</span>
            </div>
            <div
              class="badge rounded-full p-3 gap-2 flex w-[100px] justify-center shrink-0 bg-desa-dark-green"
              v-if="recipient.status === 'approved'"
            >
              <span class="font-semibold text-xs text-white uppercase">{{
                recipient.status
              }}</span>
            </div>
          </div>
          <hr class="border-desa-background" />
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-0.5">
              <img
                src="@/assets/images/icons/profile-secondary-green.svg"
                class="flex size-[18px] shrink-0"
                alt="icon"
              />
              <p class="font-medium text-sm text-desa-secondary">
                Diberikan Kepada:
              </p>
            </div>
            <div class="flex items-center gap-1">
              <p class="font-medium leading-5">
                {{ recipient.head_of_family?.user?.name }}
              </p>
              <div
                class="flex size-8 shrink-0 rounded-full bg-desa-foreshadow overflow-hidden"
              >
                <img
                  :src="recipient.head_of_family?.profile_picture"
                  class="w-full h-full object-cover"
                  alt="photo"
                />
              </div>
            </div>
          </div>
        </div>
        <a
          href="#"
          class="flex items-center justify-center h-14 rounded-2xl py-4 px-6 gap-[10px] bg-desa-dark-green"
        >
          <span class="font-medium leading-5 text-white">View All</span>
        </a>
      </div>
    </section>
    <section v-if="user.role === 'head-of-family'">
      <div class="flex gap-[14px]">
        <form @submit.prevent="handleSubmit" class="w-full">
          <div class="flex flex-col gap-[14px] flex-1">
            <section
              id="Bank-Account-Detail"
              class="rounded-2xl bg-white p-6 flex flex-col gap-6"
            >
              <h2 class="font-semibold leading-5">Bank Account Detail</h2>
              <label id="Pilih-Bank">
                <h3
                  class="font-medium text-sm leading-[17.5px] text-desa-secondary"
                >
                  Kamu Pake Bank Apa?
                </h3>
                <div
                  class="flex flex-col gap-4 py-4 mt-4 bg-white border border-desa-background rounded-2xl"
                >
                  <button
                    type="button"
                    data-expand="BankJ"
                    class="px-4 flex justify-between items-center"
                  >
                    <div class="flex items-center gap-2">
                      <img
                        src="@/assets/images/icons/bank-secondary-green.svg"
                        alt="icon"
                        class="size-6 shrink-0"
                      />
                      <h4 class="font-medium leading-5 text-desa-secondary">
                        Pilih salah satu bank
                      </h4>
                    </div>
                    <img
                      id="BankArrow"
                      src="@/assets/images/icons/arrow-down-secondary-green.svg"
                      alt="icon"
                      class="size-6 shrink-0 transition-all duration-300"
                    />
                  </button>
                  <div
                    id="BankJ"
                    class="border-t border-desa-background flex flex-col gap-4 pt-4 px-4"
                  >
                    <label
                      id="Bca-Bank"
                      class="flex items-center justify-between gap-4"
                    >
                      <div class="flex items-center gap-4">
                        <div
                          class="rounded-2xl border border-desa-background bg-[#F2F7FA] w-[100px] h-[60px] shrink-0 px-[14px] py-5"
                        >
                          <img
                            src="@/assets/images/thumbnails/kk-bca.png"
                            alt=""
                            class="size-full object-contain"
                          />
                        </div>
                        <p class="font-medium leading-5 text-[#000000]">
                          Bank Central Asia
                        </p>
                      </div>
                      <input
                        v-model="socialAssistanceRecipient.bank"
                        value="bca"
                        required
                        type="radio"
                        name="bank"
                        id="Bca"
                        class="peer flex size-[18px] shrink-0 accent-desa-dark-green"
                      />
                    </label>
                    <hr class="border-desa-background" />
                    <label
                      id="Mandiri-Bank"
                      class="flex items-center justify-between gap-4"
                    >
                      <div class="flex items-center gap-4">
                        <div
                          class="rounded-2xl border border-desa-background bg-[#F2F7FA] w-[100px] h-[60px] shrink-0 px-[14px] py-5"
                        >
                          <img
                            src="@/assets/images/thumbnails/kk-mandiri.png"
                            alt=""
                            class="size-full object-contain"
                          />
                        </div>
                        <p class="font-medium leading-5 text-[#000000]">
                          Bank Mandiri
                        </p>
                      </div>
                      <input
                        v-model="socialAssistanceRecipient.bank"
                        value="mandiri"
                        required
                        type="radio"
                        name="bank"
                        id="Mandiri"
                        class="peer flex size-[18px] shrink-0 accent-desa-dark-green"
                      />
                    </label>
                    <hr class="border-desa-background" />
                    <label
                      id="Bni-Bank"
                      class="flex items-center justify-between gap-4"
                    >
                      <div class="flex items-center gap-4">
                        <div
                          class="rounded-2xl border border-desa-background bg-[#F2F7FA] w-[100px] h-[60px] shrink-0 px-[14px] py-5"
                        >
                          <img
                            src="@/assets/images/thumbnails/kk-bni.png"
                            alt=""
                            class="size-full object-contain"
                          />
                        </div>
                        <p class="font-medium leading-5 text-[#000000]">
                          Bank Negara Indonesia
                        </p>
                      </div>
                      <input
                        v-model="socialAssistanceRecipient.bank"
                        value="bni"
                        required
                        type="radio"
                        name="bank"
                        id="Bni"
                        class="peer flex size-[18px] shrink-0 accent-desa-dark-green"
                      />
                    </label>
                    <hr class="border-desa-background" />
                  </div>
                </div>
              </label>
              <label id="Nomer-Rekening" class="flex flex-col gap-4">
                <h3
                  class="font-medium text-sm leading-[17.5px] text-desa-secondary"
                >
                  Nomor Rekening Bank
                </h3>
                <div class="relative">
                  <input
                    v-model="socialAssistanceRecipient.account_number"
                    required
                    type="number"
                    placeholder="Masukan Nomor Rekening"
                    class="peer w-full py-[18px] rounded-2xl border border-desa-background pl-[48px] pr-4 focus:outline-none bg-white font-medium leading-5 placeholder:text-desa-secondary placeholder:font-medium placeholder:leading-5 focus:ring-[1.5px] focus:ring-desa-dark-green transition-all duration-300"
                  />
                  <img
                    src="@/assets/images/icons/card-secondary-green.svg"
                    alt="icon"
                    class="peer-placeholder-shown:block hidden size-6 shrink-0 absolute left-4 top-1/2 -translate-y-1/2"
                  />
                  <img
                    src="@/assets/images/icons/card-black.svg"
                    alt="icon"
                    class="peer-placeholder-shown:hidden size-6 shrink-0 absolute left-4 top-1/2 -translate-y-1/2"
                  />
                </div>
              </label>
              <!-- <label id="Nama-Pemilik" class="flex flex-col gap-4">
                <h3
                  class="font-medium text-sm leading-[17.5px] text-desa-secondary"
                >
                  Nama Pemilik Rekening
                </h3>
                <div class="relative">
                  <input
                    v-model="socialAssistanceRecipient.name"
                    required
                    type="text"
                    placeholder="Nama Lengkap"
                    class="peer w-full py-[18px] rounded-2xl border border-desa-background pl-[48px] pr-4 focus:outline-none bg-white font-medium leading-5 placeholder:text-desa-secondary placeholder:font-medium placeholder:leading-5 focus:ring-[1.5px] focus:ring-desa-dark-green transition-all duration-300"
                  />
                  <img
                    src="@/assets/images/icons/user-square-secondary-green.svg"
                    alt="icon"
                    class="peer-placeholder-shown:block hidden size-6 shrink-0 absolute left-4 top-1/2 -translate-y-1/2"
                  />
                  <img
                    src="@/assets/images/icons/user-square-black.svg"
                    alt="icon"
                    class="peer-placeholder-shown:hidden size-6 shrink-0 absolute left-4 top-1/2 -translate-y-1/2"
                  />
                </div>
              </label> -->
            </section>
            <section
              id="Ajukan-Bantuan-Sosial"
              class="rounded-2xl bg-white p-6 flex flex-col gap-6"
            >
              <h2 class="font-semibold leading-5">Ajukan Bantuan Sosial</h2>
              <div id="Nominal" class="flex flex-col gap-4">
                <h3
                  class="font-medium text-sm leading-[17.5px] text-desa-secondary"
                >
                  Nominal Pengajuan
                </h3>
                <label class="relative group peer w-full">
                  <input
                    v-model="socialAssistanceRecipient.amount"
                    required
                    type="text"
                    placeholder="Input amount"
                    class="appearance-none outline-none w-full h-14 rounded-2xl ring-[1.5px] ring-desa-background focus:ring-desa-dark-green py-4 pr-12 [&:placeholder-shown]:pl-12 pl-[70px] gap-2 font-medium placeholder:text-desa-secondary transition-all duration-300"
                  />
                  <div
                    class="absolute transform -translate-y-1/2 top-1/2 left-4 flex size-6 shrink-0"
                  >
                    <img
                      src="@/assets/images/icons/receive-square-2-secondary-green.svg"
                      class="size-6 hidden group-has-[:placeholder-shown]:flex"
                      alt="icon"
                    />
                    <img
                      src="@/assets/images/icons/receive-square-2-black.svg"
                      class="size-6 flex group-has-[:placeholder-shown]:hidden"
                      alt="icon"
                    />
                    <span
                      class="text-desa-black ml-2 opacity-100 group-has-[:placeholder-shown]:opacity-0 transition-setup"
                      >Rp</span
                    >
                  </div>
                </label>
              </div>
              <label id="Nomer-Pemilik" class="flex flex-col gap-4">
                <h3
                  class="font-medium text-sm leading-[17.5px] text-desa-secondary"
                >
                  Alasan mengajukan Bantuan Sosial
                </h3>
                <div class="relative">
                  <textarea
                    v-model="socialAssistanceRecipient.reason"
                    placeholder="Jelaskan lebih detail tentang bantuan"
                    name=""
                    id=""
                    class="w-full h-[224px] rounded-2xl peer p-4 border border-desa-background focus:outline-none bg-white font-medium leading-5 placeholder:text-desa-secondary placeholder:font-medium placeholder:leading-5 focus:ring-[1.5px] focus:ring-desa-dark-green transition-all duration-300 [&::-webkit-scrollbar]:hidden"
                  ></textarea>
                </div>
              </label>
              <button
                :disabled="loadingSocialAssistanceRecipient"
                id="submitButton"
                type="submit"
                class="py-[18px] rounded-2xl disabled:bg-desa-grey w-[180px] text-center flex justify-center font-medium text-white bg-desa-dark-green transition-all duration-300"
              >
                <span v-if="!loadingSocialAssistanceRecipient">Ajukan</span>
                <span v-else>loding...</span>
              </button>
            </section>
          </div>
        </form>
      </div>
    </section>
  </div>
  <ModalDelete
    :show="showModalDelete"
    :title="'Hapus Bantuan Sosial ?'"
    :loading="loading"
    @close="showModalDelete = false"
    @confirm="handleDelete"
  />
</template>
