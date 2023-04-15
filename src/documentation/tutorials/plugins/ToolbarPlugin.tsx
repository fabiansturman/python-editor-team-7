import {
  $createCodeNode,
  $isCodeNode
} from "@lexical/code";
import {
  $isListNode,
  ListNode
} from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $isHeadingNode
} from "@lexical/rich-text";
import {
  $isAtNodeEnd, $wrapNodes
} from "@lexical/selection";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import {
  $createParagraphNode,
  $getNodeByKey, $getSelection,
  $isRangeSelection, FORMAT_TEXT_COMMAND, SELECTION_CHANGE_COMMAND
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const LowPriority = 1;

const supportedBlockTypes = new Set<string>([
  "paragraph",
  "code",
]);

const blockTypeToBlockName: Record<string, string> = {
  code: "Code Block",
  paragraph: "Normal",
};

function Divider() {
  return <div className="divider" />;
}

interface SelectProps {
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className: string;
  options: string[];
  value: string;
}

function Select({ onChange, className, options, value }: SelectProps) {
  return (
    <select className={className} onChange={onChange} value={value}>
      <option hidden={true} value="" />
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

interface BlockOptionsDropdownListProps {
  editor: any; // TODO: Replace "any" with the correct type
  blockType: string;
  toolbarRef: React.RefObject<HTMLDivElement>;
  setShowBlockOptionsDropDown: React.Dispatch<React.SetStateAction<boolean>>;
}

function BlockOptionsDropdownList({
  editor,
  blockType,
  toolbarRef,
  setShowBlockOptionsDropDown
}: BlockOptionsDropdownListProps) {
  const dropDownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const toolbar = toolbarRef.current;
    const dropDown = dropDownRef.current;

    if (toolbar !== null && dropDown !== null) {
      const { top, left } = toolbar.getBoundingClientRect();
      dropDown.style.top = `${top + 40}px`;
      dropDown.style.left = `${left}px`;
    }
  }, [dropDownRef, toolbarRef]);

  useEffect(() => {
    const dropDown = dropDownRef.current;
    const toolbar = toolbarRef.current;

    if (dropDown !== null && toolbar !== null) {
      const handle = (event: MouseEvent) => {
        const target = event.target as HTMLElement;

        if (!dropDown.contains(target) && !toolbar.contains(target)) {
          setShowBlockOptionsDropDown(false);
        }
      };
      document.addEventListener("click", handle);

      return () => {
        document.removeEventListener("click", handle);
      };
    }
  }, [dropDownRef, setShowBlockOptionsDropDown, toolbarRef]);

  const formatParagraph = () => {
    if (blockType !== "paragraph") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createParagraphNode());
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatCode = () => {
    if (blockType !== "code") {
      editor.update(() => {
        const selection = $getSelection();

       
        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createCodeNode());
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  return (
  <div className="dropdown" ref={dropDownRef}>
  <button className="item" onClick={formatParagraph}>
  <span className="icon paragraph" />
  <span className="text">Normal</span>
  {blockType === "paragraph" && <span className="active" />}
  </button>
  <button className="item" onClick={formatCode}>
  <span className="icon code" />
  <span className="text">Code Block</span>
  {blockType === "code" && <span className="active" />}
  </button>
  </div>
  );
  }
  
  export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [blockType, setBlockType] = useState<string>("paragraph");
  const [selectedElementKey, setSelectedElementKey] = useState<string | null>(null);
  const [showBlockOptionsDropDown, setShowBlockOptionsDropDown] = useState<boolean>(false);
  const [codeLanguage, setCodeLanguage] = useState<string>("");
  const [isBold, setIsBold] = useState<boolean>(false);
  const [isItalic, setIsItalic] = useState<boolean>(false);
  const [isUnderline, setIsUnderline] = useState<boolean>(false);
  const [isStrikethrough, setIsStrikethrough] = useState<boolean>(false);
  const [isCode, setIsCode] = useState<boolean>(false);
  
  const updateToolbar = useCallback(() => {
  const selection = $getSelection();
  if ($isRangeSelection(selection)) {
  const anchorNode = selection.anchor.getNode();
  const element =
  anchorNode.getKey() === "root"
  ? anchorNode
  : anchorNode.getTopLevelElementOrThrow();
  const elementKey = element.getKey();
  const elementDOM = editor.getElementByKey(elementKey);
  if (elementDOM !== null) {
  setSelectedElementKey(elementKey);
  if ($isListNode(element)) {
  const parentList = $getNearestNodeOfType(anchorNode, ListNode);
  const type = parentList ? parentList.getTag() : element.getTag();
  setBlockType(type);
  } else {
  const type = $isHeadingNode(element)
  ? element.getTag()
  : element.getType();
  setBlockType(type);
  if ($isCodeNode(element)) {
  setCodeLanguage("Python");
  }
  }
  }
  // Update text format
  setIsBold(selection.hasFormat("bold"));
  setIsItalic(selection.hasFormat("italic"));
  setIsUnderline(selection.hasFormat("underline"));
  setIsStrikethrough(selection.hasFormat("strikethrough"));
  setIsCode(selection.hasFormat("code"));
  }
  }, [editor]);
  
  useEffect(() => {
  return mergeRegister(
  editor.registerUpdateListener(({ editorState }: any) => {
  editorState.read(() => {
  updateToolbar();
  });
  }),
  editor.registerCommand(
  SELECTION_CHANGE_COMMAND,
  (_payload: any, newEditor: any) => {
  updateToolbar();
  return false;
  },
  LowPriority
  ),
  );
  }, [editor, updateToolbar]);
  
  const codeLanguges = ["Python"];
  const onCodeLanguageSelect = useCallback(
  (e: React.ChangeEvent<HTMLSelectElement>) => {
  editor.update(() => {
  if (selectedElementKey !== null) {
  const node = $getNodeByKey(selectedElementKey);
  if ($isCodeNode(node)) {
  node.setLanguage(e.target.value);
}
}
});
},
[editor, selectedElementKey]
);

return (
<div className="toolbar" ref={toolbarRef}>
<Divider />
{supportedBlockTypes.has(blockType) && (
<>
<button
className="toolbar-item block-controls"
onClick={() =>
setShowBlockOptionsDropDown(!showBlockOptionsDropDown)
}
aria-label="Formatting Options"
>
<span className={"icon block-type " + blockType} />
<span className="text">{blockTypeToBlockName[blockType]}</span>
<i className="chevron-down" />
</button>
{showBlockOptionsDropDown &&
createPortal(
<BlockOptionsDropdownList
             editor={editor}
             blockType={blockType}
             toolbarRef={toolbarRef}
             setShowBlockOptionsDropDown={setShowBlockOptionsDropDown}
           />,
document.body
)}
<Divider />
</>
)}
{blockType === "code" ? (
<>
<Select
         className="toolbar-item code-language"
         onChange={onCodeLanguageSelect}
         options={codeLanguges}
         value={codeLanguage}
       />
</>
) : (
<>
<button
onClick={() => {
editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
}}
className={"toolbar-item spaced " + (isBold ? "active" : "")}
aria-label="Format Bold"
>
<i className="format bold" />
</button>
<button
onClick={() => {
editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
}}
className={"toolbar-item spaced " + (isItalic ? "active" : "")}
aria-label="Format Italics"
>
<i className="format italic" />
</button>
<button
onClick={() => {
editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
}}
className={"toolbar-item spaced " + (isUnderline ? "active" : "")}
aria-label="Format Underline"
>
<i className="format underline" />
</button>
<button
onClick={() => {
editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
}}
className={
"toolbar-item spaced " + (isStrikethrough ? "active" : "")
}
aria-label="Format Strikethrough"
>
<i className="format strikethrough" />
</button>
</>
)}
</div>
);
}    