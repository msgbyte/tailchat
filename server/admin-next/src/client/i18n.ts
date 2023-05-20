import { TushanContextProps } from 'tushan';
import { i18nEnTranslation } from 'tushan/client/i18n/resources/en';
import { i18nZhTranslation } from 'tushan/client/i18n/resources/zh';

export const i18n: TushanContextProps['i18n'] = {
  languages: [
    {
      key: 'en',
      label: 'English',
      translation: {
        ...i18nEnTranslation,
        custom: {
          action: {
            resetPassword: 'Reset Password',
          },
          network: {
            nodeList: 'Node List',
            id: 'ID',
            hostname: 'Host Name',
            cpuUsage: 'CPU Usage',
            ipList: 'IP List',
            sdkVersion: 'SDK Version',
            serviceList: 'Service List',
            actionList: 'Action List',
            eventList: 'Event List',
          },
          socketio: {
            tip1: 'The server URL is:',
            tip2: 'The account password is the account password of Tailchat Admin',
            tip3: 'NOTICE: please check "Advanced options" then select "websocket only" and "MessagePack parser"',
            btn: 'Open the Admin platform',
          },
          config: {
            uploadFileLimit: 'Upload file limit (Byte)',
            emailVerification: 'Mandatory Email Verification',
            serverName: 'Server Name',
            serverEntryImage: 'Server Entry Page Image',
          },
        },
      },
    },
    {
      key: 'zh',
      label: '简体中文',
      translation: {
        ...i18nZhTranslation,
        resources: {
          users: {
            name: '用户管理',
            fields: {
              id: '用户ID',
              email: '邮箱',
              avatar: '头像',
              username: '用户名',
              password: '密码',
              nickname: '昵称',
              discriminator: '标识符',
              temporary: '是否游客',
              type: '用户类型',
              settings: '用户设置',
              createdAt: '创建时间',
            },
          },
          messages: {
            name: '消息管理',
            fields: {
              content: '内容',
              author: '作者',
              groupId: '群组ID',
              converseId: '会话ID',
              hasRecall: '撤回',
              reactions: '消息反应',
              createdAt: '创建时间',
            },
          },
          groups: {
            name: '群组管理',
            fields: {
              id: '群组ID',
              name: '群组名称',
              avatar: '头像',
              owner: '管理员',
              'members.length': '成员数量',
              'panels.length': '面板数量',
              roles: '角色',
              config: '配置信息',
              fallbackPermissions: '默认权限',
              createdAt: '创建时间',
              updatedAt: '更新时间',
            },
          },
          file: {
            name: '文件管理',
            fields: {
              objectName: '对象存储名',
              url: '文件路径',
              size: '文件大小',
              'metaData.content-type': '文件类型',
              userId: '存储用户',
              createdAt: '创建时间',
            },
          },
          mail: {
            name: '邮件历史',
            fields: {
              userId: '用户ID',
              host: '发信主机',
              port: '发信端口',
              secure: '是否加密',
              is_success: '是否成功',
              data: '数据',
              error: '错误信息',
              createdAt: '创建时间',
            },
          },
          system: {
            name: '系统设置',
          },
          network: {
            name: '微服务网络',
          },
          socketio: {
            name: 'Socket.IO 长链接',
          },
        },
        custom: {
          action: {
            resetPassword: '重置密码',
          },
          network: {
            nodeList: '节点列表',
            id: 'ID',
            hostname: '主机名',
            cpuUsage: 'CPU占用',
            ipList: 'IP地址列表',
            sdkVersion: 'SDK版本',
            serviceList: '服务列表',
            actionList: '操作列表',
            eventList: '事件列表',
          },
          socketio: {
            tip1: '服务器URL为:',
            tip2: '账号密码为Tailchat后台的账号密码',
            tip3: '注意: 请打开 "Advanced options" 并选中 "websocket only" 与 "MessagePack parser"',
            btn: '打开管理平台',
          },
          config: {
            uploadFileLimit: '上传文件限制(Byte)',
            emailVerification: '邮箱强制验证',
            serverName: '服务器名',
            serverEntryImage: '服务器登录图',
          },
        },
      },
    },
  ],
};
