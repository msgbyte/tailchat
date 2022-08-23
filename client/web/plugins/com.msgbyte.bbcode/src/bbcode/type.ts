export type AstNode = AstNodeObj | AstNodeStr;

export type AstNodeObj = {
  tag: string;
  attrs: Record<string, string>;
  content: AstNode[];
};

export type AstNodeStr = string;

export interface TagProps {
  node: AstNodeObj;
}
