<template>
  <div class="flex justify-center">

    <FiltersSidebar @apply-filters="handleApplyFilters"/>

    <div class="flex-1 p-4 overflow-hidden" style="max-width: 1900px">
      <GalleryHeader @search="handleSearch"/>
      <Loader v-if="loading"/>
      <ImageGrid v-else :images="images"/>
      <Pagination
          v-if="!loading"
          :current-page="filters.page"
          :total-pages="filters.totalPages"
          :pageInput="filters.page"
          @prev-page="prevPage"
          @next-page="nextPage"
          @goto-page="goToPage"/>
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {mapState} from 'vuex';
import GalleryHeader from './header/GalleryHeader.vue';
import Pagination from '../widgets/Pagination.vue';
import Loader from '../widgets/Loader.vue';
import {Action, State} from 'vuex-class';
import FiltersSidebar from "@/components/gallery/sidebar/FiltersSidebar.vue";
import ImageGrid from "@/components/gallery/ImageGrid.vue";

@Component({
  components: {
    ImageGrid,
    GalleryHeader,
    Pagination,
    Loader,
    FiltersSidebar
  },
  computed: {
    ...mapState(['images']),
  },
})
export default class Gallery extends Vue {
  @State('loading') loading!: boolean;
  @State('filters') filters!: any;

  created() {
    this.fetchImages();
  }

  handleApplyFilters(filters: never) {
    this.$store.commit('SET_FILTERS', filters);
    this.$store.commit('SET_PAGE', 1);
    this.fetchImages();
  }

  handleSearch(query: string) {
    this.$store.commit('SET_QUERY', encodeURIComponent(query));
    this.fetchImages();
  }

  prevPage() {
    this.$store.commit('SET_PAGE', this.filters.page - 1);
    this.fetchImages();
  }

  nextPage() {
    this.$store.commit('SET_PAGE', this.filters.page + 1);
    this.fetchImages();
  }

  goToPage(page: number) {
    this.$store.commit('SET_PAGE', page);
    this.fetchImages();
  }

  @Action('fetchImages') private fetchImages!: () => void;
}
</script>
