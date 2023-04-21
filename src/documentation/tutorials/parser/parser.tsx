// NIM Parser for micro:bit Python Editor

import { integer } from "vscode-languageserver-protocol";
import { Tutorial } from "../model";

export class Parser {

    #steps : Tutorial[] = [];

    #tutorialName = "nil";
    #tutorialAuthor = "nil";
    #tutorialIconPath = "nil";

    // Remember: The step index parameter for this function is indexed starting at 0, unlike the syntax presented to the user
    #setProperty(propertyName : string, propertyValue : string, stepIndex : integer) {
        if(typeof this.#steps[stepIndex] == "object"){      // Check it's not null
            // We can't easily dynamically set this property, so a clunky switch case is the simplest way here
            switch(propertyName){
                case "StepTitle":
                    this.#steps[stepIndex].stepTitle = propertyValue;
                    break;
                case "Contents":
                    this.#steps[stepIndex].content = propertyValue;
                    break;
                case "TutorialName":
                    this.#steps[stepIndex].name = propertyValue;
                    break;
                case "Author":
                    this.#steps[stepIndex].author = propertyValue;
                    break;
                case "Icon":
                    this.#steps[stepIndex].icon = {
                        _type: "simpleImage", 
                        asset: propertyValue};
                    break;
            }
        }
    }

    #setTutorialProperty(propertyName : string, propertyValue : any) {
        for(let i = 0; i < this.#steps.length; i++){
            this.#setProperty(propertyName, propertyValue, i);
        }

        // Now set the value for steps which have yet to be added
        switch(propertyName){
            case "TutorialName":
                this.#tutorialName = propertyValue;
                break;
            case "Author":
                this.#tutorialAuthor = propertyValue;
                break;
            case "Icon":
                this.#tutorialIconPath = propertyValue;
                break;
        }
    }

    // Our tutorial objects as created by the parse function aren't yet linked; we'll now do this at the end after parsing
    // We'll also set the slugs to use the tutorial name
    #linkList() {
        var i : integer = 0;
        var slugifiedName : string = this.#tutorialName.toLowerCase().replace(/\s/g, "-");
        while(i < this.#steps.length - 1){
            this.#steps[i].slug = {_type: "slug", current: slugifiedName + "-" + (i+1)};
            this.#steps[i+1].slug = {_type: "slug", current: slugifiedName + "-" + (i+2)};

            this.#steps[i].hasNextSection = true;
            this.#steps[i].nextSection = {_type: "slug", current: this.#steps[i+1].slug.current};
            this.#steps[i+1].hasPrevSection = true;
            this.#steps[i+1].prevSection = {_type: "slug", current: this.#steps[i].slug.current};

            i += 1;
        }
    }

    parse(fileText : string) {
        // Here, we'll return a tutorial object based on what we're given

        var readingStep : boolean = false;              // Are we reading a step block?
        var readingPropertyBlock : boolean = false;     // Are we reading the property block?
        var readingProperty : boolean = false;          // Are we reading a property?

        var lineCount : integer = 1;                        // We'll track the line number for helpful errors
        var fileLines : string[] = fileText.split("\n");

        // If we have a property that runs on into multiple lines within a block, we will have to then skip over the additional lines in future steps
        var linesToSkip : integer = 0;
        var currentStep : integer = 1;                      // To the teacher and user, steps are indexed starting from 1, but our array will use 0 - bear this in mind

        // We need to store tutorial steps in an array, so we need an upper bound
        for (const fileLine of fileLines){
            if(linesToSkip > 0){
                linesToSkip -= 1;
                lineCount += 1;
                continue;
            }

            const truncatedLine : string = fileLine.trim();      // Remove syntactically irrelevant whitespace

            if(readingStep || readingPropertyBlock){
                // Process this line as a property in a block or a block ending
                if(readingStep && (truncatedLine == "}")){
                    readingStep = false;
                } else if(readingPropertyBlock && (truncatedLine == "]")){
                    readingPropertyBlock = false;
                } else {
                    // Handle it as a property
                    var firstColon : integer = truncatedLine.indexOf(":");        // Syntactically, our strings may include a colon; we therefore can't just split the line
                    
                    if(firstColon == -1){
                        // This isn't a property - error
                        throw new Error("Step block contains non-property line at line " + lineCount);
                    }

                    const propertyName : string = truncatedLine.slice(0, firstColon).trim();
                    var propertyContents : string = truncatedLine.slice(firstColon + 1, truncatedLine.length).trim();

                    // Now, we can only conclude if our contents terminate with a semicolon - if not, we add on the next line's contents until we find one
                    var currentRealLine : integer = lineCount;
                    while(propertyContents.charAt(propertyContents.length - 1) != ";"){
                        if(currentRealLine >= fileLines.length){
                            throw new Error("Property string starting on line " + lineCount + " did not terminate before end of file");
                        }
                        propertyContents = propertyContents + " " + fileLines[currentRealLine];
                        currentRealLine += 1;
                    }

                    // We want to remove the semi-colon from the end
                    var realContents : string = propertyContents.slice(0, propertyContents.length - 1);

                    if(readingPropertyBlock){
                        this.#setTutorialProperty(propertyName, realContents);
                    } else {
                        // We must be setting a step property
                        this.#setProperty(propertyName, realContents, currentStep - 1);
                    }
                }
            } else {
                // Are we beginning a block?
                const terminatingChar = truncatedLine.charAt(truncatedLine.length - 1)
                if(terminatingChar == "{" || terminatingChar == "["){
                    const blockBeginningParts = truncatedLine.split(" ");

                    if(blockBeginningParts.length != 2){
                        throw new Error("Tutorial file contains malformed block beginning at line" + lineCount);
                    }

                    if(blockBeginningParts[0] == "TutorialProperties" || terminatingChar == "["){
                        if(!(blockBeginningParts[0] == "TutorialProperties" && terminatingChar == "[")){
                            throw new Error("Expected properties block beginning at line " + lineCount);
                        }

                        // Start of a properties block
                        readingPropertyBlock = true;
                        continue;
                    }

                    // The step number is placed before the curly bracket
                    var stepNum : integer = parseInt(blockBeginningParts[0]);
                    readingStep = true;
                    
                    if(isNaN(stepNum)){
                        // Our step number must be a number
                        throw new Error("Step block begun with non-integer on line " + lineCount);
                    }

                    this.#steps[stepNum - 1] = {
                        _id: "" + stepNum,
                        
                        name: this.#tutorialName,
                        icon: {_type: "simpleImage", asset: this.#tutorialIconPath},
                        author: this.#tutorialAuthor,

                        stepTitle: "nil",
                        content: "",
                        hasHint: false,
                        hint: "nil",

                        language: "en",
                        slug: {_type: "slug", current: "step-" + stepNum},      // This is a temporary value until the end of the parsing stage

                        // These will be set at the end as appropriate
                        hasNextSection: false,
                        nextSection: { _type: "slug", current: "nil" },
                        hasPrevSection: false,
                        prevSection: { _type: "slug", current: "nil"},
                        
                        compatibility: ["microbitV1", "microbitV2"],
                    };

                    currentStep = stepNum;
                } else if(truncatedLine != "") {
                    throw new Error("Tutorial file contains line not beginning a block outside of a block at line " + lineCount);
                }
            }

            lineCount += 1;
        }

        // Now we need to link the list before returning
        this.#linkList();

        const returnVal = [...this.#steps];         // Copy the array before returning it so the object may be reused
        this.#steps = [];
        return returnVal;
    }

}