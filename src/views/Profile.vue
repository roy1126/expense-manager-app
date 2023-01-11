<template>
  <div class="profile">
    <div class="top-div">
      <img class="profile-picture" :src="imageUrl" alt="Account" />
      <div class="top-labels">
        <span class="welcome-text">Welcome!</span>
        <span class="name-text">{{ name }}</span>
      </div>
    </div>

    <NoDataContainer v-if="isEmpty" @getSampleJsonHandler="getSampleJsonData" />

    <div v-else>
      <div class="pagination-blocks">
        <div
          v-for="(el, index) in dataCount"
          :key="index"
          :style="{
            backgroundColor: cutOffPage === index ? 'orangeRed' : 'lightGray',
          }"
        ></div>
      </div>

      <div class="total-card">
        <span class="as-of-label">as of {{ dateCoverage }}</span>
        <span class="card-label">Current Savings</span>
        <div class="savings-div">
          <span class="savings-label">₱ {{ savingsTotal }}</span>
          <span
            class="percent-difference"
            :style="{ backgroundColor: percentColor }"
            >{{ gainPercentageLabel }}%</span
          >
        </div>
        <div class="income-expense-box">
          <div class="income-box">
            <div class="icon-circle">
              <v-icon color="green" large>mdi-arrow-down</v-icon>
            </div>
            <div class="income-box-labels">
              <span class="card-label">Income</span>
              <span class="card-label">₱ {{ income }}</span>
            </div>
          </div>

          <div class="expense-box">
            <div class="icon-circle">
              <v-icon color="red" large>mdi-arrow-up</v-icon>
            </div>
            <div class="expense-box-labels">
              <span class="card-label">Expense</span>
              <span class="card-label">₱ {{ expense }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="transaction-div">
        <div class="transactions-top">
          <span class="transaction-label">Transactions</span>
          <div class="sort-div">
            <v-btn
              small
              text
              :color="ascendingData.color"
              @click="ascendingHandler"
            >
              <v-icon>{{ ascendingData.icon }}</v-icon>
            </v-btn>
          </div>
        </div>
        <p class="asc-text">{{ ascendingData.label }}</p>
        <ExpenseBox
          v-for="trans in cutOffData.transactions"
          :key="trans.id"
          :expense="trans"
        />
      </div>
    </div>

    <v-dialog v-model="addDialog" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Add Expense</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-select
                v-model="addExpense.expense"
                menu-props="auto"
                placeholder="Select expense type"
                :items="expensesLabel"
                :label="addExpense.expense.label"
                :prepend-icon="selectedExpenseIcon()"
                hide-details
                single-line
              ></v-select>
              <v-col cols="10" sm="6" md="6" :style="{ paddingLeft: 0 }">
                <v-text-field
                  v-model="addExpense.cost"
                  label="Cost*"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeAddDialog">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="saveAddExpense">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div v-if="dataCount !== 0" class="float-buttons">
      <v-btn icon @click="prevExpenseHandler">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-btn
        text
        style="width: 300px; border-radius: 10px"
        @click="openAddDialog"
        ><span> <v-icon>mdi-plus-circle</v-icon> </span
        ><span>Add Expense</span></v-btn
      >
      <v-btn icon @click="nextExpenseHandler">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import ExpenseBox from "@/components/Expense-Box";
import { expensesEnums } from "@/utils/index";
import json from "../.././sample.json";
import NoDataContainer from "@/components/No-Data-Container";
export default {
  name: "Profile",
  components: { ExpenseBox, NoDataContainer },
  data() {
    return {
      addDialog: false,
      ascendingData: {},
      ascendingEnums: {
        0: {
          icon: "mdi-sort-ascending",
          color: this.darkMode() ? "white" : "black",
          label: "LATEST DATE",
        },
        1: { icon: "mdi-sort-ascending", color: "green", label: "COST" },
        2: { icon: "mdi-sort-descending", color: "red", label: "COST" },
      },
      addExpense: {
        expense: "",
        cost: null,
      },
      expenses: expensesEnums,
      cutOffPage: 0,
    };
  },
  mounted() {
    this.sortToDate();
    this.ascendingData = { type: 0, ...this.ascendingEnums["0"] };
  },
  computed: {
    name() {
      return this.$store.getters.getUser.name;
    },
    cutOffData: {
      get() {
        return this.$store.getters.cutOffData(this.cutOffPage);
      },
    },
    isEmpty() {
      const data = this.$store.getters.getData;
      if (data.length === 0) return true;
      else return false;
    },
    dataCount() {
      return this.$store.getters.getData.length;
    },
    expensesLabel() {
      return this.expenses.map((e) => e.label);
    },
    imageUrl() {
      const url = this.$store.getters.getUser.imageUrl;
      return require(`@/assets/${url}`);
    },
    savingsTotal() {
      return this.income - this.expense;
    },
    gainPercentageLabel() {
      const data = this.$store.getters.getData;
      if (data.length === 0 || !data[this.cutOffPage].transactions) return 0;
      let finalPercentage;
      if (this.cutOffPage + 1 >= data.length) {
        finalPercentage = 0;
      } else {
        const prevGainPercent = this.getGainPercent(data[this.cutOffPage + 1]);
        const currentGainPercent = this.getGainPercent(data[this.cutOffPage]);
        finalPercentage = currentGainPercent - prevGainPercent;
      }
      const isPositive = finalPercentage >= 0;
      finalPercentage = finalPercentage.toFixed(2);
      if (isPositive) return "+" + finalPercentage;
      return finalPercentage;
    },
    dateCoverage() {
      return this.cutOffData.dateCoverage;
    },
    income() {
      return this.cutOffData.income;
    },
    expense() {
      const transactions = this.cutOffData.transactions;
      if (transactions.length === 0) return 0;
      const totalExpense = transactions
        .map((e) => parseInt(e.cost))
        .reduce(this.getSum);
      return totalExpense;
    },
    percentColor() {
      const isPositive = parseInt(this.gainPercentageLabel) >= 0;
      if (isPositive) {
        return "#1dad1d";
      } else {
        return "#8e1111";
      }
    },
  },
  methods: {
    darkMode() {
      return this.$store.getters.getSettings.darkMode;
    },
    getSampleJsonData() {
      const jsonData = [...json.data];
      this.$store.commit("setData", jsonData);
    },
    getGainPercent(data) {
      const income = data.income;
      if (data.transactions.length === 0) return 0.0;
      const expenses = data.transactions
        .map((e) => parseInt(e.cost))
        .reduce(this.getSum);
      const gainPercent = ((income - expenses) / income) * 100;
      return gainPercent;
    },
    getSum(total = 0, numString) {
      return total + parseInt(numString);
    },
    sortToDate() {
      if (!this.cutOffData || !this.cutOffData.transactions) return;
      if (this.cutOffData.transactions.length !== 0) {
        this.cutOffData.transactions = this.cutOffData.transactions.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
      }
    },
    selectedExpenseIcon() {
      if (this.addExpense.expense === "") return "";
      return this.expenses.filter((e) => e.label === this.addExpense.expense)[0]
        .icon;
    },
    prevExpenseHandler() {
      this.cutOffPage--;
      if (this.cutOffPage < 0) {
        this.cutOffPage = 0;
      }
      this.ascendingData = { type: 0, ...this.ascendingEnums["0"] };
      this.sortToDate();
    },
    nextExpenseHandler() {
      this.cutOffPage++;
      const data = this.$store.getters.getData;
      if (this.cutOffPage > data.length - 1) {
        this.cutOffPage = 0;
      }
      this.ascendingData = { type: 0, ...this.ascendingEnums["0"] };
      this.sortToDate();
    },
    ascendingHandler() {
      this.ascendingData.type++;
      if (this.ascendingData.type === 3) {
        this.ascendingData.type = 0;
      }
      const selected = this.ascendingEnums[this.ascendingData.type];
      this.ascendingData.label = selected.label;
      this.ascendingData.icon = selected.icon;
      this.ascendingData.color = selected.color;
      switch (this.ascendingData.type) {
        case 0:
          this.cutOffData.transactions = this.cutOffData.transactions.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );
          break;
        case 1:
          this.cutOffData.transactions = this.cutOffData.transactions.sort(
            (a, b) => a.cost - b.cost
          );
          break;
        case 2:
          this.cutOffData.transactions = this.cutOffData.transactions.sort(
            (a, b) => b.cost - a.cost
          );
          break;
      }
    },
    getDateNow() {
      const date = new Date();
      const month = date
        .toLocaleString("default", { month: "long" })
        .slice(0, 3);
      const day = date.getDate();
      const year = date.getFullYear();
      const newDate = `${month}. ${day}, ${year}`;
      return newDate;
    },
    saveAddExpense() {
      const transId = this.cutOffData.transactions.length + 1;
      let newExpense = {
        transId,
        expenseId: this.expenses.find(
          (e) => e.label === this.addExpense.expense
        ).id,
        cost: this.addExpense.cost,
        date: this.getDateNow(),
      };
      this.$store.commit("addTransToCutOff", {
        cutOffId: this.cutOffData.cutOffId,
        trans: newExpense,
      });
      this.addDialog = false;
    },
    openAddDialog() {
      this.addExpense = {
        expense: "",
        cost: null,
      };
      this.addDialog = true;
    },
    closeAddDialog() {
      this.addDialog = false;
    },
  },
};
</script>

