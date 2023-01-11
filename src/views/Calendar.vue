<template>
  <div class="main">
    <div class="text-center">
      <h1>Calendar</h1>
    </div>

    <NoDataContainer v-if="isEmpty" @getSampleJsonHandler="getSampleJsonData" />
    <div v-else>
      <h3 class="text-center">{{ getTodayMonth }}</h3>
      <div class="reset-div">
        <v-btn small @click="resetTodayHandler"
          ><v-icon>mdi-backup-restore</v-icon></v-btn
        >
      </div>
      <div class="calendar">
        <v-btn icon @click="prevMonthHandler"
          ><v-icon>mdi-chevron-left</v-icon></v-btn
        >
        <v-sheet height="420px" width="80%">
          <v-calendar :now="now" :value="today" color="primary">
            <template v-slot:day="{ past, date, future }">
              <v-icon
                v-if="tracked[date] && !past && future"
                class="reminder-icon"
                small
                >mdi-exclamation</v-icon
              >
              <v-row class="fill-height">
                <template v-if="tracked[date]">
                  <v-sheet
                    v-for="(trans, i) in tracked[date]"
                    :key="i"
                    :color="colors[i]"
                    width="20px"
                    height="20px"
                    tile
                    class="transaction-icon"
                    :style="past || !future ? 'margin-top:30px' : ''"
                    ><v-icon small color="white">{{
                      trans.icon
                    }}</v-icon></v-sheet
                  >
                </template>
              </v-row>
            </template>
          </v-calendar>
        </v-sheet>
        <v-btn icon @click="nextMonthHandler"
          ><v-icon>mdi-chevron-right</v-icon></v-btn
        >
      </div>
      <div class="legend-div">
        <div class="legend-item">
          <v-icon color="red" small>mdi-exclamation</v-icon>
          <span>- reminder/pending transactions</span>
        </div>
      </div>
      <div class="reminder-list">
        <ReminderBox
          v-for="(reminder, index) in reminderList"
          :key="index"
          :reminder="reminder"
        />
        <v-btn
          icon
          x-large
          class="add-button"
          color="#ff4500"
          @click="openAddDialog"
          ><v-icon>mdi-plus</v-icon></v-btn
        >
      </div>

      <!-- ADD Reminder-->
      <v-dialog v-model="addDialog" persistent scrollable max-width="600px">
        <v-card>
          <v-card-title>Add a Reminder</v-card-title>
          <v-card-text
            ><v-container>
              <v-text-field
                v-model="addReminder.date"
                label="Pick a date"
                prepend-icon="mdi-calendar"
                readonly
                @click="openCalendarDialog"
              ></v-text-field>
              <ExpenseDropdown
                :expense="addReminder.expenseId"
                @change-expense="changeExpense"
              ></ExpenseDropdown>
              <v-container style="display: flex; gap: 20px"
                ><v-text-field
                  v-model="addReminder.cost"
                  label="Cost*"
                  required
                  style="width: 100px"
                ></v-text-field>
                <v-text-field
                  v-model="incomeCutOff"
                  v-if="showIncomeInput"
                  label="Income*"
                  required
                  style="width: 100px"
                ></v-text-field
              ></v-container>
              <v-card-text
                v-if="showIncomeInput"
                style="
                  font-size: 12px;
                  border: 1px solid orangered;
                  border-radius: 5px;
                "
                >The date you selected doesn't have yet the data for the certain
                cut-off. Income is needed to provide when creating a cut-off
                data. See <a href="/#/profile">profile</a> page.</v-card-text
              >
              <v-dialog v-model="calendarDialog" persistent width="290px"
                ><v-date-picker
                  v-model="addReminder.date"
                  scrollable
                  :min="minDateToAdd"
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="calendarDialog = false">
                    OK
                  </v-btn>
                </v-date-picker></v-dialog
              >
            </v-container></v-card-text
          >
          <v-card-actions>
            <v-btn color="blue darken-1" text @click="addDialog = false">
              Cancel
            </v-btn>
            <v-btn color="blue darken-1" text @click="saveReminder">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import { getDateString } from "@/utils/index";
