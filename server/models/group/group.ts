import {
  getModelForClass,
  prop,
  DocumentType,
  Ref,
  ReturnModelType,
  modelOptions,
  Severity,
} from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import _ from 'lodash';
import { Types } from 'mongoose';
import { User } from '../user/user';

export enum GroupPanelType {
  TEXT = 0,
  GROUP = 1,
  PLUGIN = 2,
}

class GroupMember {
  @prop({
    type: () => String,
  })
  roles?: string[]; // 角色权限组id

  @prop({
    ref: () => User,
  })
  userId: Ref<User>;

  /**
   * 禁言到xxx 为止
   */
  @prop()
  muteUntil?: Date;
}

@modelOptions({
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class GroupPanel {
  @prop()
  id: string; // 在群组中唯一, 可以用任意方式进行生成。这里使用ObjectId, 但不是ObjectId类型

  @prop()
  name: string; // 用于显示的名称

  @prop()
  parentId?: string; // 父节点id

  @prop()
  type: number; // 面板类型: Reference: https://discord.com/developers/docs/resources/channel#channel-object-channel-types

  @prop()
  provider?: string; // 面板提供者，为插件的标识，仅面板类型为插件时有效

  @prop()
  pluginPanelName?: string; // 插件面板名, 如 com.msgbyte.webview/grouppanel

  /**
   * 面板的其他数据
   */
  @prop()
  meta?: object;
}

/**
 * 群组权限组
 */
export class GroupRole implements Base {
  _id: Types.ObjectId;
  id: string;

  @prop()
  name: string; // 权限组名

  @prop({
    type: () => String,
  })
  permissions: string[]; // 拥有的权限, 是一段字符串
}

/**
 * 群组
 */
export class Group extends TimeStamps implements Base {
  _id: Types.ObjectId;
  id: string;

  @prop({
    trim: true,
    maxlength: [100, 'group name is too long'],
  })
  name!: string;

  @prop()
  avatar?: string;

  @prop({
    ref: () => User,
  })
  owner: Ref<User>;

  @prop({ type: () => GroupMember, _id: false })
  members: GroupMember[];

  @prop({ type: () => GroupPanel, _id: false })
  panels: GroupPanel[];

  @prop({
    type: () => GroupRole,
    default: [],
  })
  roles?: GroupRole[];

  /**
   * 所有人的权限列表
   * 为群组中的最低权限
   */
  @prop({
    type: () => String,
    default: () => [],
  })
  fallbackPermissions: string[];

  /**
   * 创建群组
   */
  static async createGroup(
    this: ReturnModelType<typeof Group>,
    options: {
      name: string;
      avatarBase64?: string; // base64版本的头像字符串
      panels?: GroupPanel[];
      owner: string;
    }
  ): Promise<GroupDocument> {
    const { name, avatarBase64, panels = [], owner } = options;
    if (typeof avatarBase64 === 'string') {
      // TODO: 处理头像上传逻辑
    }

    // 预处理panels信息, 变换ID为objectid
    const panelSectionMap: Record<string, string> = {};
    panels.forEach((panel) => {
      const originPanelId = panel.id;
      panel.id = String(new Types.ObjectId());
      if (panel.type === GroupPanelType.GROUP) {
        panelSectionMap[originPanelId] = panel.id;
      }

      if (typeof panel.parentId === 'string') {
        if (typeof panelSectionMap[panel.parentId] !== 'string') {
          throw new Error('创建失败, 面板参数不合法');
        }
        panel.parentId = panelSectionMap[panel.parentId];
      }
    });

    // NOTE: Expression produces a union type that is too complex to represent.
    const res = await this.create({
      name,
      panels,
      owner,
      members: [
        {
          roles: [],
          userId: owner,
        },
      ],
    });

    return res;
  }

  /**
   * 获取用户加入的群组列表
   * @param userId 用户ID
   */
  static async getUserGroups(
    this: ReturnModelType<typeof Group>,
    userId: string
  ): Promise<GroupDocument[]> {
    return this.find({
      'members.userId': userId,
    });
  }

  /**
   * 修改群组角色名
   */
  static async updateGroupRoleName(
    this: ReturnModelType<typeof Group>,
    groupId: string,
    roleId: string,
    roleName: string,
    operatorUserId: string
  ): Promise<Group> {
    const group = await this.findById(groupId);
    if (!group) {
      throw new Error('Not Found Group');
    }

    // 首先判断是否有修改权限的权限
    if (String(group.owner) !== operatorUserId) {
      throw new Error('No Permission');
    }

    const modifyRole = group.roles.find((role) => String(role._id) === roleId);
    if (!modifyRole) {
      throw new Error('Not Found Role');
    }

    modifyRole.name = roleName;
    await group.save();

    return group;
  }

  /**
   * 修改群组角色权限
   */
  static async updateGroupRolePermission(
    this: ReturnModelType<typeof Group>,
    groupId: string,
    roleId: string,
    permissions: string[],
    operatorUserId: string
  ): Promise<Group> {
    const group = await this.findById(groupId);
    if (!group) {
      throw new Error('Not Found Group');
    }

    // 首先判断是否有修改权限的权限
    if (String(group.owner) !== operatorUserId) {
      throw new Error('No Permission');
    }

    const modifyRole = group.roles.find((role) => String(role._id) === roleId);
    if (!modifyRole) {
      throw new Error('Not Found Role');
    }

    modifyRole.permissions = [...permissions];
    await group.save();

    return group;
  }

  /**
   * 获取用户所有权限
   */
  static async getGroupUserPermission(
    this: ReturnModelType<typeof Group>,
    groupId: string,
    userId: string
  ): Promise<string[]> {
    const group = await this.findById(groupId);
    if (!group) {
      throw new Error('Not Found Group');
    }

    const member = group.members.find(
      (member) => String(member.userId) === userId
    );
    if (!member) {
      throw new Error('Not Found Member');
    }

    const allRoles = member.roles;
    const allRolesPermission = allRoles.map((roleName) => {
      const p = group.roles.find((r) => r.name === roleName);

      return p?.permissions ?? [];
    });
    return _.union(...allRolesPermission, group.fallbackPermissions); // 权限取并集
  }

  /**
   * 修改群组成员的字段信息
   *
   * 带权限验证
   */
  static async updateGroupMemberField<K extends keyof GroupMember>(
    this: ReturnModelType<typeof Group>,
    groupId: string,
    memberId: string,
    fieldName: K,
    fieldValue: GroupMember[K] | ((member: GroupMember) => void),
    operatorUserId: string
  ): Promise<Group> {
    const group = await this.findById(groupId);

    if (String(group.owner) !== operatorUserId) {
      throw new Error('没有操作权限');
    }

    const member = group.members.find((m) => String(m.userId) === memberId);
    if (!member) {
      throw new Error('没有找到该成员');
    }

    if (typeof fieldValue === 'function') {
      fieldValue(member);
    } else {
      member[fieldName] = fieldValue;
    }

    await group.save();

    return group;
  }
}

export type GroupDocument = DocumentType<Group>;

const model = getModelForClass(Group);

export type GroupModel = typeof model;

export default model;
