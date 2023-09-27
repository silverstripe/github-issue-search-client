<script setup>
import { useDark, useToggle } from '@vueuse/core';
import VueToggle from 'vue-toggle-component';

const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>

<template>
<vue-toggle
    :title="isDark ? 'Dark Mode' : 'Light Mode'"
    name="Toggle Dark"
    @click="toggleDark()"
    class="dark-mode-toggle"
    :class="{ dark: isDark }"
    :toggled="isDark"
    activeColor="#31a8ff"
/>
</template>
<style>
.dark-mode-toggle {
    border-radius: 3px;
    cursor: pointer;
    border-width: 1px;
    margin-bottom: 10px !important;

    &.dark > label {
        color: white;
    }
}

.m-toggle__content:after {
  transition: left 0.4s ease !important;
}
</style>