const CONSTANTS = {
  FUNDING_TARGET: 55000.00,
  FUNDING_CURRENCY: "USD",
  CURRENCY_RATE: 360,
  FUNDING_END_DATE: new Date("January 15, 2020"),
  TWITTER_USERNAME: "conzultrix",
  TWITTER_TWEET: "I just supported Conzultrix Impact, you too can contribute to developing women and children in STEM.",
  days_left: function() {
      return Math.max(Math.ceil((this.FUNDING_END_DATE - new Date()) / (1000*60*60*24)), 0);
  }
};

module.exports = CONSTANTS;
