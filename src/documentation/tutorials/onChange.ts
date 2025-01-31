import { EditorState } from "lexical";
import { active } from "./TutorialsDocumentation";

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
      var x = "";
      for (let i = 0; i < jsonState.root.children.length; i++) {
        if (typeof jsonState.root.children[i].children[0] !== "undefined") {
          x = x.concat(" ", jsonState.root.children[i].children[0].text);
        }
      }
      active.json_content = json;
      active.content = "You should not see this!";
    }
  });
}
