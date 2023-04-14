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
import onChange from "./onChange";
import { Tutorial } from "./model";
import { EditorState } from "lexical";


function Placeholder() {
  return <div className="editor-placeholder" >Add tutorial content</div>
}



export function startContent (tutorial: Tutorial): void {
    editorConfig.editorState = "".concat(`{"root":
      {"children":
        [{"children":
          [{"detail":0,"format":1,"mode":"normal","style":"", "text":"`, tutorial.stepTitle, `","type":"text","version":1}],
          "direction":"ltr","format":"","indent":0,"type":"paragraph","version":1
        },
        {"children":
          [{"detail":0,"format":0,"mode":"normal","style":"", "text":"`, tutorial.content, `","type":"text","version":1}],
          "direction":"ltr","format":"","indent":0,"type":"paragraph","version":1
        }],
        "direction":"ltr","format":"","indent":0,"type":"root","version":1
      }
    }`);
  }

var editorConfig = {
  namespace: "",
  // The editor theme
  theme: ExampleTheme,
  // Handling of errors during update
  onError(error: Error) {
    throw error;
  },
  editorState:"",
  // Any custom nodes go here
  nodes: [
    ListNode,
    ListItemNode,
    CodeNode,
    CodeHighlightNode,
  ]
}

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
