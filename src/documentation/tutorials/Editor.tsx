import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { ListItemNode, ListNode } from "@lexical/list";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { Tutorial } from "./model";
import onChange from "./onChange";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import ExampleTheme from "./themes/ExampleTheme";


function Placeholder() {
  return <div className="editor-placeholder" >Add tutorial content</div>
}



export function startContent (tutorial: Tutorial): void {
    if(typeof tutorial.json_content !== "undefined"){
      editorConfig.editorState = JSON.stringify(tutorial.json_content);
    } else {
      editorConfig.editorState = "".concat(`{"root":
        {"children":
          [{"children":
            [{"detail":0,"format":0,"mode":"normal","style":"", "text":"`, tutorial.content, `","type":"text","version":1}],
            "direction":"ltr","format":"","indent":0,"type":"paragraph","version":1
          }],
          "direction":"ltr","format":"","indent":0,"type":"root","version":1
        }
      }`);
    }
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
