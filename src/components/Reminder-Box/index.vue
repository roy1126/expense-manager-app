<template>
  <v-row class="reminder-box" justify="space-between">
    <div class="reminder-label">
      <span class="reminder-date">{{
        getProperDate(Object.keys(reminder)[0])
      }}</span>
      <span class="reminder-countdown">{{
        getCountDownDay(Object.keys(reminder)[0])
      }}</span>
    </div>
    <div class="reminder-icons">
      <v-tooltip
        top
        v-for="(trans, index) in reminder[Object.keys(reminder)[0]]"
        :key="trans.id"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on">{{ trans.icon }}</v-icon>
        </template>
        <span>{{ trans.expenseName }}</span>
      </v-tooltip>
    </div>
  </v-row>
</template>

<script>
import { dateDiffInDays } from "@/utils/index";
export default {
  name: "ReminderBox",
  props: {
    reminder: {
      required: true,
      type: Object,
    },
  },
  methods: {
    getProperDate(date) {
      let newDate = new Date(date).toLocaleDateString("en-us", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      return newDate;
    },
    getCountDownDay(date) {
      const nowDate = new Date();
      const newDate = new Date(date);
      const dayDifference = dateDiffInDays(nowDate, newDate);
      if (dayDifference === 0) return "Today";
      const dayText = dayDifference === 1 ? "day" : "days";
      return dayDifference + " " + dayText + " to go";
    },
  },
};
</script>

<style scoped>
.reminder-box {
  width: 95%;
  color: black;
  padding: 10px 20px;
  display: flex;
  border-radius: 5px;
  align-items: center;
  align-content: center;
  background-color: white;
}

.reminder-label {
  display: flex;
  flex-direction: column;
}

.reminder-countdown {
  font-size: x-small;
  font-style: italic;
}

.reminder-box:first-child {
  width: 100%;
  color: orangered;
  background-color: #253554;
  box-shadow: 2px 1px 15px #616161;
}

.reminder-box:first-child .reminder-date {
  font-size: larger;
}

.reminder-box:first-child .reminder-countdown {
  font-size: smaller;
}

.reminder-box:first-child .theme--light.v-icon {
  color: white;
}

.reminder-icons {
  display: flex;
  gap: 10px;
  padding: 5px 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid orangered;
}
</style>
