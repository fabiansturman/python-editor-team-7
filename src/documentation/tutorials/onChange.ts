import { $getRoot, $getSelection, EditorState } from "lexical";

// When the editor changes, you can get notified via the
// LexicalOnChangePlugin!
export default function onChange(editorState: EditorState): void {
  editorState.read(() => {
    // Read the contents of the EditorState here.
    const json = editorState.toJSON();
    console.log(JSON.stringify(json));
  });
}
