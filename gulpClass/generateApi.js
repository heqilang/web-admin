


const fetch = require('node-fetch');
var fs = require('fs');
var path = require('path');
const colors = require('colors');

var GenerateUtil = require('heqilang/generateUtil.js');
const TypeEnum = {
  String: 'string',
  string: 'string',
  Boolean: 'boolean',
  boolean: 'boolean',
  Chart: 'string',
  char: 'string',
  Character: 'string',
  character: 'string',
  Integer: 'number',
  integer: 'number',
  Int: 'number',
  int: 'number',
  Long: 'number',
  long: 'number',
  Short: 'number',
  short: 'number',
  Double: 'number',
  double: 'number',
  Number: 'number',
  number: 'number',
  Date: 'Date',
  date: 'Date',
  DateTime: 'Date',
  datetime: 'Date',
  Object: 'any',
  object: 'any',
  Blob: 'string',
  blob: 'string',
  'byte[]': 'string',
  binary: 'File'
};

class Generate {
  constructor(entityPath, apiPath, modules) {

    this.entityPath = entityPath;
    this.apiPath = apiPath;
    this.modules = modules;
    this.pathModules = [];
  }

  async fetchModules() {
    if (Array.isArray(this.modules)) {
      const task = [];
      for (const item of this.modules) {
        task.push(
          fetch(item.path, {
            method: 'get',
            headers: { 'Content-Type': 'application/json' }
          }).catch(err => {
            console.log(colors.red(`fetch module【${item.name}】 error:`));
            console.error(err);
            return;
          })
        );
      }
      const promiseList = await Promise.all(task);
      return promiseList;
    }
  }
  async createEntity(module, list = {}) {
    console.log(colors.blue('scan entity in:'), module.description);
    const arr = Object.entries(list);
    let entityContent = '';
    const success = [];
    const fail = [];
    for (const item of arr) {
      const name = item[0];
      const value = item[1];
      try {
        if (value.type === 'object') {
          const type = this.formateType(value.properties);
          const description = value.description;
          const entity = (description ? `/** ${description} */\n` : '') + `export type ${name} = {\n${type}};\n`;

          entityContent += entity;
        }
        success.push(name);
        console.log(colors.blue('  create entity:'), colors.green(name));
      } catch (error) {
        fail.push(name);
        console.log(colors.blue('  create entity:'), colors.red(name));
        console.error(error);
      }
    }
    const fileName = module.name;
    this.writeFile(path.join(this.entityPath, `${fileName}.d.ts`), entityContent);
    console.log(colors.green('success:' + success.length), colors.red('fail:' + fail.length), '\n');
  }

  formateType(properties) {
    if (!properties) {
      return `  [K: string]: any;\n`;
    }
    const arr = Object.entries(properties);
    let strArr = '';

    for (const item of arr) {
      const str = this.formateEnumType(item);
      strArr += str;
    }

    return strArr;
  }
  formateEnumType(enumType) {
    const key = enumType[0];
    const value = enumType[1];
    const description = value.description;

    let { nextType } = this.fomateEntity(value);
    let type = nextType;
    if (value.type === 'array') {
      const { nextType } = this.fomateEntity(value.items);
      type = nextType + '[]';
    }

    const str = (description ? `  /** ${description} */\n` : '') + `  ${key}?: ${type};\n`;
    return str;
  }

  fomateEntity(value) {
    const { $ref, type, format } = value;
    let nextType;
    let isImport = false;
    if ($ref) {
      const res = GenerateUtil.getLastName($ref);
      nextType = res ?? 'any';
      isImport = true;
    } else {
      nextType = TypeEnum[type] ?? 'any';
    }
    if (format === 'binary') {
      nextType = TypeEnum[format] ?? 'any';
    }
    return { nextType, isImport };
  }

  async createApi(module, list = {}) {
    // 根据tag归类
    const map = this.filterTag(list);
    console.log(colors.blue('scan api in:'), module.description);
    const keys = map.keys();
    for (let key of keys) {
      const collect = map.get(key);
      // 确定每个tag类的模块名
      const fileName = GenerateUtil.filterName(Object.keys(collect)) ?? 'unknown';

      const arr = Object.entries(collect);
      const ast = new Map();
      this.apiNameList = [];
      for (const item of arr) {
        const data = this.createApiModule(item, module);
        if (!data) continue;
        const key = item[0];

        const collect = ast.get(fileName) ?? {};
        data.fileName = fileName;
        collect[key] = data;
        ast.set(fileName, collect);
        // this.writeFile(`src/test/${fileName}Ast.json`, JSON.stringify(collect));
      }
      this.analysisAst(ast, module);
    }
  }

