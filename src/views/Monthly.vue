<template>
  <div class="monthly">
    <div class="text-center">
      <h1>Monthly Expenses</h1>
    </div>
    <NoDataContainer v-if="isEmpty" @getSampleJsonHandler="getSampleJsonData" />

    <v-container v-else-if="this.expenses.length === 0" class="no-expenses-div">
      <span>No data to show.</span>
      <span
        >Go to
        <v-btn outlined color="primary" @click="navigateToProfile"
          >profile</v-btn
        ></span
      >
    </v-container>

    <div v-else>
      <PieChart
        :values="chartValues"
        :legendLabels="chartLabels"
        :colors="colors"
      ></PieChart>
      <div class="expenses">
        <ExpenseBox
          v-for="expense in expenses"
          :key="expense.id"
          :expense="expense"
        />
      </div>
    </div>
  </div>
</template>

<script>
import PieChart from "@/components/Pie-Chart";
import ExpenseBox from "@/components/Expense-Box";
import json from "../.././sample.json";
import NoDataContainer from "@/components/No-Data-Container";
import { getColors, expensesEnums } from "@/utils/index";
import router from "@/router";
export default {
  name: "Profile",
  components: { PieChart, ExpenseBox, NoDataContainer },
  computed: {
    expenses() {
      return this.$store.getters.monthlyExpenses;
    },
    isEmpty() {
      const data = this.$store.getters.getData;
      if (data.length === 0) return true;
      else return false;
    },
    chartValues() {
      return this.expenses.map((e) => parseInt(e.cost));
    },
    chartLabels() {
      let array = [];
      for (let i = 0; i < this.expenses.length; i++) {
        for (let j = 0; j < expensesEnums.length; j++) {
          if (this.expenses[i].expenseId === expensesEnums[j].id) {
            let name = expensesEnums[j].label;
            array.push(name);
          }
        }
      }
      return array;
    },
    colors() {
      return getColors(this.expenses.length);
    },
  },
  methods: {
    navigateToProfile() {
      router.push("/profile");
    },
    getSampleJsonData() {
      const jsonData = [...json.data];
      this.$store.commit("setData", jsonData);
    },
  },
};
</script>
<style scoped>
.monthly {
  align-content: center;
}

.no-expenses-div {
  gap: 20px;
  display: flex;
  width: 100%;
  height: 500px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.no-expenses-div span {
  font-size: 14px;
}

.expenses {
  margin: 0 15px 50px 15px;
  padding: 10px;
}

</style>
