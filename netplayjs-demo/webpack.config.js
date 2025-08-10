const path = require("path");
const { merge } = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const url = require("url");
const CopyPlugin = require("copy-webpack-plugin");

const EXAMPLES = [
  {
    chunkName: "somnia-pong",
    entry: "./src/examples/somnia-pong.ts",
    title: "Somnia Pong - Blockchain Gaming",
  },
];

const ENTRIES = {};
const PLUGINS = [];

const GITHUB_ROOT =
  "https://github.com/KrishMatrix/netplayjs-demo";

for (let example of EXAMPLES) {
  ENTRIES[example.chunkName] = example.entry;
  
  // Use custom template for somnia-pong
  const template = example.chunkName === "somnia-pong" ? "./src/somnia-pong.html" : "./src/example.html";
  
  PLUGINS.push(
    new HtmlWebpackPlugin({
      template: template,
      filename: example.chunkName + "/index.html",
      chunks: [example.chunkName],
      templateParameters: {
        title: example.title,
        githubURL: url.resolve(GITHUB_ROOT, example.entry),
      },
    })
  );
}

PLUGINS.push(
  new CopyPlugin({
    patterns: [{ from: "src/index.html", to: "index.html" }],
  }),
  new CopyPlugin({
    patterns: [{ from: "src/files/", to: "files" }],
  })
);

const common = {
  entry: ENTRIES,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: PLUGINS,
};

const development = {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    host: "local-ipv4",
    https: true,
  },
};

const production = {
  mode: "production",
  devtool: "source-map",
};

module.exports = (env) => {
  if (env.development) return merge(common, development);
  else if (env.production) return merge(common, production);
  else {
    throw new Error(`Unknown environment ${env}.`);
  }
};
