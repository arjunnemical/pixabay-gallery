<template>
  <div class="flex justify-center mt-8">
    <button
        @click="$emit('prev-page')"
        :disabled="currentPage === 1"
        class="px-4 py-2 mx-2 bg-blue-500 text-white rounded disabled:opacity-50">
      Previous
    </button>
    <span class="px-4 py-2 mx-2 bg-gray-200 text-gray-800 rounded">
      Page {{ currentPage }} of {{ totalPages }}
    </span>
    <button
        @click="$emit('next-page')"
        class="px-4 py-2 mx-2 bg-blue-500 text-white rounded">
      Next
    </button>
  </div>

</template>

<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';

@Component
export default class Pagination extends Vue {
  @Prop({type: Number, required: true}) currentPage!: number;
  @Prop({type: Number, required: true}) totalPages!: number;
  @Prop({type: Number, required: true}) pageInput!: number;

  @Watch('currentPage')
  onCurrentPageChange(newPage: number) {
    this.pageInput = newPage;
  }
}
</script>
