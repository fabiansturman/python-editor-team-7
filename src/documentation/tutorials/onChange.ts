import { $getRoot, $getSelection, EditorState } from "lexical";
import {active} from "./TutorialsDocumentation";

// When the editor changes, you can get notified via the
// LexicalOnChangePlugin!
export default function onChange(editorState: EditorState): void {
  editorState.read(() => {
    // Read the contents of the EditorState here.
    const json = editorState.toJSON();
    const str = JSON.stringify(json);
    const jsonState = JSON.parse(str);
    console.log(str);
    if (typeof active !== "undefined") {
      active.stepTitle = jsonState.root.children[0].children[0].text;
      var x = "";
      for (let i = 1; i < jsonState.root.children.length; i++) {
        if (typeof jsonState.root.children[i].children[0] !== "undefined") {
          x = x.concat(" ", jsonState.root.children[i].children[0].text);
        }
      }
      active.content = x;

    }
  });
}
