import { i18nEnTranslation } from 'tushan/client/i18n/resources/en';

export const enTranslation = {
  ...i18nEnTranslation,
  resources: {
    p_discover: {
      name: 'Discover',
      fields: {
        groupId: 'Group ID',
        active: 'Is Active',
        order: 'Order',
      },
    },
  },
  custom: {
    action: {
      resetPassword: 'Reset Password',
      resetPasswordTip:
        'After resetting the password, the password becomes: 123456789, please change the password in time',
      banUser: 'Ban User',
      banUserDesc:
        'Banning a user disconnects the user from the current connection and prevents future logins',
      unbanUser: 'Unban User',
      unbanUserDesc: 'After lifting the ban, the user can login normally',
      addGroupMember: 'Add Group Member',
      addGroupMemberTitle: 'Select Member and append into group member',
      addGroupMemberRequiredTip: 'You need select group member',
      selectUser: 'Select User',
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
    file: {
      fileTotalSize: 'File Total Size',
    },
    analytics: {
      activeGroupTop5: 'Active Group Top 5',
      activeUserTop5: 'Active User Top 5',
      largeGroupTop5: 'Large Group Top 5',
      fileStorageUserTop5: 'File Storage User Top 5',
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
      allowCreateGroup: 'Allow Create Group',
      serverName: 'Server Name',
      serverEntryImage: 'Server Entry Page Image',
      configPanel: 'Config',
      announcementPanel: 'Announcement',
      announcementEnable: 'Is Enable Announcement',
      announcementText: 'Announcement Text',
      announcementLink: 'Announcement Link',
      announcementLinkTip:
        'This content is optional, and it is the address to announce more content',
    },
    cache: {
      cleanTitle: 'Are you sure you want to clear the cache?',
      cleanDesc:
        'Please be cautious in the production environment, clearing the cache may lead to increased pressure on the database in a short period of time',
      cleanConfigBtn: 'Clean Client Config Cache',
      cleanAllBtn: 'Clean All Cache',
    },
    'system-notify': {
      create: 'Create System Notify',
      tip: 'The system notification will be sent to the corresponding user in the form of inbox',
      title: 'Title',
      content: 'Content',
      scope: 'Notify Scope',
      allUser: 'All User',
      allUserTip:
        'All users excluding temporary users. Also, if there are many users, it may not be possible to notify all users at once',
      specifiedUser: 'Specified User',
      notifySuccess: 'Sent successfully, sent to ${data.userIds.length} users',
    },
  },
};
