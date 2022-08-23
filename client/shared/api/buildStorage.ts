import 'regenerator-runtime/runtime'; // react-native-storage 需要, 确保其存在
import Storage, { NotFoundError } from 'react-native-storage';
import _isNil from 'lodash/isNil';
import _isUndefined from 'lodash/isUndefined';

/**
 * 构建一个存储对象
 */
export function buildStorage(backend: any) {
  const storage = new Storage({
    // 最大容量，默认值1000条数据循环存储
    size: 1000,

    // 存储引擎：对于RN使用AsyncStorage，对于web使用window.localStorage
    // 如果不指定则数据只会保存在内存中，重启后即丢失
    // storageBackend:
    //   config.platform === 'app'
    //     ? require('react-native').AsyncStorage
    //     : window.localStorage,
    storageBackend: backend,

    // 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
    defaultExpires: 1000 * 3600 * 24,

    // 读写时在内存中缓存数据。默认启用。
    enableCache: true,

    // 如果storage中没有相应数据，或数据已过期，
    // 则会调用相应的sync方法，无缝返回最新数据。
    // sync方法的具体说明会在后文提到
    // 你可以在构造函数这里就写好sync的方法
    // 或是在任何时候，直接对storage.sync进行赋值修改
    // 或是写到另一个文件里，这里require引入
    // sync: require('你可以另外写一个文件专门处理sync')
  });

  const rnStorage = {
    set: async (key: string, data: any) => {
      try {
        if (!!key && typeof key === 'string' && !_isUndefined(data)) {
          await storage.save({ key, data });
        }
      } catch (e) {
        console.error(e);
      }

      return data;
    },
    /**
     * 自定义过期时间的存储
     * set默认为1天，该方法自定义过期时间
     */
    setWithExpires: async (key: string, data: any, expires: number) => {
      try {
        if (!!key && typeof key === 'string' && !_isUndefined(data)) {
          await storage.save({ key, data, expires });
        }
      } catch (e) {
        console.error(e);
      }

      return data;
    },
    get: async (key: string, defaultVal?: any) => {
      let res: any;
      try {
        res = await storage.load({
          key,
          autoSync: true,
          syncInBackground: false,
        });
      } catch (e: any) {
        if (!(e instanceof NotFoundError)) {
          // 过滤NotFoundError
          console.log(`get key ${key} error:`, String(e));
        }

        res = _isNil(defaultVal) ? null : defaultVal;
      }
      return res;
    },
    remove: async (key: string) => {
      await storage.remove({ key });
    },
    /**
     * 持久化存储, 永不过期
     */
    save: async (key: string, data: any) => {
      try {
        if (!!key && typeof key === 'string' && !_isUndefined(data)) {
          await storage.save({
            key,
            data,
            expires: null,
          });
        }
      } catch (e) {
        console.error(e);
      }

      return data!;
    },
  };

  return rnStorage;
}
