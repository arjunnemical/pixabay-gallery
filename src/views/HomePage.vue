<template>
  <div>
    <Gallery/>
  </div>
</template>

<script>
import Gallery from '../components/gallery/Gallery.vue';

export default {
  components: {
    Gallery,
  },
  mounted() {
    document.title = 'Pixabay Gallery Demo';
  }
};
</script>
