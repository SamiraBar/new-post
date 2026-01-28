exports.config = {
  output: "./output",
  helpers: {
    Puppeteer: {
      url: "http://localhost:5183",
      show: process.env.HEADLESS !== 'true',
      windowSize: "1450x1080",
      chrome: {
        args: ["--start-fullscreen"],
      },
    },
  },
  include: {
    I: "./steps_file",
  },
  mocha: {},
  bootstrap: null,
  timeout: null,
  teardown: null,
  hooks: [],
  gherkin: {
    features: "./features/**/*.feature",
    steps: "./step_definitions/*/*.ts",
  },
  plugins: {
    screenshotOnFail: {
      enabled: true,
    },
    htmlReporter: {
      enabled: true,
    },
    retryFailedStep: {
      enabled: true,
    },
    eachElement: {
      enabled: true,
    },
    pauseOnFail: {},
  },
  stepTimeout: 0,
  stepTimeoutOverride: [
    {
      pattern: "wait.*",
      timeout: 0,
    },
    {
      pattern: "amOnPage",
      timeout: 0,
    },
  ],
  tests: "./*_test.ts",
  name: "tests",
};
