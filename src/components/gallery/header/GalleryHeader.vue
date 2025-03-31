<template>
  <div class="mb-8">
    <input
        v-model.lazy="filters.q"
        v-on:input="handleInput"
        type="text"
        placeholder="Search for images..."
        class="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
    />
  </div>
</template>

<script lang="ts">
import debounce from 'lodash/debounce';
import {Component, Vue} from 'vue-property-decorator';
import {State} from "vuex-class";

@Component
export default class GalleryHeader extends Vue {
  @State('filters') filters!: never;
  query = '';

  handleInput = debounce((e) => {
    this.query = e.target.value;
    this.$emit('search', this.query);
  }, 500);
}
</script>
