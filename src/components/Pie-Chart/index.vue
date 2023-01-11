<template>
  <apex-chart
    type="donut"
    :options="chartOptions"
    :series="series"
  ></apex-chart>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
export default {
  name: "PieChart",
  components: { "apex-chart": VueApexCharts },
  props: {
    values: {
      required: true,
      type: Array,
    },
    legendLabels: {
      required: true,
      type: Array,
    },
    colors: {
      type: Array,
    },
  },
  data() {
    return {
      series: this.values,
      chartOptions: {
        colors: this.colors || [],
        labels: this.legendLabels,
        legend: {
          position: "bottom",
        },
        plotOptions: {
          pie: {
            customScale: 0.8,
            donut: {
              labels: {
                show: true,
                value: {
                  show: true,
                  offsetY: 30,
                  fontSize: "50px",
                  color: this.darkModeStyle(),
                  fontWeight: "bold",
                  formatter: function (val) {
                    return "₱" + val;
                  },
                },
                total: {
                  show: true,
                  label: "Total",
                  color: this.darkModeStyle(),
                  fontSize: "30px",
                  fontWeight: "bold",
                  formatter: function (w) {
                    return (
                      "₱" +
                      w.globals.seriesTotals.reduce((a, b) => {
                        return a + b;
                      }, 0)
                    );
                  },
                },
              },
            },
          },
          bar: {
            distributed: false,
          },
        },
        chart: {
          type: "donut",
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
      },
    };
  },
  methods: {
    darkModeStyle() {
      const darkMode = this.$store.getters.getSettings.darkMode;
      return darkMode ? "#ffffff" : "#373d3f";
    },
  },
};
</script>

<style>
.apexcharts-legend-text {
  color: gray !important;
}
</style>
