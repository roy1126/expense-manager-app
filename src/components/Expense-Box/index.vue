<template>
  <div class="expense-box">
    <v-avatar size="35" color="blue" class="ml-3">
      <v-icon color="white">{{ transformedData.icon }}</v-icon></v-avatar
    >
    <span class="expense-label">{{ transformedData.name }}</span>
    <span
      v-if="!transformedData.date"
      class="expense-cost"
      style="margin-right: 20px"
      >₱{{ Math.round(transformedData.cost) }}</span
    >
    <div v-else class="cost-date">
      <span class="expense-cost">₱{{ Math.round(transformedData.cost) }}</span>
      <span class="expense-date">{{
        getProperDate(transformedData.date)
      }}</span>
    </div>
  </div>
</template>

<script>
import { expensesEnums } from "@/utils/index";
export default {
  name: "ExpenseBox",
  props: {
    expense: {
      required: true,
      type: Object,
    },
  },
  computed: {
    transformedData() {
      let newExpense = { ...this.expense };
      const id = newExpense.expenseId;
      const selectedExpense = expensesEnums.find((e) => e.id === id);
      newExpense.name = selectedExpense.label;
      newExpense.icon = selectedExpense.icon;
      return newExpense;
    },
  },
  methods: {
    getProperDate(date) {
      return new Date(date).toDateString().slice(4);
    },
  },
};
</script>

<style scoped>
.expense-box {
  width: 100% !important;
  display: flex;
  margin: 15px 0;
  padding: 5px;
  border-radius: 10px;
  align-items: center;
  background-color: white;
}
.expense-label {
  width: 100%;
  font-size: 22px;
  font-weight: bold;
  margin-left: 10px;
  color: rgb(77, 77, 77);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}
.expense-cost {
  font-size: 20px;
  font-weight: 700;
  text-align: end;
  color: rgb(107, 107, 107);
}
.cost-date {
  width: 100px;
  display: flex;
  flex-direction: column;
  margin-right: 30px;
}
.expense-date {
  font-size: 12px;
  color: darkgrey;
  text-align: end;
  font-style: italic;
}
</style>
