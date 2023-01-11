<template>
  <div class="settings">
    <div class="text-center">
      <h1>Settings</h1>
    </div>
    <span class="title">PREFERENCES</span>
    <div class="options" @click="openLanguageDialog">
      <div>
        <v-icon>mdi-web</v-icon>
        <span>Language</span>
      </div>
      <div>
        <span>English</span>
        <v-icon>mdi-chevron-right</v-icon>
      </div>
    </div>
    <div class="options" @click="darkModeClickHandler">
      <div>
        <v-icon>mdi-weather-night</v-icon>
        <span>Dark Mode</span>
      </div>
      <v-switch v-model="darkMode" disabled></v-switch>
    </div>
    <span class="title">OTHER</span>
    <div class="options" @click="openAboutDialog">
      <div>
        <v-icon>mdi-information-outline</v-icon>
        <span>About</span>
      </div>
      <div>
        <v-icon>mdi-chevron-right</v-icon>
      </div>
    </div>
    <!-- <div class="options" @click="openTermsAndConDialog">
      <div>
        <v-icon>mdi-checkbox-marked-circle-outline</v-icon>
        <span>Terms and Condition</span>
      </div>
      <div>
        <v-icon>mdi-chevron-right</v-icon>
      </div>
    </div> -->

    <div class="options" @click="openFeedbackDialog">
      <div>
        <v-icon>mdi-message-text-outline</v-icon>
        <span>Feedback</span>
      </div>
      <div>
        <v-icon>mdi-chevron-right</v-icon>
      </div>
    </div>
    <div class="options" @click="openContactDialog">
      <div>
        <v-icon>mdi-phone-message-outline</v-icon>
        <span>Contact developer</span>
      </div>
      <div>
        <v-icon>mdi-chevron-right</v-icon>
      </div>
    </div>
    <div class="options" @click="openLogoutDialog">
      <div>
        <v-icon color="red">mdi-logout-variant</v-icon>
        <span>Logout</span>
      </div>
      <div>
        <v-icon>mdi-chevron-right</v-icon>
      </div>
    </div>

    <!-- LANGUAGE-->
    <v-dialog v-model="languageDialog" scrollable max-width="400px">
      <v-card>
        <v-card-title>Select Language</v-card-title>
        <v-card-text style="height: 300px">
          <v-radio-group v-model="language" column>
            <v-radio
              v-for="lang in languages"
              :key="lang.value"
              :label="lang.label"
              :value="lang.value"
            ></v-radio>
          </v-radio-group>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="languageDialog = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="languageClickHandler">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ABOUT-->
    <v-dialog v-model="aboutDialog" scrollable max-width="600px">
      <v-card>
        <v-card-title center>About</v-card-title>
        <v-card-text style="display: flex; flex-direction: column">
          <span style="margin-bottom: 10px"
            >Expense Manager App is a mobile friendly web application which
            designed to monitor the expenses of the user. It has 3 pages:</span
          >
          <span
            >1. Profile - is where to see the actual expense of the user per
            cut-off</span
          >
          <span> 2. Monthly - monitor expenses on monthly average</span>
          <span>
            3. Calendar - let's the user see the upcoming and scheduled future
            transactions or reminder expenses</span
          >
          <div style="margin-top: 20px">
            <v-icon small>mdi-information</v-icon>
            <span style="font-size: smaller"
              >Find out more of my mini projects
              <a
                href="https://tinyurl.com/roy-portfolio"
                alt="https://tinyurl.com/roy-portfolio"
                >here</a
              >
              (under Projects).
            </span>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="aboutClickHandler">
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- TERMS AND CONDITION
    <v-dialog v-model="termsAndConDialog" scrollable max-width="600px">
      <v-card>
        <v-card-title center>Terms and Condition</v-card-title>
        <v-card-text style="height: 300px">
          terms and condition here...
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="termsAndConHandler">
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->

    <!-- CONTACT -->
    <v-dialog v-model="contactDialog" scrollable max-width="500px">
      <v-card>
        <v-card-title center>Contact</v-card-title>
        <v-card-text style="display: flex; flex-direction: column">
          <span>Want to connect?</span>
          <div>
            <span
              >email: <strong>{{ email }}</strong></span
            >
          </div>
          <div>
            <span
              >contact no: <strong>{{ contactNumber }}</strong></span
            >
          </div>
          <div class="contacts-button">
            <v-btn
              rounded
              color="secondary"
              v-for="contact in contacts"
              :key="contact.label"
              :href="contact.link"
              >{{ contact.label }}</v-btn
            >
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="contactClickHandler">
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- FEEDBACK -->
    <v-dialog v-model="feedbackDialog" persistent scrollable max-width="600px">
      <v-card>
        <v-card-title center>Feedback</v-card-title>
        <v-card-text style="display: flex; flex-direction: column; gap: 10px">
          <span> I'd love to hear your feedback! </span>
          <v-text-field label="Subject" outlined></v-text-field>
          <v-textarea
            outlined
            no-resize
            rows="4"
            row-height="10"
            style="margin-top: -20px"
          ></v-textarea>
          <em style="font-size: small"
            ><strong>Note:</strong> This message will send as email directly to
            my email (royabanilla@gmail.com).</em
          >
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="feedbackDialog = false">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="feedbackHandler">
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- LOGOUT -->
    <v-dialog v-model="logoutDialog" scrollable max-width="400px">
      <v-card>
        <v-card-title center>Logout</v-card-title>
        <v-card-text style="height: 50px">
          Are you sure you want to logout now ?
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="logoutDialog = false">
            Cancel
          </v-btn>
          <v-btn color="blue darken-1" text @click="logoutHandler">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "Settings",
  data() {
    return {
      darkMode: false,
      languageDialog: false,
      aboutDialog: false,
      contactDialog: false,
      termsAndConDialog: false,
      feedbackDialog: false,
      logoutDialog: false,
      contactNumber: "+639285981164",
      email: "royabanilla@gmail.com",
      contacts: [
        { label: "LinkedIn", link: "https://linkedin.com/in/royabanilla" },
        { label: "Facebook", link: "https://facebook.com/roy.abanilla" },
        { label: "Github", link: "https://github.com/roy1126" },
      ],
    };
  },
  watch: {
    darkMode(value) {
      document
        .querySelectorAll(".theme--light.v-icon")
        .forEach((a) => (a.style.color = value ? "white" : "#0000008a"));
    },
  },
  mounted() {
    this.darkMode = this.$store.getters.getSettings.darkMode;
  },
  computed: {
    language() {
      return this.$store.getters.getSettings.language;
    },
    languages() {
      let arr = [
        {
          label: "English",
          value: "english",
        },
      ];
      return arr;
    },
  },
  methods: {
    languageClickHandler() {
      this.languageDialog = false;
    },
    darkModeClickHandler() {
      this.$store.commit("setDarkMode");
      this.darkMode = !this.darkMode;
    },
    aboutClickHandler() {
      this.aboutDialog = false;
    },
    contactClickHandler() {
      this.contactDialog = false;
    },
    termsAndConHandler() {
      this.termsAndConDialog = false;
    },
    feedbackHandler() {
      this.feedbackDialog = false;
    },
    logoutHandler() {
      this.logoutDialog = false;
    },
    openLanguageDialog() {
      this.languageDialog = true;
    },
    openAboutDialog() {
      this.aboutDialog = true;
    },
    openContactDialog() {
      this.contactDialog = true;
    },
    openTermsAndConDialog() {
      this.termsAndConDialog = true;
    },
    openFeedbackDialog() {
      this.feedbackDialog = true;
    },
    openLogoutDialog() {
      this.logoutDialog = true;
    },
  },
};
</script>

<style scoped>
.settings {
  align-content: center;
  margin: 0 5%;
}

.title {
  margin: 20px 0;
  padding: 5px 10px;
  font-size: small !important;
  display: flex;
  font-weight: 300;
  border-radius: 5px;
  color: white;
  background-color: gray;
}

.options {
  width: 100%;
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.options div {
  display: flex;
}

.v-card__title {
  justify-content: center;
}

.v-icon {
  margin: 0 10px;
}

.v-card__actions {
  justify-content: flex-end;
}
.contacts-button {
  gap: 10px;
  display: flex;
  margin-top: 20px;
  justify-content: center;
}
.v-input__control .v-input__slot {
  color: white !important;
}
</style>
