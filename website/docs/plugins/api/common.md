---
sidebar_position: 1
title: "@capital/common"
---

## register

### regGroupPanel

Register Group Panel

```typescript
regGroupPanel({
  name: `com.msgbyte.webview/grouppanel`,
  label: 'web panel',
  provider: PLUGIN_NAME,
  extraFormMeta: [{ type: 'text', name: 'url', label: 'URL' }],
  render: GroupWebPanelRender,
});
```

Parameter type: [PluginGroupPanel](#plugingrouppanel)

### regMessageInterpreter

register message interpreter

```typescript
regMessageInterpreter({
   name: 'Meow language translation',
   explainMessage(message: string) {
     // Meow -> Human
     if (!isMiao(message)) {
       return null;
     }

     return decode(message);
   },
});
```

Parameter type: [PluginMessageInterpreter](#pluginmessageinterpreter)

### regMessageRender

*Multiple registrations only take effect for the last one*

Register a message renderer, enter the message text and return the rendered content

```typescript
regMessageRender((message) => {
   return <BBCode plainText={message} />;
});
```

### regChatInputAction

Register chat input box operation

```typescript
regChatInputAction({
   label: 'Meow words',
   onClick: (actions) => {
     openModal(createElement(SendMiaoModal, { actions }));
   },
});
```

Parameter Type: [ChatInputAction](#chatinputaction)


### regPluginColorScheme

Register plugin color schemes/themes

```typescript
regPluginColorScheme({
   label: 'Miku onion',
   name: 'light+miku',
});
```








## Utility function

### useGroupPanelParams

Get user panel related information in `hooks`

```typescript
import { useGroupPanelParams } from '@capital/common';

const { groupId, panelId } = useGroupPanelParams();
```

### openModal

open a modal

```typescript
openModal(
  content: React.ReactNode,
  props?: Pick<ModalProps, 'closable' | 'maskClosable'>
)
```

type:
- [ModalProps] (#modalprops)


### ModalWrapper

Modal Wrapper

```jsx
<ModalWrapper>
  <div></div>
</ModalWrapper>
```

### useModalContext

Get the modal context

```typescript
const { closeModal } = useModalContext();
```

### getGlobalState

Get the global `Redux` state context

```typescript
const state = getGlobalState();
```

### getCachedUserInfo

Get user information, cached version

```typescript
const info = getCachedUserInfo(userId);
```

### getCachedConverseInfo

Get session information

```typescript
const info = getCachedConverseInfo(converseId);
```

## type

### PluginGroupPanel

```typescript
interface PluginGroupPanel {
  /**
  * The unique identification of the panel
  * @example com.msgbyte.webview/grouppanel
  */
  name: string;

  /**
  * panel display name
  */
  label: string;

  /**
  * Plug-in provider, used to guide users who have not installed the plug-in to install the plug-in
  */
  provider: string;

  /**
  * Additional form data, used when creating panels
  */
  extraFormMeta: FastFormFieldMeta[];

  /**
  * How the panel is rendered
  */
  render: React. ComponentType;
}
```

### PluginMessageInterpreter

Plugin Message Interpreter

```typescript
interface PluginMessageInterpreter {
  name?: string;
  explainMessage: (message: string) => React. ReactNode;
}
```

### ChatInputAction

Message input box operation object

```typescript
interface ChatInputAction {
  label: string;
  onClick: (actions: ChatInputActionContextProps) => void;
}
```


###GroupPanel

```typescript
interface GroupPanel {
  id: string; // unique in the group
  name: string;
  parentId?: string;
  type: GroupPanelType;
  provider?: string; // panel provider
  pluginPanelName?: string; // plugin panel name
  meta?: Record<string, unknown>;
}
```


### ModalProps

```typescript
interface ModalProps {
  visible?: boolean;
  onChangeVisible?: (visible: boolean) => void;

  /**
  * Whether to display the close button in the upper right corner
  * @default false
  */
  closable?: boolean;

  /**
  * Whether the mask layer can be closed
  */
  maskClosable?: boolean;
}
```
