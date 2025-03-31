import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        apiKey: process.env.VUE_APP_PIXABAY_API_KEY,
        images: [],
        query: '',
        loading: false,
        filters: {
            q: '',
            lang: 'en',
            image_type: 'all',
            orientation: 'all',
            category: '',
            colors: '',
            safesearch: 'false',
            min_width: '',
            min_height: '',
            editors_choice: 'false',
            order: '',
            page: 1,
            per_page: 12,
            totalPages: 1,
        },
    },
    mutations: {
        SET_IMAGES(state, images) {
            state.images = images;
        },
        SET_QUERY(state, query) {
            state.filters.q = query;
            state.filters.page = 1;
            state.filters.totalPages = 1;
        },
        SET_PAGE(state, page) {
            state.filters.page = page;
        },
        SET_TOTAL_PAGES(state, totalHits) {
            state.filters.totalPages = Math.ceil(totalHits / 12);
        },
        SET_LOADING(state, loading) {
            state.loading = loading;
        },
        SET_FILTERS(state, filters) {
            state.filters = filters;
        }
    },
    actions: {
        async fetchImages({commit, state}) {
            commit('SET_LOADING', true);
            try {
                const qParams = {
                    key: state.apiKey,
                    q: state.filters.q,
                    page: state.filters.page,
                };
                //append filters to query params which are not empty
                for (const key in state.filters) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    if (state.filters[key] !== '') {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        qParams[key] = state.filters[key];
                    }
                }
                const response = await axios.get('https://pixabay.com/api/', {
                    params: qParams,
                });
                commit('SET_IMAGES', response.data.hits);
                commit('SET_TOTAL_PAGES', response.data.totalHits);
            } catch (error) {
                console.error('Error fetching images:', error);
            } finally {
                commit('SET_LOADING', false);
            }
        },
    },
});
