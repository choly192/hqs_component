const inquirer = require("inquirer");

const Metalsmith = require("metalsmith");

const path = require("path");
const { existsSync } = require("fs");

const ncp = require("ncp").ncp;

const { render } = require("consolidate").handlebars;

const {
  loading,
  fetchRepoList,
  fetchBranchesList,
  downloadGithub
} = require("./utils");

module.exports = async function (name) {
  const { projectName } = await inquirer.prompt({
    // 问题类型 input 表示输入
    type: "input",
    // 答案的 key值
    name: "projectName",
    // 问题是什么
    message: "The project name is it?",
    // 默认值
    default: name
  });
  // const { license } = await inquirer.prompt({ // question.js
  //   // 问题的类型 ,list表示可以选择
  //   type: "list",
  //   // 答案的key
  //   name: "license",
  //   // 问题是什么
  //   message: "Choose a license",
  //   // 支持选择的选项
  //   choices: ["LGPL", "Mozilla", "GPL", "BSD", "MIT", "Apache"],
  //   // 默认值
  //   default: "MIT",
  // });

  // 获取仓库列表
  const repos = await loading(fetchRepoList)("choly192");

  // 选择仓库列表
  let { repoName } = await inquirer.prompt({
    type: "list",
    name: "repoName",
    message: "Choose a template",
    choices: repos
  });
  // 获取所有branches
  const branches = await loading(fetchBranchesList)("choly192", repoName);
  // 如果有多个分支，用户选择分支，没有多个分支可直接下载
  if (branches.length > 1) {
    const { checkout } = await inquirer.prompt({
      type: "list",
      name: "checkout",
      message: "Choose the target version",
      choices: branches
    });
    repoName += `#${checkout}`;
  } else {
    repoName += `#${branches[0]}`;
  }

  // 下载模板到临时目录
  const dest = await downloadGithub("choly192", repoName);
  // 判断下载的模板中是否包含question.js 如果包含则进行模板的替换，否则直接复制到目标仓库
  if (existsSync(path.join(dest, "question.js"))) {
    await new Promise((resolve, reject) => {
      Metalsmith(__dirname)
        .source(dest)
        .destination(path.resolve(projectName))
        .use(async (files, metal, done) => {
          // files 就是需要渲染的模板目录下的所有类型的文件
          // 加载question.js
          const questionList = require(path.join(dest, "question.js"));
          // 根据问题，定义交互问题
          const answers = await inquirer.prompt(questionList);
          // 当前answers 保存的是用户传递的数据，通过metal.metadata() 将其保存给下一个use使用
          const meta = metal.metadata();
          Object.assign(meta, answers, { projectName });
          // 删除question.js文件
          delete files("question.js");
          done();
        })
        .use((files, metal, done) => {
          // 获取上一个 use中存储的数据
          const preData = metal.metadata();

          // 将files中的所有自有属性制作为一个数据
          const arr = Reflect.ownKeys(files);
          // 通过遍历数组，将所有的 buffer 转换为字符串，然后通过模板引擎进行替换，最后转换为 buffer 存储即可
          arr.forEach(async (file) => {
            // 只对 js 或者 json 文件进行替换
            if (file.includes("js") || file.includes("json")) {
              let content = files[file].contents.toString();
              // 如果包含模板引擎语法就进行替换
              if (content.includes("{{")) {
                content = await render(content, preData);
                files[file].contents = Buffer.from(content);
              }
            }
          });
          done();
        })
        .build((err) => {
          err ? reject(err) : resolve();
        });
    });
    console.log("successful");
  } else {
    // 不需要模板进行处理的直接拷贝至项目目录
    ncp(dest, projectName);
  }
};
