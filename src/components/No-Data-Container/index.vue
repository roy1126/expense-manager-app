<template>
  <div class="no-data-container">
    <img
      class="no-data-found"
      src="@/assets/no-data-found.png"
      alt="no-data-found-here"
    />
    <v-btn color="primary" fab @click="openAddDialog"
      ><v-icon>mdi-plus</v-icon>
    </v-btn>
    <span>or</span>
    <span
      >for testing purposes, get the sample json
      <v-btn
        color="primary"
        outlined
        small
        text
        :loading="isLoadingHere"
        :disabled="isLoadingHere"
        @click="clickHereHandler"
        >here
        <template v-slot:isLoadingHere>
          <span class="custom-loader">
            <v-icon light>mdi-cached</v-icon>
          </span>
        </template></v-btn
      >
    </span>

    <v-dialog v-model="addDialog" persistent max-width="600px">
      <v-card
        ><v-card-title style="justify-content: center">
          <span class="text-h5">Add Cut-Off Data</span>
        </v-card-title>
        <v-card-text>Choose cut-off date:</v-card-text>
        <v-card-text class="cut-offs-container"
          ><v-btn
            v-for="(el, index) in cutOffs"
            small
            elevation
            min-width="80px"
            :key="index"
            :outlined="el.isSelected"
            :color="el.isSelected ? 'primary' : null"
            :disabled="isDateDisabled(el.date)"
            @click="selectCutOffHandler(el)"
            >{{ el.date }}</v-btn
          >
          <v-text-field
            type="number"
            class="mt-3"
            label="Income(₱)"
            v-model="incomeForAll"
            :rules="rules"
            :disabled="!isAllCutOff"
            hide-details="auto"
            style="width: 20%"
          ></v-text-field
          ><v-checkbox v-model="isAllCutOff" label="all cutoffs"></v-checkbox>
        </v-card-text>

        <!-- START ... IF isAllCutOff is not checked -->
        <v-card-text v-if="!isAllCutOff" style="padding-bottom: 0"
          >Custom Income per Cut-Off:</v-card-text
        >
        <v-card-text v-if="!isAllCutOff">
          <div
            class="custom-income"
            v-for="(el, index) in selectedCutOffs"
            :key="index"
          >
            <span style="width: 100px; text-align: center">{{ el.date }}</span
            ><v-text-field
              v-model="el.income"
              type="number"
              :rules="rules"
            ></v-text-field>
          </div>
        </v-card-text>
        <!-- END ... IF isAllCutOff is not checked -->

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="closeAddDialog"> Close </v-btn>

          <v-btn
            text
            color="primary"
            :loading="isLoadingSave"
            :disabled="isLoadingSave"
            @click="saveDataHandler"
          >
            Save
            <template v-slot:isLoadingSave>
              <span class="custom-loader">
                <v-icon light>mdi-cached</v-icon>
              </span>
            </template>
          </v-btn>
        </v-card-actions></v-card
      ></v-dialog
    >

    <v-snackbar v-model="openSnackbar" light>
      {{ errorMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="openSnackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: "NoDataContainer",
  data() {
    return {
      cutOffs: [
        { date: "JAN 15", income: null, isSelected: false },
        { date: "JAN 30", income: null, isSelected: false },
        { date: "FEB 15", income: null, isSelected: false },
        { date: "FEB 30", income: null, isSelected: false },
        { date: "MAR 15", income: null, isSelected: false },
        { date: "MAR 30", income: null, isSelected: false },
        { date: "APR 15", income: null, isSelected: false },
        { date: "APR 30", income: null, isSelected: false },
        { date: "MAY 15", income: null, isSelected: false },
        { date: "MAY 30", income: null, isSelected: false },
        { date: "JUN 15", income: null, isSelected: false },
        { date: "JUN 30", income: null, isSelected: false },
        { date: "JULY 15", income: null, isSelected: false },
        { date: "JULY 30", income: null, isSelected: false },
        { date: "AUG 15", income: null, isSelected: false },
        { date: "AUG 30", income: null, isSelected: false },
        { date: "SEP 15", income: null, isSelected: false },
        { date: "SEP 30", income: null, isSelected: false },
        { date: "OCT 15", income: null, isSelected: false },
        { date: "OCT 30", income: null, isSelected: false },
        { date: "NOV 15", income: null, isSelected: false },
        { date: "NOV 30", income: null, isSelected: false },
        { date: "DEC 15", income: null, isSelected: false },
        { date: "DEC 30", income: null, isSelected: false },
      ],
      rules: [(value) => !!value || "Required."],
      incomeForAll: null,
      addDialog: false,
      isLoadingHere: false,
      isLoadingSave: false,
      isAllCutOff: true,
      openSnackbar: false,
      errorMessage: "Please fill up the required fields.",
    };
  },
  computed: {
    selectedCutOffs() {
      return this.cutOffs.filter((e) => e.isSelected === true);
    },
  },
  methods: {
    monthStringToNumber(str) {
      return new Date(`${str} 01 2000`).toLocaleDateString(`en`, {
        month: `2-digit`,
      });
    },
    selectCutOffHandler(value) {
      const index = this.cutOffs.findIndex((e) => e.date === value.date);
      this.cutOffs[index].isSelected = !this.cutOffs[index].isSelected;
    },
    isDateDisabled(date) {
      const month = this.monthStringToNumber(date.split(" ")[0].toLowerCase());
      const day = date.split(" ")[1];
      const year = new Date().getFullYear();
      const newDate = new Date(month + "-" + day + "-" + year);
      if (newDate > new Date()) return true;
      else return false;
    },
    saveDataHandler() {
      this.isLoadingSave = true;
      setTimeout(() => {
        this.isLoadingSave = false;
      }, 1000);
      let cutOffFiltered = this.cutOffs.filter((e) => e.isSelected === true);
      const emptyIncomeFound = cutOffFiltered.some((e) => e.income === null);
      if (
        cutOffFiltered.length === 0 ||
        (this.isAllCutOff && !this.incomeForAll)
      ) {
        this.openSnackbar = true;
        return;
      }
      if (!this.isAllCutOff && emptyIncomeFound) {
        this.openSnackbar = true;
        this.errorMessage =
          "Please fill up the income for each chosen cut-off date.";
        return;
      }
      cutOffFiltered.forEach((e, index) => {
        e.cutOffId = index;
        if (this.isAllCutOff) {
          e.income = this.incomeForAll;
        }
        e.dateCoverage = new Date(e.date + "," + new Date().getFullYear())
          .toDateString()
          .slice(4);
        e.transactions = [];
        delete e.date;
        delete e.isSelected;
      });
      cutOffFiltered = cutOffFiltered.sort(
        (a, b) => new Date(b.dateCoverage) - new Date(a.dateCoverage)
      );
      this.$store.commit("setData", cutOffFiltered);
      this.addDialog = false;
    },
    openAddDialog() {
      this.addDialog = true;
    },
    closeAddDialog() {
      this.addDialog = false;
    },
    clickHereHandler() {
      this.isLoadingHere = true;
      setTimeout(() => {
        this.isLoadingHere = false;
        this.$emit("getSampleJsonHandler");
      }, 2000);
    },
  },
};
</script>

<style scoped>
.no-data-container {
  display: flex;
  margin: 30px;
  gap: 20px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.no-data-container span {
  font-size: 12px;
}

.no-data-container v-btn {
}

.no-data-found {
  height: 70%;
  width: 70%;
  border-radius: 20px;
}

.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}

.cut-offs-container {
  gap: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.custom-income {
  display: flex;
  align-items: center;
  margin-top: 0;
}
</style>
