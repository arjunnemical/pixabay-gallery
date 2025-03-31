<template>
  <div class="flex">

    <button
        @click="toggleSidebar"
        class="fixed bottom-4 right-4 p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all z-50">

      <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
        <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
        />
      </svg>
    </button>

    <div class="fixed z-50 bg-white  shadow-lg transition-all duration-300"
         :class="{ 'w-0 p-0 overflow-hidden': isCollapsed,
          'w-64 p-4 overflow-hidden': !isCollapsed}" style="height: 100vh;">

      <div class="text-lg font-bold mb-4 text-right flex">
        <span class="flex-1 text-left">
          Filters
        </span>
        <button
            @click="toggleSidebar"
            class="text-xl font-bold text-gray-500 hover:text-gray-700 text-right">
          &times;
        </button>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Safe Search</label>
        <div class="mt-2">
          <label class="inline-flex items-center">
            <input type="radio" class="form-radio" name="safesearch" value="false" v-model="filters.safesearch">
            <span class="ml-2">Off</span>
          </label>
          <label class="inline-flex items-center ml-6">
            <input type="radio" class="form-radio" name="safesearch" value="true" v-model="filters.safesearch">
            <span class="ml-2">On</span>
          </label>
        </div>
      </div>

      <div class="mb-4">
        <span class="text-gray-700">Editor's Choice</span>
        <div class="mt-2">
          <label class="inline-flex items-center">
            <input type="radio" class="form-radio" name="editors_choice" value="false" v-model="filters.editors_choice">
            <span class="ml-2">Off</span>
          </label>
          <label class="inline-flex items-center ml-6">
            <input type="radio" class="form-radio" name="editors_choice" value="true" v-model="filters.editors_choice">
            <span class="ml-2">On</span>
          </label>
        </div>
      </div>

      <div class="mb-4">
        <span class="text-gray-700">Order</span>
        <div class="mt-2">
          <label class="inline-flex items-center">
            <input type="radio" class="form-radio" name="order" value="popular" v-model="filters.order">
            <span class="ml-2">Popular</span>
          </label>
          <label class="inline-flex items-center ml-6">
            <input type="radio" class="form-radio" name="order" value="latest" v-model="filters.order">
            <span class="ml-2">Latest</span>
          </label>
        </div>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Language</label>
        <select
            v-model="filters.lang"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md">

          <option value="cs">Czech</option>
          <option value="da">Danish</option>
          <option value="de">German</option>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="id">Indonesian</option>
          <option value="it">Italian</option>
          <option value="hu">Hungarian</option>
          <option value="nl">Dutch</option>
          <option value="no">Norwegian</option>
          <option value="pl">Polish</option>
          <option value="pt">Portuguese</option>
          <option value="ro">Romanian</option>
          <option value="sk">Slovak</option>
          <option value="fi">Finnish</option>
          <option value="sv">Swedish</option>
          <option value="tr">Turkish</option>
          <option value="vi">Vietnamese</option>
          <option value="th">Thai</option>
          <option value="bg">Bulgarian</option>
          <option value="ru">Russian</option>
          <option value="el">Greek</option>
          <option value="ja">Japanese</option>
          <option value="ko">Korean</option>
          <option value="zh">Chinese</option>

        </select>

      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Image Type</label>
        <select
            v-model="filters.image_type"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md">
          <option value="all">All</option>
          <option value="photo">Photo</option>
          <option value="illustration">Illustration</option>
          <option value="vector">Vector</option>
        </select>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Orientation</label>
        <select
            v-model="filters.orientation"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md">
          <option value="all">All</option>
          <option value="horizontal">Horizontal</option>
          <option value="vertical">Vertical</option>
        </select>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Category</label>
        <select
            v-model="filters.category"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md">
          <option value="">All</option>
          <option value="backgrounds">Backgrounds</option>
          <option value="fashion">Fashion</option>
          <option value="nature">Nature</option>
          <option value="science">Science</option>
          <option value="education">Education</option>
          <option value="feelings">Feelings</option>
          <option value="health">Health</option>
          <option value="people">People</option>
          <option value="religion">Religion</option>
          <option value="places">Places</option>
          <option value="animals">Animals</option>
          <option value="industry">Industry</option>
          <option value="computer">Computer</option>
          <option value="food">Food</option>
          <option value="sports">Sports</option>
          <option value="transportation">Transportation</option>
          <option value="travel">Travel</option>
          <option value="buildings">Buildings</option>
          <option value="business">Business</option>
          <option value="music">Music</option>
        </select>
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700">Colors</label>
        <select
            v-model="filters.colors"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-md">
          <option value="">All</option>
          <option value="grayscale">Grayscale</option>
          <option value="transparent">Transparent</option>
          <option value="red">Red</option>
          <option value="orange">Orange</option>
          <option value="yellow">Yellow</option>
          <option value="green">Green</option>
          <option value="turquoise">Turquoise</option>
          <option value="blue">Blue</option>
          <option value="lilac">Lilac</option>
          <option value="pink">Pink</option>
          <option value="white">White</option>
          <option value="gray">Gray</option>
          <option value="black">Black</option>
          <option value="brown">Brown</option>
        </select>
      </div>

      <button
          @click="applyFilters"
          class="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        Apply Filters
      </button>

    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {State} from "vuex-class";

@Component
export default class FiltersSidebar extends Vue {
  @State('filters') filters!: never;

  isCollapsed = true;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  applyFilters() {
    this.$emit('apply-filters', this.filters);
  }
}
</script>

<style lang="scss" scoped>
/* Add custom styles if needed */
</style>
