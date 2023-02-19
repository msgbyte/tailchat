/**
 * document: https://commitlint.js.org/#/reference-configuration
 *
 * https://github.com/angular/angular/blob/master/CONTRIBUTING.md#type
 * feat：new feature 新功能（feature）
 * fix：bug fix 修补bug
 * docs：document 文档（documentation）
 * style：style(Changes that do not affect code execution) 格式（不影响代码运行的变动）
 * refactor：Refactoring (i.e., code changes that are not new features or bug fixes) 重构（即不是新增功能，也不是修改bug的代码变动）
 * perf：performance optimization 性能优化
 * test：add test case 增加测试
 * chore：Changes to the build process or accessibility tools 构建过程或辅助工具的变动
 */

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-case': [0],
  },
};
