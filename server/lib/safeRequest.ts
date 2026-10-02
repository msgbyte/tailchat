import dns from 'dns';
import { BlockList, isIP } from 'net';
import type { Options } from 'got';

/**
 * 服务端代用户发起请求时不允许访问的地址段
 * 回环、内网、链路本地(含云厂商元数据服务)、运营商级NAT、组播与保留地址
 */
const blockList = new BlockList();
(
  [
    ['0.0.0.0', 8],
    ['10.0.0.0', 8],
    ['100.64.0.0', 10],
    ['127.0.0.0', 8],
    ['169.254.0.0', 16],
    ['172.16.0.0', 12],
    ['192.0.0.0', 24],
    ['192.168.0.0', 16],
    ['198.18.0.0', 15],
    ['224.0.0.0', 3],
  ] as const
).forEach(([net, prefix]) => blockList.addSubnet(net, prefix, 'ipv4'));
(
  [
    ['::', 127],
    ['64:ff9b::', 96],
    ['fc00::', 7],
    ['fe80::', 10],
    ['ff00::', 8],
  ] as const
).forEach(([net, prefix]) => blockList.addSubnet(net, prefix, 'ipv6'));

/**
 * 是否为不允许访问的地址, 不是ip的输入一律视为不允许
 */
export function isPrivateAddress(address: string): boolean {
  const family = isIP(address);
  if (family === 0) {
    return true;
  }

  // ipv4 映射的 ipv6 地址(::ffff:a.b.c.d)会按 ipv4 规则匹配
  return blockList.check(address, family === 6 ? 'ipv6' : 'ipv4');
}

function createPrivateAddressError(hostname: string) {
  return new Error(`Request to private network is not allowed: ${hostname}`);
}

/**
 * 去掉 URL 中 ipv6 主机名的方括号
 */
function stripBrackets(hostname: string) {
  return hostname.replace(/^\[|\]$/g, '');
}

/**
 * 替代 dns.lookup, 解析结果中只要有一个地址指向内网就返回错误
 *
 * 作为请求的 lookup 使用时校验发生在建立连接的那一次解析上, 因此重定向与 DNS 重绑定都绕不过去
 */
export const safeLookup = ((hostname: string, options: any, callback: any) => {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  dns.lookup(hostname, options, (err, address: any, family) => {
    if (err) {
      callback(err);
      return;
    }

    const addresses: string[] = Array.isArray(address)
      ? address.map((item) => item.address)
      : [address];
    if (addresses.some(isPrivateAddress)) {
      callback(createPrivateAddressError(hostname));
      return;
    }

    callback(null, address, family);
  });
}) as typeof dns.lookup;

/**
 * 解析主机名(也可以直接是ip), 指向内网时抛出异常
 * @returns 解析出的第一个地址
 */
export function resolvePublicAddress(hostname: string): Promise<string> {
  return new Promise((resolve, reject) => {
    safeLookup(stripBrackets(hostname), { all: true }, (err, addresses) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(addresses[0].address);
    });
  });
}

/**
 * got 的请求配置, 用于请求用户可控的地址
 */
export const safeGotOptions: Pick<Options, 'lookup' | 'hooks'> = {
  lookup: safeLookup as Options['lookup'],
  hooks: {
    beforeRequest: [
      (options) => {
        // 主机名直接是ip时不会经过 lookup, 每次请求(含重定向)前单独校验
        const hostname = stripBrackets(options.url.hostname);
        if (isIP(hostname) !== 0 && isPrivateAddress(hostname)) {
          throw createPrivateAddressError(hostname);
        }
      },
    ],
  },
};
