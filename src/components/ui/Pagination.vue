<script setup>
import { computed } from "vue";

const props = defineProps({
  meta: {
    type: Object,
    required: true,
  },
  serverOptions: {
    type: Object,
    required: true,
  },
});

/*
  Window pagination logic
  Menampilkan:
  1 ... 4 5 6 7 8 ... 20
*/

const pages = computed(() => {
  const total = props.meta.last_page;
  const current = props.meta.current_page;

  const delta = 2; // jumlah kiri & kanan current page
  const range = [];

  const start = Math.max(1, current - delta);
  const end = Math.min(total, current + delta);

  for (let i = start; i <= end; i++) {
    range.push(i);
  }

  return range;
});

const goToPage = (page) => {
  if (page >= 1 && page <= props.meta.last_page) {
    props.serverOptions.page = page;
  }
};
</script>

<template>
  <nav id="Pagination" class="flex justify-center mt-6">
    <ul class="flex items-center gap-3 flex-wrap">
      <!-- PREV -->
      <li class="group">
        <button
          @click="goToPage(meta.current_page - 1)"
          :disabled="meta.current_page === 1"
          class="flex size-11 items-center justify-center rounded-full bg-desa-foreshadow disabled:opacity-40"
        >
          <img
            src="@/assets/images/icons/arrow-left-dark-green.svg"
            class="size-6"
            alt="icon"
          />
        </button>
      </li>

      <!-- First page + ellipsis -->
      <li v-if="pages[0] > 1">
        <button
          @click="goToPage(1)"
          class="flex size-11 items-center justify-center rounded-full bg-desa-foreshadow font-semibold"
        >
          1
        </button>
      </li>

      <li v-if="pages[0] > 2">
        <span class="px-2 text-desa-secondary">...</span>
      </li>

      <!-- PAGE NUMBERS -->
      <li v-for="page in pages" :key="page">
        <button
          @click="goToPage(page)"
          class="flex size-11 items-center justify-center rounded-full font-semibold transition-setup"
          :class="{
            'bg-desa-dark-green text-white': page === meta.current_page,
            'bg-desa-foreshadow text-desa-dark-green hover:bg-desa-dark-green hover:text-white':
              page !== meta.current_page,
          }"
        >
          {{ page }}
        </button>
      </li>

      <!-- Last ellipsis -->
      <li v-if="pages[pages.length - 1] < meta.last_page - 1">
        <span class="px-2 text-desa-secondary">...</span>
      </li>

      <li v-if="pages[pages.length - 1] < meta.last_page">
        <button
          @click="goToPage(meta.last_page)"
          class="flex size-11 items-center justify-center rounded-full bg-desa-foreshadow font-semibold"
        >
          {{ meta.last_page }}
        </button>
      </li>

      <!-- NEXT -->
      <li class="group">
        <button
          @click="goToPage(meta.current_page + 1)"
          :disabled="meta.current_page === meta.last_page"
          class="flex size-11 items-center justify-center rounded-full bg-desa-foreshadow disabled:opacity-40"
        >
          <img
            src="@/assets/images/icons/arrow-left-dark-green.svg"
            class="size-6 rotate-180"
            alt="icon"
          />
        </button>
      </li>
    </ul>
  </nav>
</template>
