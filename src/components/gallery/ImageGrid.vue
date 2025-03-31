<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    <div v-for="(image, index) in images"
         :key="index"
         class="relative group cursor-pointer"
         @click="handleClick(index)">

      <div class="absolute inset-0 bg-cover bg-center blur-md scale-110 opacity-50"
           :style="{ backgroundImage: `url(${image.previewURL})` }">
      </div>

      <img :src="image.webformatURL"
           :alt="image.alt"
           class="w-full h-48 object-cover rounded-lg transition-transform transform group-hover:scale-105"
           loading="lazy"/>
    </div>

    <transition name="fade-scale">
      <div v-if="showModal"
           class="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
           @keydown.esc="closeModal"
           @click="closeModal"
           tabindex="0"
           ref="modal">
        <div class="relative"
             @click.stop
             @touchstart="handleTouchStart"
             @touchmove="handleTouchMove"
             @touchend="handleTouchEnd">

          <div class="absolute inset-0 bg-cover bg-center blur-2xl opacity-40"
               :style="{ backgroundImage: `url(${currentImage?.largeImageURL})` }"></div>

          <div v-if="loading" class="absolute inset-0 flex items-center justify-center">
            <div class="animate-spin h-10 w-10 border-t-2 border-white rounded-full"></div>
          </div>
          <div @mousemove="handleMouseMove"
               @mouseleave="hideMagnifier"
               ref="imageContainer">
            <img ref="image"
                 loading="lazy"
                 v-if="currentImage"
                 :src="currentImage.largeImageURL"
                 alt=""
                 @load="loading = false"
                 :style="{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transition: zooming ? 'none' : 'transform 0.3s ease',
                  maxHeight: '90vh',
                  maxWidth: '100%',
                  objectFit: 'contain'
                 }"
                 draggable="false"
                 class="relative h-auto object-cover rounded-lg transition-opacity"/>
          </div>

          <div v-if="!loading && currentImage?.tags" class="w-full text-center text-white text-sm absolute p-4"
               style="margin-top: -50px; background: rgb(59 130 246 / 0.5); height: 50px;white-space: nowrap;  overflow: hidden;  text-overflow: ellipsis;">
            {{ currentImage.tags }}
          </div>

          <div v-if="!loading" class="absolute bottom-2 right-2 text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded-lg">
            {{ currentIndex + 1 }} / {{ images.length }}
          </div>

          <button v-if="!loading" class="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70"
                  @click="closeModal">
            ✕
          </button>

          <button
              v-if="!loading"
              @click="toggleFullscreen"
              class="absolute top-2 right-12 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16">
              <path d="M1 1h5v1H2v3H1V1zm9 0h5v5h-1V2h-3V1zm5 9v5h-5v-1h3v-3h1zM5 14H1v-5h1v3h3v1z"/>
            </svg>
          </button>

          <button
              v-if="!loading"
              @click="zoomIn"
              class="absolute top-2 right-36 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16">
              <path d="M8 1a7 7 0 1 0 4.646 12.207l2.927 2.927a1 1 0 0 0 1.414-1.414l-2.927-2.927A7 7 0 0 0 8 1zm0 2a5 5 0 1 1 0 10A5 5 0 0 1 8 3zm1 4h2v1H9v2H8V8H6V7h2V5h1v2z"/>
            </svg>

          </button>

          <button
              v-if="!loading"
              @click="zoomOut"
              class="absolute top-2 right-24 bg-black bg-opacity-50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16">
              <path d="M8 1a7 7 0 1 0 4.646 12.207l2.927 2.927a1 1 0 0 0 1.414-1.414l-2.927-2.927A7 7 0 0 0 8 1zm0 2a5 5 0 1 1 0 10A5 5 0 0 1 8 3zm-2 4h4v1H6V7z"/>
            </svg>

          </button>


          <div
              v-if="showMagnifier"
              class="magnifier"
              :style="magnifierStyle"
          ></div>


          <button
              v-if="hasPrev && !loading"
              @click="prevImage"
              class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70">
            ◀
          </button>
          <button
              v-if="hasNext && !loading"
              @click="nextImage"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70">
            ▶
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'
import {ImageModel} from "@/models/ImageModel";

@Component
export default class ImageGrid extends Vue {
  @Prop({required: true}) images!: ImageModel[];