  /**
   * 将paths归类，根据归类创建api目录
   * 例如 {a/b/c:{tags:[1]},a/b/f:{tags:[1]},a/d:{tags:[2]},a/b/d:{tags:[3]}} => {a/b:{a/b/c:{tags:[1]},a/b/f:{tags:[1]}, a/b/d:{tags:[3]}}, a:{a/d:{tags:[2]}}}
   * 第一步根据tag归类，再根据path路径合并相同路径
   * @param {*} list
   * @returns
   */
  filterTag(list) {
    const map = new Map();

    const arr = Object.entries(list);
    // tag筛选
    for (const item of arr) {
      const key = item[0];
      const value = item[1];

      const methods = Object.keys(value);
      for (const method of methods) {
        const content = value[method];
        // 请求源路径
        content.originPath = key;
        // 请求方法
        content.method = method;
        // 请求基础路径
        const baseUrl = GenerateUtil.getPath(key);
        content.baseUrl = baseUrl;

        // 相同请求路径，多个不同请求方法特殊处理。将基础路径最后一位替换实际url
        const newKey = content.operationId ? baseUrl.replace(/(?<=\/)(?:.(?!\/))*$/, content.operationId) : baseUrl;
        content.operationIdPath = newKey;
        content.useOperationId = methods.length > 1;

        const tag = content.tags[0];
        content.tag = tag;

        const collect = map.get(tag) ?? {};
        collect[newKey] = content;
        map.set(tag, collect);
      }
    }

    // 根据path路径合并相同路径
    const keys = map.keys();
    const filterMap = new Map();
    const allCommonPrefix = [];
    for (const key of keys) {
      const collect = map.get(key);

      const tagCommonStr = GenerateUtil.longestCommonPrefix(Object.keys(collect));
      if (allCommonPrefix.includes(tagCommonStr)) {
        const old = filterMap.get(tagCommonStr);
        filterMap.set(tagCommonStr, { ...old, ...collect });
      } else {
        filterMap.set(tagCommonStr, collect);
        allCommonPrefix.push(tagCommonStr);
      }
    }
    return filterMap;
  }

  /** 分析单个api模块 */
  createApiModule(apiModule, module) {
    const key = apiModule[0];
    const value = apiModule[1];
    try {
      // 方法名
      const apiName = this.getApiName(value);
      // 接口描述
      const description = value.summary;

      const data = this.handleParameters(value.parameters);
      const body = this.handleRequestBody(value.requestBody);
      data.body = data.body.concat(body.requestBody);
      const response = this.handleResponses(value.responses);

      return {
        baseUrl: value.baseUrl,
        contentType: body.contentType,
        method: value.method.toUpperCase(),
        apiName,
        description,
        body: data.body,
        query: data.query,
        path: data.path,
        response,
        module,
        tag: value.tags[0]
      };
    } catch (error) {
      console.error(key, error);
    }
  }

