const CopyPlugin = require("copy-webpack-plugin");

// copy plugin is not doing anything atm
module.exports = {
  webpack: {
    plugins: {
      add: [
        new CopyPlugin({
          patterns: [
            { from: "./src/service-worker.js", to: "service-worker.js" },
            { from: "./src/serviceWorkerRegistration", to: "serviceWorkerRegistration" },
          ]
        })
      ]
    }
  },
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
}