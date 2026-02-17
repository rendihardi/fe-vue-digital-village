<script setup>
import { defineProps, defineEmits, computed } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "text",
  },
  placeholder: {
    type: String,
    default: "",
  },
  errorMessage: {
    type: [String, Array],
    default: "",
  },
  icon: {
    type: String,
    required: true,
  },
  filledIcon: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const errorText = computed(() => {
  if (!props.errorMessage) return "";
  return Array.isArray(props.errorMessage)
    ? props.errorMessage[0]
    : props.errorMessage;
});
</script>

<template>
  <div class="flex flex-col gap-2">
    <label class="relative group w-full">
      <input
        :placeholder="placeholder"
        :type="type"
        :value="modelValue"
        @input="emit('update:modelValue', $event.target.value)"
        class="appearance-none outline-none w-full h-14 rounded-2xl py-4 pl-12 pr-4 font-medium placeholder:text-desa-secondary transition-all duration-300 border-2"
        :class="
          errorText
            ? 'border-red-500 focus:border-red-500'
            : 'border-desa-background focus:border-desa-black'
        "
      />

      <div class="absolute -translate-y-1/2 top-1/2 left-4 flex size-6">
        <img
          :src="icon"
          class="size-6 hidden group-has-[:placeholder-shown]:flex pointer-events-none"
        />
        <img
          :src="filledIcon"
          class="size-6 flex group-has-[:placeholder-shown]:hidden pointer-events-none"
        />
      </div>
    </label>

    <span v-if="errorText" class="text-left text-[12px]" style="color: #ef4444">
      {{ errorText }}
    </span>
  </div>
</template>