  /** 分析ast */
  analysisAst(ast, module) {
    const keys = ast.keys();
    for (const key of keys) {
      this.importList = [];
      const apiList = [];
      const value = ast.get(key);

      for (const item of Object.values(value)) {
        try {
          const description = item.description ? `/** ${item.description} */\n` : '';

          const pathStr = this.changePathToStr(item.path).join(', ');
          const queryStr = this.changeQueryToStr(item.query);
          const { bodyStr, contentType, bodyName } = this.changeBodyToStr(item.body);
          let contentTypeStr;
          if (contentType === 'multipart/form-data' || item.contentType === 'multipart/form-data') {
            contentTypeStr = `, { contentType: '${contentType}' }`;
          }

          const { responseEntity, isImport } = item.response || {};
          if (isImport) {
            this.importList.push(responseEntity);
          }

          let api = `\n${description}export function ${item.apiName}(${bodyStr ? bodyStr + (pathStr || queryStr ? ', ' : '') : ''
            }${queryStr ? queryStr + (pathStr ? ', ' : '') : ''}${pathStr ?? ''}): Promise<${responseEntity || 'any'
            }> {\n  return ${item.module.importApi}.connect("${item.method}", \`${item.baseUrl}${item.path.length > 0 ? '/' : ''
            }${item.path.map(it => '${' + it.name + '}').join('/')}\`${bodyName || queryStr || contentTypeStr ? ',' : ''
            } ${bodyName ? bodyName : queryStr || contentTypeStr ? 'undefined' : ''}${queryStr || contentTypeStr ? ',' : ''
            } ${queryStr ? 'query' : ''}${!queryStr && contentTypeStr ? undefined + ',' : ''} ${contentTypeStr || ''
            })\n}`;

          api = api.replace(/\s*(?=\))\)/g, ')');

          apiList.push(api);

          console.log(
            colors.blue('  create api:'),
            colors.green(item.apiName),
            ''.padEnd(28 - item.apiName.length, '-'),
            item.baseUrl
          );
        } catch (error) {
          console.log(
            colors.blue('  create api:'),
            colors.red(item.apiName),
            ''.padEnd(28 - item.apiName.length, '-'),
            item.baseUrl
          );
          console.error(error);
        }
      }

      let filterList = this.importList.map(it => {
        const result = it.replace('[]', '');
        return result;
      });
      // filterList数组去重
      filterList = Array.from(new Set(filterList));

