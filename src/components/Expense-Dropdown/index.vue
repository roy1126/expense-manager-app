<template>
  <v-select
    v-model="expenseValue"
    placeholder="Select expense type"
    :items="expensesItems"
    item-text="label"
    item-value="id"
    :prepend-icon="selectedExpenseIcon()"
    outlined
    single-line
    dense
  ></v-select>
</template>

<script>
import { expensesEnums } from "@/utils/index";
export default {
  name: "ExpenseDropdown",
  props: {
    expense: {
      required: true,
      type: String,
    },
  },
  computed: {
    expenseValue: {
      get() {
        return this.expense;
      },
      set(value) {
        this.$emit("change-expense", value);
      },
    },
    expensesItems() {
      return [...expensesEnums];
    },
  },
  methods: {
    selectedExpenseIcon() {
      if (this.expenseValue === "") return "";
      return expensesEnums.filter((e) => e.id === this.expenseValue)[0].icon;
    },
  },
};
</script>

<style scoped></style>
