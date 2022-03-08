/**
 * 获取指定用户的仓库列表
 * `https://api.github.com/users/${username}/repos`
 */

/**
 * 获取指定仓库的分支列表
 * `https://api.github.com/repos/${username}/${repositoriesName}/branches`
 */
const { default: axios } = require("axios");
const { existsSync } = require("fs");
const ora = require("ora");
const path = require("path");
const { promisify } = require("util");
const download = promisify(require("download-git-repo")); // 通过Node.js提供promisify()方法将download-git-repo库提供的方法转换为Promise

/**
 * @description: 获取仓库列表
 * @param {string} username ：被获取的用户名
 * @returns {Array} 仓库列表
 */
async function fetchRepoList(username) {
  const { data } = await axios.get(
    `https://api.github.com/users/${username}/repos`
  );
  console.log(data);
  return data.map((item) => item.name);
}

/**
 * @description: 获取仓库的分支列表
 * @param {string} username 被获取的用户名称
 * @param {string} repoName 仓库名称
 * @returns {Array} 分支列表
 */
async function fetchBranchesList(username, repoName) {
  const { data } = await axios.get(
    `https://api.github.com/repos/${username}/${repoName}/branches`
  );
  return data.map((item) => item.name);
}

function loading(callback) {
  return async function (...args) {
    const spinner = ora("start...").start();
    try {
      const res = await callback(...args);
      spinner.succeed("Successful");
      return res;
    } catch (error) {
      spinner.fail("fail");
      return error;
    }
  };
}

/**
 * @description: 下载仓库中的具体内容
 * @param {string} username 仓库拥有者的名称
 * @param {stirng } repoName 仓库名称 + 分支名称， # 号拼接
 * @returns {string} 下载的临时目录
 */
async function downloadGithub(username, repoName) {
  const cacheDir = `${
    process.env[process.platform === "win32" ? "USERPROFILE" : "HOME"]
  }/.tmp`;
  // 拼接一个下载后的目录
  let dest = path.join(cacheDir, repoName);
  // fs 模块提供的 existsSync 方法用于判断目录是否存在，如果存在说明无需下载
  const flag = existsSync(dest);
  const url = `${username}/${repoName}`;
  if (!flag) {
    // 需要下载则执行下载
    await loading(download)(url, dest);
  }
  return dest;
}

module.exports = { fetchRepoList, fetchBranchesList, loading, downloadGithub };