      const importEntity =
        filterList.length > 0
          ? `import { ${filterList.join(',')} } from "${this.entityPath.replace('src', '@')}/${module.name}"`
          : '';
      const importApi = `import { ${module.importApi} } from "${module.importEntity.replace('src', '@')}"`;
      const content = `${importApi}\n${importEntity}\n${apiList.join('\n')}`;
      this.writeFile(`src/api/${module.name}/${key}Api.ts`, content);
    }
  }

  /** 处理参数，归类到path/query/body */
  handleParameters(list = []) {
    const query = [];
    const body = [];
    const path = [];
    for (let it of list) {
      it.schema = { type: it.type, ...it.schema };
      let type = it.type || it.schema.type || 'any';
      let requirImport = false;
      if (type === 'array') {
        const res = this.fomateEntity(it.items || it.schema?.items || {});
        type = (res.nextType ?? 'any') + '[]';
        requirImport = res.isImport;
      } else {
        let { nextType, isImport } = this.fomateEntity(it.schema);
        type = nextType;
        requirImport = isImport;
      }
      it.type = type;
      it.isImport = requirImport;

      if (it.in === 'body') {
        body.push(it);
      }
      if (it.in === 'query') {
        query.push(it);
      }
      if (it.in === 'path') {
        path.push(it);
      }
    }
    return { query, body, path };
  }

  /**
   * 处理请求body参数
   * 最后将与handleParameters中的body合并形成完整的body参数
   */
  handleRequestBody(body) {
    if (!body) return { requestBody: [] };
    const bodyContent = body.content;
    const arr = Object.entries(bodyContent)[0];
    const contentType = arr[0];
    const { type, properties, items, $ref } = arr[1].schema;
    if ($ref) {
      const { isImport, nextType } = this.fomateEntity(arr[1].schema);
      return {
        requestBody: [{ name: 'data', type: nextType, isImport }]
      };
    } else if (type === 'array') {
      const { nextType, isImport } = this.fomateEntity(items);
      return {
        requestBody: [{ name: 'arr', type: `${nextType}[]`, isImport }]
      };
    } else if (type === 'object') {
      const list = Object.entries(properties).map(([key, value]) => {
        const { nextType, isImport } = this.fomateEntity(value);
        return { name: key, type: nextType, isImport };
      });
      return { contentType, requestBody: list };
    }
  }

  /** 处理响应结果 */
  handleResponses(responses) {
    try {
      const content = responses[200].content;
      if (!content) return;
      const arr = Object.entries(content)[0];
      const responseContentType = arr[0];
      const { nextType, isImport } = this.fomateEntity(arr[1].schema);
      const responseEntity = nextType;
      return { responseContentType, responseEntity, isImport };
    } catch (error) {
      return {
        responseContentType: '*/*',
        responseEntity: 'any',
        isImport: false
      };
    }
  }

  /**
   * 分析body列表生成body名、body类型、body数据格式
   * @param {Array<any>} bodyList
   * @returns
   */
  changeBodyToStr(bodyList = []) {
    let contentType;
    // body参数类型
    let bodyStr;
    // body参数名
    let bodyName;
    // body参数列表
    let typeString = [];

    if (bodyList.length === 0 || !Array.isArray(bodyList)) {
      return { contentType, bodyStr, bodyName };
    }
    // 将body列表转换为类型字符串列表，若其中有File类型，将content-type设置为form-data格式
    for (const body of bodyList) {
      const { name, type, isImport } = body;
      if (type === 'File') {
        contentType = 'multipart/form-data';
      }
      if (isImport) {
        this.importList.push(type);
      }
      typeString.push(`${name}?: ${type}`);
    }
    // 若body类型有多个或者是form-data格式，将body合并为一个对象，固定参数名为`body`。
    // 若body类型仅有一个且不是form-data格式，则将类型名作为参数名。
    if (typeString.length > 1 || contentType === 'multipart/form-data') {
      bodyStr = typeString.length > 0 ? `body: { ${typeString.join('; ')} }` : undefined;
      bodyName = typeString.length > 0 ? 'body' : undefined;
    } else {
      const body = bodyList[0];
      const { name, type, isImport } = body;

      if (isImport) {
        this.importList.push(type);
      }
      bodyName = name;
      bodyStr = `${name}?: ${type}`;
    }
    return { contentType, bodyStr, bodyName };
  }

  /** 生成路径参数 */
  changePathToStr(path) {
    let pathStr = [];
    for (const item of path) {
      pathStr.push(`${item.name}?: ${item.type}`);
    }
    return pathStr;
  }

  /** 生成query查询参数 */
  changeQueryToStr(query) {
    if (query.length === 0) {
      return '';
    }
    let type = this.changePathToStr(query);
    type = `{ ${type.join('; ')} }`;
    return `query?: ${type}`;
  }

  /** 获取api方法名 */
  getApiName(value) {
    let baseUrl = value.baseUrl;
    // 相同请求路径，不同请求方法，使用operationId作为方法名
    // 否则使用请求路径最后一个/后的字符串作为方法名
    // 若方法名为delete/import等保留字,或者方法名已存在，获取倒数第二个/与最后一个/间的字符串作为api扩展名，并与方法名拼接
    if (value.useOperationId) {
      baseUrl = value.operationIdPath;
    }
    let apiName = GenerateUtil.getLastName(baseUrl);
    let ext = GenerateUtil.getLastName(baseUrl.split(apiName)[0]) ?? apiName;
    ext = ext.charAt(0).toUpperCase() + ext.slice(1);
    if (['delete', 'import', 'export', 'get', 'list', 'page', 'update', 'insert'].includes(apiName)) {
      apiName = apiName + ext;
    }

    if (this.apiNameList.includes(apiName)) {
      apiName = apiName + ext;
    }
    apiName = apiName.replace(/-/g, '_');
    this.apiNameList.push(apiName);
    return apiName;
  }

  async start() {
    this.cleanAll();
    const promiseList = await this.fetchModules(this.modules);
    for (const res of promiseList) {
      if (!res) continue;
      const url = res.url;

      const module = this.modules.find(item => decodeURI(item.path) === decodeURI(url));
      this.pathModules.push(module);
      const json = await res.json();
      this.createEntity(module, json.components?.schemas || json.definitions);
      this.createApi(module, json?.paths);
    }
  }
  cleanAll() {
    for (const item of this.pathModules) {
      const entityPath = path.join(this.entityPath, item.name);
      const apiPath = path.join(this.apiPath, item.name);
      this.clean(entityPath);
      this.clean(apiPath);
    }
  }
  clean(pathLike) {
    if (!fs.existsSync(pathLike)) return;
    const files = fs.readdirSync(pathLike);
    for (const file of files) {
      const filePath = path.join(pathLike, file);
      fs.rmSync(filePath, { recursive: true, force: true });
    }
  }
  writeFile(pathLike, content) {

    if (!fs.existsSync(pathLike)) {
      fs.mkdirSync(path.dirname(pathLike), { recursive: true });
    }
    fs.writeFileSync(pathLike, content, 'utf-8');
  }
}



module.exports = Generate;