  private currentIndex = -1;
  private touchStartX = 0;
  private loading = true;
  private zoom = 1;
  private zooming = false;
  private rotation = 0;
  private showMagnifier = false;
  private magnifierX = 0;
  private magnifierY = 0;
  private magnifierSize = 150;

  get showModal() {
    return this.currentIndex !== -1;
  }

  get currentImage() {
    if (this.currentIndex === -1) return null;
    return this.images[this.currentIndex];
  }

  get hasPrev() {
    return this.currentIndex !== -1 && this.currentIndex > 0;
  }

  get hasNext() {
    return this.currentIndex !== -1 && this.currentIndex < this.images.length - 1;
  }

  mounted() {
    window.addEventListener('keydown', this.handleKeydown);
  }

  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeydown);
  }

  toggleFullscreen() {
    const elem = this.$refs.image as HTMLElement;
    if (!document.fullscreenElement) {
      elem?.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

  handleClick(index: number) {
    if (window.innerWidth >= 768) { // Open modal only on desktop
      this.openModal(index);
    }
  }

  openModal(index: number) {
    this.zoom = 1;
    this.currentIndex = index;
    this.loading = true;
    this.$nextTick(() => {
      (this.$refs.modal as HTMLElement)?.focus();
    })
  }

  closeModal() {
    this.currentIndex = -1;
  }

  prevImage() {
    if (this.hasPrev) {
      this.zoom = 1;
      this.currentIndex--;
      this.loading = true;
    }
  }

  nextImage() {
    if (this.hasNext) {
      this.zoom = 1;
      this.currentIndex++;
      this.loading = true;
    }
  }

  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft' && this.hasPrev) {
      this.prevImage();
    } else if (event.key === 'ArrowRight' && this.hasNext) {
      this.nextImage();
    }
  }

  handleTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
  }

  handleTouchMove(event: TouchEvent) {
    if (!this.touchStartX) return
    const deltaX = event.touches[0].clientX - this.touchStartX;

    if (deltaX > 50 && this.hasPrev) {
      this.prevImage();
      this.touchStartX = 0;
    } else if (deltaX < -50 && this.hasNext) {
      this.nextImage();
      this.touchStartX = 0;
    }
  }

  handleTouchEnd() {
    this.touchStartX = 0;
  }

  zoomIn() {
    this.zoom = Math.min(this.zoom * 1.2, 3);
  }

  zoomOut() {
    this.zoom = Math.max(this.zoom / 1.2, 1);
  }

  get magnifierStyle() {
    if (!this.currentImage) return {};
    return {
      left: `${this.magnifierX}px`,
      top: `${this.magnifierY}px`,
      backgroundImage: `url(${this.currentImage.largeImageURL})`,
      backgroundPosition: `${-this.magnifierX * 2}px ${-this.magnifierY * 2}px`,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      backgroundSize: `${this.$refs.imageContainer?.clientWidth * 2}px ${this.$refs.imageContainer?.clientHeight * 2}px`
    };
  }

  handleMouseMove(event: MouseEvent | TouchEvent) {
    if (!this.currentImage) return;

    this.showMagnifier = true;

    const imageContainer = this.$refs.imageContainer as HTMLElement;
    const rect = imageContainer.getBoundingClientRect();

    let clientX = (event as MouseEvent).clientX || (event as TouchEvent).touches[0].clientX;
    let clientY = (event as MouseEvent).clientY || (event as TouchEvent).touches[0].clientY;

    this.magnifierX = Math.max(0, Math.min(clientX - rect.left - this.magnifierSize / 2, rect.width - this.magnifierSize));
    this.magnifierY = Math.max(0, Math.min(clientY - rect.top - this.magnifierSize / 2, rect.height - this.magnifierSize));
  }

  hideMagnifier() {
    this.showMagnifier = false;
  }

}
</script>


<style lang="scss" scoped>
.fade-scale-enter-active, .fade-scale-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-scale-enter, .fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}


/* IMAGE LOADING TRANSITION */
img {
  transition: opacity 0.3s ease;
}

button {
  transition: background-color 0.2s ease;
}

.magnifier {
  position: absolute;
  width: 150px;
  height: 150px;
  border: 2px solid #fff;
  border-radius: 50%;
  pointer-events: none;
  background-repeat: no-repeat;
  background-size: cover;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  z-index: 10;
  transition: all 0.1s ease;
}

</style>
