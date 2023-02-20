---
sidebar_position: 1
title: "@capital/common"
---

## 注册

### regGroupPanel

注册群组面板

```typescript
regGroupPanel({
  name: `com.msgbyte.webview/grouppanel`,
  label: '网页面板',
  provider: PLUGIN_NAME,
  extraFormMeta: [{ type: 'text', name: 'url', label: '网址' }],
  render: GroupWebPanelRender,
});
```

参数类型: [PluginGroupPanel](#plugingrouppanel)

### regMessageInterpreter

注册消息解释器

```typescript
regMessageInterpreter({
  name: '喵语翻译',
  explainMessage(message: string) {
    // 喵语 -> 人话
    if (!isMiao(message)) {
      return null;
    }

    return decode(message);
  },
});
```

参数类型: [PluginMessageInterpreter](#pluginmessageinterpreter)

### regMessageRender

*注册多个仅生效最后一个*

注册消息渲染器, 输入消息文本返回渲染内容

```typescript
regMessageRender((message) => {
  return <BBCode plainText={message} />;
});
```

### regChatInputAction

注册聊天输入框操作

```typescript
regChatInputAction({
  label: '喵言喵语',
  onClick: (actions) => {
    openModal(createElement(SendMiaoModal, { actions }));
  },
});
```

参数类型: [ChatInputAction](#chatinputaction)


### regPluginColorScheme

注册插件配色方案/主题

```typescript
regPluginColorScheme({
  label: 'Miku 葱',
  name: 'light+miku',
});
```








## 工具函数

### useGroupPanelParams

在`hooks`中获取用户面板相关信息

```typescript
import { useGroupPanelParams } from '@capital/common';

const { groupId, panelId } = useGroupPanelParams();
```

### openModal

打开一个模态框

```typescript
openModal(
  content: React.ReactNode,
  props?: Pick<ModalProps, 'closable' | 'maskClosable'>
)
```

类型:
- [ModalProps](#modalprops)


### ModalWrapper

模态框包装器

```jsx
<ModalWrapper>
  <div></div>
</ModalWrapper>
```

### useModalContext

获取模态框上下文

```typescript
const { closeModal } = useModalContext();
```

### getGlobalState

获取全局 `Redux` 状态上下文

```typescript
const state = getGlobalState();
```

### getCachedUserInfo

获取用户信息, 缓存版本

```typescript
const info = getCachedUserInfo(userId);
```

### getCachedConverseInfo

获取会话信息

```typescript
const info = getCachedConverseInfo(converseId);
```

## 类型

### PluginGroupPanel

```typescript
interface PluginGroupPanel {
  /**
   * 面板唯一标识
   * @example com.msgbyte.webview/grouppanel
   */
  name: string;

  /**
   * 面板显示名
   */
  label: string;

  /**
   * 插件提供者, 用于引导没有安装插件的用户安装插件
   */
  provider: string;

  /**
   * 额外的表单数据, 用于创建面板时使用
   */
  extraFormMeta: FastFormFieldMeta[];

  /**
   * 该面板如何渲染
   */
  render: React.ComponentType;
}
```

### PluginMessageInterpreter

插件消息解释器

```typescript
interface PluginMessageInterpreter {
  name?: string;
  explainMessage: (message: string) => React.ReactNode;
}
```

### ChatInputAction

消息输入框操作对象

```typescript
interface ChatInputAction {
  label: string;
  onClick: (actions: ChatInputActionContextProps) => void;
}
```


### GroupPanel

```typescript
interface GroupPanel {
  id: string; // 在群组中唯一
  name: string;
  parentId?: string;
  type: GroupPanelType;
  provider?: string; // 面板提供者
  pluginPanelName?: string; // 插件面板名
  meta?: Record<string, unknown>;
}
```


### ModalProps

```typescript
interface ModalProps {
  visible?: boolean;
  onChangeVisible?: (visible: boolean) => void;

  /**
   * 是否显示右上角的关闭按钮
   * @default false
   */
  closable?: boolean;

  /**
   * 遮罩层是否可关闭
   */
  maskClosable?: boolean;
}
```
