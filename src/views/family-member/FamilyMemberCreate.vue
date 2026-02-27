<script setup>
import { useFamilyMemberStore } from "@/stores/familyMember";
const familyMemberStore = useFamilyMemberStore();
const { createFamilyMember } = familyMemberStore;
const { loading, error } = storeToRefs(familyMemberStore);
import IconProfileSecondaryGreen from "@/assets/images/icons/user-secondary-green.svg";
import IconProfileBlack from "@/assets/images/icons/user-black.svg";
import IconKeyboardSecondaryGreen from "@/assets/images/icons/keyboard-secondary-green.svg";
import IconKeyboardBlack from "@/assets/images/icons/keyboard-black.svg";
import IconCallSecondaryGreen from "@/assets/images/icons/call-secondary-green.svg";
import IconCallBlack from "@/assets/images/icons/call-black.svg";
import IconBriefCaseSecondaryGreen from "@/assets/images/icons/briefcase-secondary-green.svg";
import IconBriefCaseBlack from "@/assets/images/icons/briefcase-black.svg";
import IconCalendarSecondaryGreen from "@/assets/images/icons/calendar-2-secondary-green.svg";
import IconCalendarBlack from "@/assets/images/icons/calendar-2-black.svg";
import IconKeySecondaryGreen from "@/assets/images/icons/key-secondary-green.svg";
import IconKeyBlack from "@/assets/images/icons/key-black.svg";
import { useRouter } from "vue-router";
const router = useRouter();
import { watch } from "vue";
import dayjs from "dayjs";

import { storeToRefs } from "pinia";
import { ref } from "vue";
import Input from "@/components/ui/Input.vue";

const familyMember = ref({
  name: "",
  email: "",
  password: "",
  profile_picture: null,
  profile_picture_irl: null,
  identity_number: "",
  gender: "",
  phone_number: "",
  date_of_birth: "",
  age: null,
  occupation: "",
  marital_status: "",
});

function getAge(dob) {
  return dayjs().diff(dayjs(dob), "year");
}
watch(
  () => familyMember.value.date_of_birth,
  (newDate) => {
    familyMember.value.age = getAge(newDate);
  },
);

const handleImageChange = (event) => {
  const file = event.target.files[0];
  familyMember.value.profile_picture = file;
  familyMember.value.profile_picture_url = URL.createObjectURL(file);
};