import NoDataContainer from "@/components/No-Data-Container";
import ExpenseDropdown from "@/components/Expense-Dropdown";
import ReminderBox from "@/components/Reminder-Box";
import json from "../.././sample.json";
export default {
  components: { NoDataContainer, ReminderBox, ExpenseDropdown },
  data() {
    return {
      addDialog: false,
      calendarDialog: false,
      addReminder: {
        expenseId: null,
        date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10),
        cost: null,
      },
      showIncomeInput: false,
      incomeCutOff: null,
      now: this.getDateString(new Date()),
      today: this.getDateString(new Date()),
      colors: ["#1867c0", "orange", "#000000", "orange", "violet"],
    };
  },
  watch: {
    "addReminder.date": function (newValue, oldValue) {
      const data = this.$store.getters.getData;
      let newDate = new Date(newValue);
      const day = newDate.getDate() <= 15 ? 15 : 30;
      newDate.setDate(day);
      let checkIfBelong = false;
      for (let i in data) {
        if (
          new Date(data[i].dateCoverage).toDateString() ===
          new Date(newDate).toDateString()
        ) {
          checkIfBelong = true;
          break;
        }
      }
      if (!checkIfBelong) {
        this.showIncomeInput = true;
      } else {
        this.showIncomeInput = false;
      }
    },
  },
  computed: {
    minDateToAdd() {
      return getDateString(this.now);
    },
    tracked() {
      return this.$store.getters.trackedList;
    },
    reminderList() {
      return this.$store.getters.reminderList;
    },
    getTodayMonth() {
      let date = new Date(this.today).toLocaleString("en-us", {
        month: "short",
        year: "numeric",
      });
      return date;
    },
    isEmpty() {
      const data = this.$store.getters.getData;
      if (data.length === 0) return true;
      else return false;
    },
  },
  methods: {
    changeExpense(value) {
      this.addReminder.expenseId = value;
    },
    getSampleJsonData() {
      const jsonData = [...json.data];
      this.$store.commit("setData", jsonData);
    },
    resetTodayHandler() {
      this.today = this.getDateString(new Date());
      this.now = this.getDateString(new Date());
    },
    getDateString(date) {
      const year = new Date(date).getFullYear();
      let month = new Date(date).getMonth() + 1;
      const day = new Date(date).getDate();
      if (String(Math.abs(month)).charAt(0) == month) {
        month = "0" + month;
      }
      const newDate = year + "-" + month + "-" + day;
      return newDate;
    },
    prevMonthHandler() {
      let date = new Date(this.today);
      let newDate = new Date(date.setMonth(date.getMonth() - 1));
      this.today = this.getDateString(newDate);
    },
    nextMonthHandler() {
      let date = new Date(this.today);
      let newDate = new Date(date.setMonth(date.getMonth() + 1));
      this.today = this.getDateString(newDate);
    },
    openAddDialog() {
      this.addReminder = {
        expenseId: "",
        date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10),
        cost: null,
      };
      this.incomeCutOff = null;
      this.addDialog = true;
    },
    openCalendarDialog() {
      this.calendarDialog = true;
      console.log("open calendar");
    },
    saveReminder() {
      if (this.showIncomeInput && !this.incomeCutOff) {
        return;
      }
      if (
        !this.addReminder.date ||
        !this.addReminder.cost ||
        !this.addReminder.expenseId
      ) {
        return;
      }
      let dataLocal = this.$store.getters.getData;
      const calendarDate = new Date(this.addReminder.date);
      for (let i = 0; i < dataLocal.length; i++) {
        const localDate = new Date(dataLocal[i].dateCoverage);
        const monthCutOff = localDate.getMonth();
        const yearCutOff = localDate.getFullYear();
        const monthPicked = calendarDate.getMonth();
        const yearPicked = calendarDate.getFullYear();
        if (
          monthCutOff === monthPicked &&
          yearCutOff === yearPicked &&
          localDate.getDate() >= calendarDate.getDate()
        ) {
          const trans = this.addReminder;
          this.$store.commit("addTransToCutOff", {
            cutOffId: dataLocal[i].cutOffId,
            trans: this.addReminder,
          });
          this.addDialog = false;
          return;
        }
      }
      const month = calendarDate.toDateString().slice(4, 7);
      const date = (calendarDate.getDate() <= 15 ? 15 : 30).toString();
      const year = calendarDate.getFullYear().toString();
      const dateCoverage = month + " " + date + " " + year;
      this.addReminder.transId = Math.floor(Math.random() * 100);
      const newCutOff = {
        dateCoverage: dateCoverage,
        income: this.incomeCutOff,
        transactions: [this.addReminder],
      };
      this.$store.commit("addCutOffData", newCutOff);
      this.addDialog = false;
    },
  },
};
</script>

<style scoped>
.main {
  justify-content: center;
}

.reset-div {
  margin: 0 10%;
  display: flex;
  justify-content: flex-end;
}

.calendar {
  margin-top: 10px;
  gap: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
}

.v-btn--fab.v-size--small {
  height: 30px;
  width: 30px;
}

.fill-height {
  justify-content: center;
  margin-top: -30px;
}

.transaction-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px !important;
}

.reminder-icon {
  color: red;
  display: flex;
  width: 100%;
  margin-top: 10px;
  justify-content: flex-end;
  position: relative;
  top: -50px;
}

.legend-div {
  color: gray;
  display: flex;
  justify-content: flex-end;
  margin: 10px 10%;
}

.legend-item {
  font-size: 12px;
  display: flex;
  padding: 5px;
  border-radius: 5px;
  background-color: white;
}

.reminder-list {
  margin: 30px 10%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.add-button {
  margin: -20px 0 30px 0;
  background-color: #253554;
  box-shadow: 2px 5px 20px #888888;
}

.v-card__title {
  justify-content: center;
}

.v-card__actions {
  justify-content: flex-end;
}
</style>