<style scoped>
.profile {
  margin: 0 15px 50px 15px;
}

.top-div {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.profile-picture {
  margin: 15px;
  padding: 5px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

/* .profile-circle {
  margin: 15px;
  padding: 5px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  text-align: center;
  vertical-align: middle;
  background-color: red;
} */
.icon-circle {
  margin: 15px;
  padding: 5px;
  background-color: rgba(255, 255, 255, 0.397);
  border-radius: 50%;
  display: inline-block;
}

.pagination-blocks {
  height: 20px;
  margin-bottom: 5px;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
}

.pagination-blocks div {
  border-radius: 5px;
  height: 5px;
  width: 50px;
}

.top-labels {
  margin: 15px 0;
  display: flex;
  flex-direction: column;
}

.welcome-text {
  font-size: 18px;
  font-weight: 400;
  color: #878787;
}

.name-text {
  font-size: 22px;
  font-weight: 600;
}

.total-card {
  width: 100%;
  padding: 20px;
  display: flex;
  border-radius: 30px;
  align-items: center;
  flex-direction: column;
  background: linear-gradient(140deg, cyan, darkviolet, orangered, pink);
}

.as-of-label {
  font-size: 12px;
  width: 100%;
  color: white;
  text-align: end;
  font-style: italic;
}

.card-label {
  color: white;
  font-size: 20px;
  font-weight: 500;
}

.savings-div {
  display: flex;
  align-items: center;
  gap: 10px;
}

.savings-label {
  color: white;
  font-size: 40px;
  font-weight: 500;
}

.percent-difference {
  color: white;
  padding: 5px;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 700;
}

.income-expense-box {
  width: 100%;
  display: flex;
}

.income-box,
.expense-box {
  width: 50%;
  display: flex;
  justify-content: center;
}

.income-box-labels,
.expense-box-labels {
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.transaction-div {
  margin-top: 20px;
  padding: 10px;
}

.transactions-top {
  display: flex;
  align-items: center;
}

.asc-text {
  text-align: end;
  font-size: 10px;
  margin-right: 10px;
}

.sort-div {
  display: flex;
}

.transaction-label {
  width: 100%;
  color: rgb(129, 129, 129);
  font-size: 22px;
  font-weight: 500;
}

.view-all {
  width: 100px;
  font-size: 15px;
  text-align: end;
  color: rgb(87, 87, 87);
  text-decoration: underline;
}

.transaction-list {
  margin: 10px;
  padding: 10px;
  border-radius: 20px;
}

.float-buttons {
  padding: 5px;
  bottom: 20px;
  width: 500px;
  height: 50px;
  position: fixed;
  display: flex;
  left: calc(50vw - 250px);
  justify-content: space-between;
}

.float-buttons .v-btn {
  color: white;
  box-shadow: 2px 2px 15px #3d3d3d;
  background-color: rgb(255, 118, 68);
}
</style>
