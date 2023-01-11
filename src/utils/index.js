const mainColors = [
  "#1abc9c",
  "#fc8c84",
  "#c1301c",
  "#fcd444",
  "#cc99c9",
  "#feb144",
];

function getRandomColor() {
  let R = Math.floor(Math.random() * 127 + 127);
  let G = Math.floor(Math.random() * 127 + 100);
  let B = Math.floor(Math.random() * 127 + 100);
  let rgb = (R << 16) + (G << 8) + B;
  return `#${rgb.toString(16)}`;
}

export function getColors(len) {
  let colors = [];
  for (let i = 0; i < len; i++) {
    colors.push(getRandomColor());
    // if (i < mainColors.length) {
    //   colors.push(mainColors[i]);
    // } else {
    //   colors.push(mainColors[i - mainColors.length]);
    // }
  }
  return colors;
}

export const expensesEnums = [
  {
    id: "savings",
    label: "Savings",
    icon: "mdi-piggy-bank-outline",
  },
  {
    id: "shopping",
    label: "Shopping",
    icon: "mdi-shopping",
  },
  {
    id: "transpo",
    label: "Transportation",
    icon: "mdi-car",
  },
  {
    id: "bills",
    label: "Bills",
    icon: "mdi-file-document-multiple-outline",
  },
  {
    id: "food",
    label: "Food",
    icon: "mdi-food",
  },
  {
    id: "rent",
    label: "Rent",
    icon: "mdi-home-outline",
  },
  {
    id: "wifi",
    label: "Wifi",
    icon: "mdi-wifi",
  },
  {
    id: "insurance",
    label: "Insurance",
    icon: "mdi-shield-plus-outline",
  },
  {
    id: "mobile-load",
    label: "Mobile Load",
    icon: "mdi-cellphone-wireless",
  },
  {
    id: "others",
    label: "Others",
    icon: "mdi-shuffle-variant",
  },
];

export function dateDiffInDays(a, b) {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

export function getDateString(date) {
  const year = new Date(date).getFullYear();
  let month = new Date(date).getMonth() + 1;
  let day =
    new Date(date).getDate() < 10
      ? "0" + new Date(date).getDate()
      : new Date(date).getDate();

  if (String(Math.abs(month)).charAt(0) == month) {
    month = "0" + month;
  }
  const newDate = year + "-" + month + "-" + day;
  return newDate;
}
