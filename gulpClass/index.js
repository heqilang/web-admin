



const Generate = require('heqilang/generateApi')
/*
 # name          api创建目录
# path          swagger文档地址
# description   模块说明
# importApi     api连接实例
# importEntity  api连接实例导入目录
*/
/* const modules = [
  {
    path: 'http://10.150.2.13:7000/minio/swagger/v1/swagger.json',
    description: '文件上传',
    importApi: 'MINIO_API',
    importEntity: 'src/utils/api/index'
  },
  {
    path: 'http://10.150.2.13:7000/sys/v3/api-docs',
    description: '系统管理',
    importApi: 'SYS_API',
    importEntity: 'src/utils/api/index'
  },
] */


/*
* task - 调用函数生成Api.
* @param {string} tsType - 生成TS类型文档地址
* @param {string} jsApi - 生成API类型文档地址
* @param {Array} modules - 基础一些配置
*/
const task = (tsType, jsApi, modules) => {

  new Generate(tsType, jsApi, modules).start();

}
module.exports = task
