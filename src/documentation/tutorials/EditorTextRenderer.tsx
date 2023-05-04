// Function to convert the Lexical editor JSON structure to React elements

import CodeEmbed from "../common/CodeEmbed";

function handleAsPlainText(node : any) : string {
    if(typeof node.children !== "undefined"){
        return node.children.map(handleAsPlainText).reduce(
            (acc: string, current: string) => acc + current,
            ""
        );
    } else {
        return node.text;
    }
}

function handleNode(node : any) {
    if(node.type === "code"){
        return <CodeEmbed code={handleAsPlainText(node)}></CodeEmbed>
    } else if(node.type === "paragraph" || node.type === "root") {
        return <p>{node.children.map(handleNode)}</p>;
    } else if(node.type === "text") {
        var output : any = node.text;
        if((node.format & 1) > 0){
            output = <b>{output}</b>;
        }
        if((node.format & 2) > 0){
            output = <em>{output}</em>;
        }
        if((node.format & 4) > 0){
            output = <s>{output}</s>;
        }
        if((node.format & 8) > 0){
            output = <u>{output}</u>;
        }
        return output;
    }
    return <div/>;
}

export function convertEditorData(jsonData : any) {
    return handleNode(jsonData.root);
}