const handleSubmit = async () => {
  await createFamilyMember(familyMember.value);
  router.push({ name: "family-member" });
};
</script>
<template>
  <header class="flex flex-col gap-2">
    <p class="flex items-center gap-1">
      <span class="leading-5 text-desa-secondary">Kepala Keluarga</span
      ><span class="font-medium leading-5 text-desa-dark-green">/</span
      ><span class="font-medium leading-5 text-desa-dark-green"
        >Tambah Anggota Keluarga</span
      >
    </p>
    <h1 class="font-semibold text-2xl leading-[30px]">
      Tambah Anggota Keluarga
    </h1>
  </header>
  <form @submit.prevent="handleSubmit" id="myForm" class="capitalize">
    <div class="shrink-0 rounded-3xl p-6 bg-white flex flex-col gap-6 h-fit">
      <section id="Photo-Profile" class="flex items-center">
        <h2
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Photo Profile
        </h2>
        <div class="flex-1 flex items-center justify-between">
          <div
            id="Photo-Preview"
            class="flex itce justify-center size-[100px] rounded-full overflow-hidden bg-desa-foreshadow"
          >
            <img
              id="Photo"
              :src="familyMember.profile_picture_url"
              alt="image"
              class="size-full object-cover"
            />
          </div>
          <div class="relative">
            <input
              required
              id="File"
              type="file"
              name="file"
              class="absolute opacity-0 left-0 w-full top-0 h-full"
              @change="handleImageChange"
              ref="profile_picture"
            />
            <button
              @click="$refs.profile_picture.click()"
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
      <section id="Jenis-Kelamin" class="flex items-center">
        <h2
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Jenis Kelamin
        </h2>
        <div class="flex-1 grid grid-cols-2 gap-6">
          <label
            class="relative group flex items-center justify-between rounded-2xl border border-desa-background p-4 hover:border-transparent hover:bg-desa-foreshadow has-[:checked]:bg-desa-foreshadow has-[:checked]:border-transparent transition-all duration-300"
          >
            <div class="flex items-center gap-2">
              <input
                v-model="familyMember.gender"
                required
                value="male"
                type="radio"
                name="gender"
                id="pria"
                class="flex size-[18px] shrink-0 accent-desa-dark-green"
              />
              <p class="w-full font-medium text-desa-secondary leading-5">
                Pria
              </p>
            </div>
            <img
              src="@/assets/images/icons/man-secondary-green.svg"
              class="flex size-6 shrink-0 group-has-[:checked]:hidden"
              alt="icon"
            />
            <img
              src="@/assets/images/icons/man-dark-green.svg"
              class="hidden size-6 shrink-0 group-has-[:checked]:flex"
              alt="icon"
            />
          </label>
          <label
            class="relative group flex items-center justify-between rounded-2xl border border-desa-background p-4 hover:border-transparent hover:bg-desa-foreshadow has-[:checked]:bg-desa-foreshadow has-[:checked]:border-transparent transition-all duration-300"
          >
            <div class="flex items-center gap-2">
              <input
                v-model="familyMember.gender"
                required
                value="female"
                type="radio"
                name="gender"
                id="wanita"
                class="flex size-[18px] shrink-0 accent-desa-dark-green"
              />
              <p class="w-full font-medium text-desa-secondary leading-5">
                Wanita
              </p>
            </div>
            <img
              src="@/assets/images/icons/woman-secondary-green.svg"
              class="flex size-6 shrink-0 group-has-[:checked]:hidden"
              alt="icon"
            />
            <img
              src="@/assets/images/icons/woman-dark-green.svg"
              class="hidden size-6 shrink-0 group-has-[:checked]:flex"
              alt="icon"
            />
          </label>
        </div>
      </section>
      <hr class="border-desa-background" />
      <section id="Nama-Keluarga" class="flex items-center">
        <h2
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Nama Keluarga
        </h2>
        <Input
          v-model="familyMember.name"
          type="text"
          placeholder="Ketik Nama Kamu"
          :error-message="error?.name"
          :icon="IconProfileSecondaryGreen"
          :filled-icon="IconProfileBlack"
        />
      </section>
      <hr class="border-desa-background" />
      <section id="Nomor-Induk-Kependudukan" class="flex items-center">
        <h2
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Nomor Induk Kependudukan
        </h2>
        <Input
          v-model="familyMember.identity_number"
          type="text"
          placeholder="Ketik NIK Kamu"
          :error-message="error?.identity_number"
          :icon="IconKeyboardSecondaryGreen"
          :filled-icon="IconKeyboardBlack"
        />
      </section>
      <hr class="border-desa-background" />
      <section id="Pekerjaan" class="flex items-center">
        <h2
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Pekerjaan
        </h2>
        <Input
          v-model="familyMember.occupation"
          type="text"
          placeholder="Ketik Pekerjaan Kamu"
          :error-message="error?.occupation"
          :icon="IconBriefCaseSecondaryGreen"
          :filled-icon="IconBriefCaseBlack"
        />
      </section>
      <hr class="border-desa-background" />
      <section id="Tanggal-Lahir" class="flex items-center">
        <p
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Tanggal Lahir
        </p>
        <div class="flex items-center gap-6 flex-1 shrink-0">
          <label class="relative group peer w-full valid">
            <Input
              v-model="familyMember.date_of_birth"
              type="date"
              placeholder="Ketik Tanggal lahir Kamu"
              :error-message="error?.date_of_birth"
              :icon="IconCalendarSecondaryGreen"
              :filled-icon="IconCalendarBlack"
            />
            <!-- <img
              src="@/assets/images/icons/Checklist-dark-green-fill.svg"
              class="absolute transform -translate-y-1/2 top-1/2 right-4 size-6 shrink-0 hidden group-[.valid]:flex"
              alt="icon"
            /> -->
          </label>
          <div
            class="w-[180px] flex shrink-0 h-[52px] rounded-2xl bg-desa-foreshadow p-4 font-medium leading-5 text-desa-dark-green justify-center"
          >
            <p>
              Umur: <span id="Age">{{ familyMember.age }}</span> tahun
            </p>
          </div>
        </div>
      </section>
      <hr class="border-desa-background" />
      <section id="Status" class="flex items-center">
        <h2
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Status
        </h2>
        <div class="flex-1 grid grid-cols-2 gap-6">
          <label
            class="relative group flex items-center justify-between rounded-2xl border border-desa-background p-4 hover:border-transparent hover:bg-desa-foreshadow has-[:checked]:bg-desa-foreshadow has-[:checked]:border-transparent transition-all duration-300"
          >
            <div class="flex items-center gap-2">
              <input
                v-model="familyMember.marital_status"
                value="single"
                required
                type="radio"
                name="status"
                id="Belum-Menikah"
                class="flex size-[18px] shrink-0 accent-desa-dark-green"
              />
              <p class="w-full font-medium text-desa-secondary leading-5">
                Belum Menikah
              </p>
            </div>
            <img
              src="@/assets/images/icons/profile-secondary-green.svg"
              class="flex size-6 shrink-0 group-has-[:checked]:hidden"
              alt="icon"
            />
            <img
              src="@/assets/images/icons/profile-dark-green.svg"
              class="hidden size-6 shrink-0 group-has-[:checked]:flex"
              alt="icon"
            />
          </label>
          <label
            class="relative group flex items-center justify-between rounded-2xl border border-desa-background p-4 hover:border-transparent hover:bg-desa-foreshadow has-[:checked]:bg-desa-foreshadow has-[:checked]:border-transparent transition-all duration-300"
          >
            <div class="flex items-center gap-2">
              <input
                v-model="familyMember.marital_status"
                required
                value="married"
                type="radio"
                name="status"
                id="Sudah-Menikah"
                class="flex size-[18px] shrink-0 accent-desa-dark-green"
              />
              <p class="w-full font-medium text-desa-secondary leading-5">
                Sudah Menikah
              </p>
            </div>
            <img
              src="@/assets/images/icons/profile-2user-secondary-green.svg"
              class="flex size-6 shrink-0 group-has-[:checked]:hidden"
              alt="icon"
            />
            <img
              src="@/assets/images/icons/profile-2user-dark-green.svg"
              class="hidden size-6 shrink-0 group-has-[:checked]:flex"
              alt="icon"
            />
          </label>
        </div>
      </section>
      <hr class="border-desa-background" />
      <section id="Kategori-Keluarga" class="flex items-center">
        <h2
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Kategori Keluarga
        </h2>
        <div class="flex-1 grid grid-cols-3 gap-6">
          <label
            class="relative flex items-center gap-2 rounded-2xl border border-desa-background p-4 hover:border-transparent hover:bg-desa-foreshadow has-[:checked]:bg-desa-foreshadow hover:ring-[1.5px] hover:ring-desa-dark-green has-[:checked]:ring-[1.5px] has-[:checked]:ring-desa-dark-green transition-all duration-300"
          >
            <input
              v-model="familyMember.relation"
              required
              value="wife"
              type="radio"
              name="kategori-keluarga"
              id="Istri"
              class="peer flex size-[18px] shrink-0 accent-desa-dark-green"
            />
            <p
              class="w-full font-medium text-desa-secondary leading-5 peer-checked:text-desa-dark-green"
            >
              Istri
            </p>
          </label>
          <label
            class="relative flex items-center gap-2 rounded-2xl border border-desa-background p-4 hover:border-transparent hover:bg-desa-foreshadow has-[:checked]:bg-desa-foreshadow hover:ring-[1.5px] hover:ring-desa-dark-green has-[:checked]:ring-[1.5px] has-[:checked]:ring-desa-dark-green transition-all duration-300"
          >
            <input
              v-model="familyMember.relation"
              required
              value="child"
              type="radio"
              name="kategori-keluarga"
              id="Anak"
              class="peer flex size-[18px] shrink-0 accent-desa-dark-green"
            />
            <p
              class="w-full font-medium text-desa-secondary leading-5 peer-checked:text-desa-dark-green"
            >
              Anak
            </p>
          </label>
          <label
            class="relative flex items-center gap-2 rounded-2xl border border-desa-background p-4 hover:border-transparent hover:bg-desa-foreshadow has-[:checked]:bg-desa-foreshadow hover:ring-[1.5px] hover:ring-desa-dark-green has-[:checked]:ring-[1.5px] has-[:checked]:ring-desa-dark-green transition-all duration-300"
          >
            <input
              v-model="familyMember.relation"
              required
              value="husband"
              type="radio"
              name="kategori-keluarga"
              id="Suami"
              class="peer flex size-[18px] shrink-0 accent-desa-dark-green"
            />
            <p
              class="w-full font-medium text-desa-secondary leading-5 peer-checked:text-desa-dark-green"
            >
              Suami
            </p>
          </label>
        </div>
      </section>
      <hr class="border-desa-background" />
      <section id="Nomor-Handphone" class="flex items-center">
        <h2
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Nomor Handphone
        </h2>
        <label class="relative group peer w-full valid">
          <Input
            v-model="familyMember.phone_number"
            type="text"
            placeholder="Ketik No HP Kamu"
            :error-message="error?.phone_number"
            :icon="IconCallSecondaryGreen"
            :filled-icon="IconCallBlack"
          />
        </label>
      </section>
      <hr class="border-desa-background" />
      <section id="Email-Address" class="flex items-center">
        <h2
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Email Address
        </h2>
        <Input
          v-model="familyMember.email"
          type="email"
          placeholder="Ketik Email Kamu"
          :error-message="error?.email"
          :icon="IconProfileSecondaryGreen"
          :filled-icon="IconProfileBlack"
        />
      </section>
      <section id="Passwords" class="flex items-center justify-between">
        <p
          class="font-medium leading-5 text-desa-secondary w-[calc(424/904*100%)]"
        >
          Passwords
        </p>
        <div class="flex flex-col gap-3 flex-1 shrink-0">
          <Input
            v-model="familyMember.password"
            type="password"
            placeholder="Ketik Password Kamu"
            :error-message="error?.password"
            :icon="IconKeySecondaryGreen"
            :filled-icon="IconKeyBlack"
          />
        </div>
      </section>
      <section id="Buttons" class="flex items-center justify-end gap-4">
        <RouterLink :to="{ name: 'family-member' }">
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
          <span v-if="!loading">Create</span>
          <span v-else>Loading...</span>
        </button>
      </section>
    </div>
  </form>
</template>
