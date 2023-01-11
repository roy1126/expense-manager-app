import Vue from "vue";
import Vuex from "vuex";
import { getDateString, expensesEnums } from "@/utils/index";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      id: "userId001",
      name: "Roy Abanilla",
      imageUrl: "sample-person.jpg",
    },
    data:[],
    settings: {
      language: "english",
      darkMode: false,
    },
  },
  mutations: {
    setData(state, data) {
      state.data = [...data];
    },
    setUser(state, name, imageUrl) {
      state.user.id = Math.floor(Math.random() * 100);
      state.user.name = name;
      state.user.imageUrl = imageUrl;
    },
    addCutOffData(state, cutOff) {
      const cutOffId = Math.floor(Math.random() * 100);
      const newCutOff = { ...cutOff, cutOffId };
      state.data = [newCutOff, ...state.data];
    },
    addTransToCutOff(state, payload) {
      const transId = Math.floor(Math.random() * 100);
      const newTrans = { ...payload.trans, transId };
      const index = state.data.findIndex(
        (e) => e.cutOffId === payload.cutOffId
      );
      state.data[index].transactions = [
        ...state.data[index].transactions,
        newTrans,
      ];
    },
    setLanguage(state, language) {
      state.settings.language = language;
    },
    setDarkMode(state) {
      state.settings.darkMode = !state.settings.darkMode;
    },
  },
  actions: {
    // setDataAction({ commit }) {
    //   callApi("api-link").then((response) => {
    //     commit("setData", response.data);
    //   });
    // },
  },
  getters: {
    getSettings(state) {
      return state.settings;
    },
    getData(state) {
      return state.data;
    },
    getUser(state) {
      return state.user;
    },
    cutOffData: (state) => (index) => {
      return state.data[index];
    },
    transactionsList(state) {
      let transactions = [];
      for (let i = 0; i < state.data.length; i++) {
        let currentTransactions = state.data[i].transactions || [];
        transactions = [...transactions, ...currentTransactions];
      }
      return transactions;
    },
    trackedList(state, getters) {
      let list = {};
      for (let i = 0; i < getters.transactionsList.length; i++) {
        const trans = getters.transactionsList[i];
        let date = getDateString(trans.date);
        const icon = expensesEnums.find((e) => e.id === trans.expenseId).icon;
        const expenseName = expensesEnums.find(
          (e) => e.id === trans.expenseId
        ).label;
        const newTrans = { ...trans, icon, expenseName };
        if (Object.keys(list).includes(date)) {
          list[date].push(newTrans);
        } else {
          list[date] = [...(list[date] || []), newTrans];
        }
      }
      return list;
    },
    reminderList(state, getters) {
      let list = [];
      for (let date in getters.trackedList) {
        if (new Date() < new Date(date)) {
          let obj = {};
          obj[date] = getters.trackedList[date];
          list.push(obj);
        }
      }
      list = list.sort(
        (a, b) => new Date(Object.keys(a)[0]) - new Date(Object.keys(b)[0])
      );
      return list;
    },
    monthlyExpenses(state, getters) {
      const data = state.data;
      if (data.length === 0) return;
      let transactions = getters.transactionsList;
      let result = {};
      const enumsId = expensesEnums.map((e) => e.id);
      for (let i = 0; i < enumsId.length; i++) {
        for (let j = 0; j < transactions.length; j++) {
          if (enumsId[i] === transactions[j].expenseId) {
            if (!Object.keys(result).includes(enumsId[i])) {
              result[enumsId[i]] = [];
            }
            result[enumsId[i]].push(transactions[j]);
          }
        }
      }
      for (let expense in result) {
        let length = result[expense].length;
        let costArray = result[expense].map((e) => parseInt(e.cost));
        result[expense] =
          costArray.reduce((total = 0, num) => total + num) / length;
      }
      let expenses = [];
      for (let expense in result) {
        for (let j = 0; j < expensesEnums.length; j++) {
          if (expense === expensesEnums[j].id) {
            expenses.push({
              expenseId: expense,
              cost: result[expense],
            });
          }
        }
      }
      expenses.sort((a, b) => b.cost - a.cost);
      return expenses;
    },
  },
  modules: {},
});
