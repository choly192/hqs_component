#! /usr/bin/env node

const { program } = require("commander");
const { version } = require("../package.json");

const createProject = require("../lib");

// command()方法参数 --> 必选参数：尖括号  可选参数： 方括号 可变参数： <dirs...> 放在最后
program
  // 定义命令
  .command("create")
  // 定义别名
  .alias("crt")
  // 定义参数
  .argument("<projectName>")
  // 定义命令处理方法
  .action((projectName) => {
    // 处理函数
    createProject(projectName);
  });

program.version(version).parse();
