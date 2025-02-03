<template>
  <div>
    <label :for="id" class="form-label d-block">{{ label }}</label>
    <div class="input-group">
      <input
        :id="id"
        :type="inputType"
        class="form-control"
        :placeholder="placeholder"
        :value="modelValue"
        @input="updateValue"
      />
      <button
        v-if="type === 'password'"
        type="button"
        class="btn btn-outline-secondary"
        @click="togglePassword"
      >
        <i :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
.form-label {
  text-align: left;
  font-weight: 500;
  display: block;
}
</style>

<script lang="ts" setup>
import { ref, defineProps, defineEmits, computed } from 'vue';

const props = defineProps<{
  label: string;
  id: string;
  type: string;
  placeholder: string;
  modelValue: string;
}>();

const emit = defineEmits(['update:modelValue']);

const showPassword = ref(false);

const inputType = computed(() => (showPassword.value && props.type === 'password' ? 'text' : props.type));

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const updateValue = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
};
</script>
