import type { TushanContextProps } from 'tushan';
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
            banUser: 'Ban User',
            banUserDesc:
              'Banning a user disconnects the user from the current connection and prevents future logins',
            unbanUser: 'Unban User',
            unbanUserDesc: 'After lifting the ban, the user can login normally',
          },
          dashboard: {
            file: 'File',
            messages: 'Messages',
            newUserCount: 'New User Count',
            messageCount: 'Message Count',
            tip: {
              github:
                'Tailchat: The next-generation noIM Application in your own workspace',
            },
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
            allowGuestLogin: 'Allow Guest Login',
            allowUserRegister: 'Allow User Register',
            serverName: 'Server Name',
            serverEntryImage: 'Server Entry Page Image',
          },
          cache: {
            cleanTitle: 'Are you sure you want to clear the cache?',
            cleanDesc:
              'Please be cautious in the production environment, clearing the cache may lead to increased pressure on the database in a short period of time',
            cleanBtn: 'Clean Cache',
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
              banned: '是否被封禁',
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
              to: '目标邮箱',
              subject: '邮件主题',
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
          cache: {
            name: '缓存管理',
          },
        },
        custom: {
          action: {
            resetPassword: '重置密码',
            banUser: '封禁用户',
            banUserDesc: '封禁用户会将用户从当前连接断开并阻止之后的登录操作',
            unbanUser: '解除封禁用户',
            unbanUserDesc: '解除封禁后用户可以正常登录',
          },
          dashboard: {
            file: '文件',
            messages: '消息数',
            newUserCount: '用户新增',
            messageCount: '消息数',
            tip: {
              github: 'Tailchat 是在你私有空间内的下一代noIM应用',
              tushan: 'Tailchat Admin后台 由 tushan 提供技术支持',
            },
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
            allowGuestLogin: '允许访客登录',
            allowUserRegister: '允许用户注册',
            serverName: '服务器名',
            serverEntryImage: '服务器登录图',
          },
          cache: {
            cleanTitle: '确定要清理缓存么？',
            cleanDesc:
              '生产环境请谨慎操作, 清理缓存可能会导致短时间内数据库压力增加',
            cleanBtn: '清理缓存',
          },
        },
      },
    },
  ],
};
