import axios from "axios";

const defaultState = {
  labs: [],
  country: null,
  city: null,
  category: null,
  providePayload: {},
  amount: 0,
};

export default {
  namespaced: true,
  state: {
    ...defaultState,
  },
  mutations: {
    SET_COUNTRY(state, country) {
      state.country = country;
    },
    SET_CITY(state, city) {
      state.city = city;
    },
    SET_CATEGORY(state, category) {
      state.category = category;
    },
    SET_LABS(state, labs) {
      state.labs = labs;
    },
    SET_STAKING_AMOUNT(state, amount) {
      state.amount = amount;
    },
    SET_PROVIDE_SERVICE_PAYLOAD(state, payload) {
      state.providePayload = payload;
    },
  },
  actions: {
    async setCountryCity({ commit }, data) {
      commit("SET_COUNTRY", data.country);
      commit("SET_CITY", data.city);
    },
    async getLabByCategory({ commit, state }, category) {
      commit("SET_CATEGORY", category);
      const baseUrl = process.env.VUE_APP_DEV_DEGENICS_BACKEND_URL;
      const labs = await axios.get(
        `${baseUrl}/labs/${state.country}/${state.city}/${category}`
      );
      commit("SET_LABS", labs.data.body.hits.hits);
    },
    async setStakingAmount({ commit }, amount) {
      commit("SET_STAKING_AMOUNT", amount);
    },
    async setProvideService({ commit }, payload) {
      commit("SET_PROVIDE_SERVICE_PAYLOAD", payload);
    },
  },
  getters: {
    getLabByCategory(state) {
      state.labs;
    },
  },
};
