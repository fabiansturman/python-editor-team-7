import ExampleTheme from "./themes/ExampleTheme";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import {HistoryPlugin} from '@lexical/react/LexicalHistoryPlugin';
import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import onChange from "./onChange"

function Placeholder() {
  return <div className="editor-placeholder" >Add tutorial content</div>
}

const startContent = `{"root":
    {"children":
      [{"children":
        [{"detail":0,"format":1,"mode":"normal","style":"",
        "text":"starting off: 1/3","type":"text","version":1}],
        "direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},
      {"children":
        [{"detail":0,"format":0,"mode":"normal","style":"",
        "text":"Lorem  ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim  veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea  commodo consequat. ","type":"text","version":1}],
        "direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},
      {"children":
        [{"detail":0,"format":0,"mode":"normal","style":"",
        "text":"Duis aute irure dolor in reprehenderit in voluptate  velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint  occaecat cupidatat non proident, sunt in culpa qui officia deserunt  mollit anim id est laborum.","type":"text","version":1}],
        "direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},
      {"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],
    "direction":"ltr","format":"","indent":0,"type":"root","version":1}}`

const editorConfig = {
  namespace: "",
  // The editor theme
  theme: ExampleTheme,
  // Handling of errors during update
  onError(error: Error) {
    throw error;
  },
  editorState: startContent,
  // Any custom nodes go here
  nodes: [
    ListNode,
    ListItemNode,
    CodeNode,
    CodeHighlightNode,
  ]
};

export default function Editor() {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="editor-container">
        <ToolbarPlugin />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
      </div>
      <HistoryPlugin />
      <OnChangePlugin onChange={onChange} />
    </LexicalComposer>
  );
}
