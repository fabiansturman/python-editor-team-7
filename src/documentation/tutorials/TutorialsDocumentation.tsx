/**
 * (c) 2021-2022, Micro:bit Educational Foundation and contributors
 *
 * SPDX-License-Identifier: MIT
 *
 * Note this is based off ideas/IdeasDOcumentation.tsx
 */
import { Link, Stack, Text } from "@chakra-ui/layout";
import { Button, Input, SimpleGrid, Heading, Checkbox } from "@chakra-ui/react";
import { ReactNode, useCallback, useRef, useState } from "react";
import { RiFileAddLine, RiFolderOpenLine } from "react-icons/ri";
import { FormattedMessage, useIntl } from "react-intl";
import { integer } from "vscode-languageserver-protocol";
import AreaHeading from "../../common/AreaHeading";
import { docStyles } from "../../common/documentation-styles";
import HeadedScrollablePanel from "../../common/HeadedScrollablePanel";
import { useResizeObserverContentRect } from "../../common/use-resize-observer";
import { Anchor, useRouterTabSlug } from "../../router-hooks";
import { useAnimationDirection } from "../common/documentation-animation-hooks";
import DocumentationBreadcrumbHeading from "../common/DocumentationBreadcrumbHeading";
import {
  DocumentationContextProvider
} from "../common/DocumentationContent";
import { isV2Only } from "../common/model";
import { generateTestTutorials } from "./content";
import Editor, { startContent } from "./Editor";
import { Tutorial } from "./model";
import { Parser } from "./parser/parser";
import TutorialCard from "./TutorialCard";

const TutorialsDocumentation = () => {
  const [tutorials, setTutorials] = useState(generateTestTutorials("en"));
  const [teacherMode, setTeacherMode] = useState(false);    // Teacher mode determines whether editing is available or not
  const [countTutorials, setCountTutorials] = useState(tutorials.length);
  const [anchor, setAnchor] = useRouterTabSlug("tutorials");
  const direction = useAnimationDirection(anchor);
  const tutorialId = anchor?.id; //1 ??
  const handleNavigate = useCallback(
    (tutorialId: string | undefined) => {
      setAnchor(
        tutorialId ? { id: tutorialId } : undefined,
        "documentation-user"
      );
    },
    [setAnchor]
  );

  //the html code returned by this function defines what goes into the tutorials side-panel (either a loaded tutorial or the tutorials menu)
  return (
    <ActiveLevel
      key={anchor ? 0 : 1}
      anchor={anchor}
      tutorialId={tutorialId}
      onNavigate={handleNavigate}
      tutorials={tutorials}
      setTutorials={setTutorials}
      teacherMode={teacherMode}
      setTeacherMode={setTeacherMode}
      countTutorials={countTutorials}
      setCountTutorials={setCountTutorials}
      direction={direction}
    />
  );
};

interface ActiveLevelProps {
  anchor: Anchor | undefined;
  tutorialId: string | undefined;
  onNavigate: (tutorialId: string | undefined) => void;
  direction: "forward" | "back" | "none";
  tutorials: Tutorial[];
  setTutorials: (tutorials: Tutorial[]) => void;
  teacherMode : boolean;
  setTeacherMode: (mode : boolean) => void;
  countTutorials: integer;
  setCountTutorials: (countTutorials: integer) => void;
}

export var active: Tutorial | undefined;

const ActiveLevel = ({
  tutorialId,
  onNavigate,
  tutorials,
  direction,
  setTutorials,
  teacherMode,
  setTeacherMode,
  countTutorials,
  setCountTutorials
}: ActiveLevelProps) => {
  const [name, setName] = useState("");
  //We only show starterTutorials in the menu

  const activeTutorial = tutorials.find(
    (tutorial) => tutorial.slug.current === tutorialId
  ); //finds a tutorial whose slug matches our tutorialID variable
  active = activeTutorial;
  const intl = useIntl();
  const headingString = intl.formatMessage({ id: "tutorials-tab" });
  const ref = useRef<HTMLDivElement>(null);
  const contentRect = useResizeObserverContentRect(ref);
  const contentWidth = contentRect?.width ?? 0;
  const numCols =
    !contentWidth || contentWidth > 1100 ? 3 : contentWidth > 550 ? 2 : 1;
  const [editMode, setEditMode] = useState(false);
  const [tutorialName, setTutorialName] = useState(activeTutorial ? activeTutorial.name : "");
  const [stepName, setStepName] = useState(activeTutorial ? activeTutorial.stepTitle : "");

  if (activeTutorial) {
    //this runs if there is currently a tutorial that is open right now
    startContent(activeTutorial);
    return (
      <HeadedScrollablePanel
        key={activeTutorial.slug.current}
        direction={direction}
        heading={
          <DocumentationBreadcrumbHeading
            parent={headingString}
            title={activeTutorial.name}
            onBack={() => onNavigate(undefined)}
            isV2Only={isV2Only(activeTutorial)}
          />
        }
      >
        {activeTutorial.content && (
          <Stack
            spacing={3}
            fontSize="sm"
            p={5}
            pr={3}
            mt={1}
            mb={1}
            sx={{
              ...docStyles,
            }}
          >
            <DocumentationContextProvider
              parentSlug={activeTutorial.slug.current}
              toolkitType="tutorials"
              title={activeTutorial.name}
            >
              <h2>{activeTutorial.stepTitle}</h2>
              <p>{activeTutorial.content}</p>
            </DocumentationContextProvider>
          </Stack>
        )}

        <SimpleGrid minChildWidth='120px' spacing={2} columns={2} p={2} ref={ref}>
          <Button colorScheme='red' onClick={() => {
              if (activeTutorial.hasPrevSection)
                onNavigate(activeTutorial.prevSection!.current)
            }} disabled={!activeTutorial.hasPrevSection || editMode}>Back</Button>
          
          <Button colorScheme='green' onClick={() => {
              if (activeTutorial.hasNextSection)
                onNavigate(activeTutorial.nextSection!.current);
            }} disabled={!activeTutorial.hasNextSection || editMode}>Next</Button>
          <Button colorScheme='blue' onClick={() => setEditMode(!editMode)} hidden={editMode}>Edit</Button>

          <Button colorScheme='blue' onClick={() => {
            const tutorialSequence = tutorials.filter(t => t.name === activeTutorial.name);
            if (stepName.trim().replace(/\s{1,}/g, " ") !== "") {
              activeTutorial.stepTitle = stepName.trim().replace(/\s{1,}/g, " ");
            }
            if (tutorialName === activeTutorial.name || (tutorialName.trim().replace(/\s{1,}/g, "-") !== "" && !tutorials.find(tutorial => tutorial.name.trim().replace(/\s{1,}/g, "-") === tutorialName.trim(). replace(/\s{1,}/g, "-")))) {
              tutorialSequence.forEach((tutorial) => {
                tutorial.name = tutorialName;
              })
              setEditMode(!editMode);
            }
            else {
              alert("Pick a unique title");
              setTutorialName(activeTutorial.name);
            }
          }} hidden={!editMode}>Save</Button>

          {//Discard button does not work as intended - content still changes
          }
          <Button colorScheme='red' onClick={() => {
              setTutorialName(activeTutorial.name);
              setStepName(activeTutorial.stepTitle);
              setEditMode(!editMode);
            }} hidden={!editMode}>Discard</Button>


          <Button onClick={() => { //add before
            setCountTutorials(countTutorials+1);
            setTutorialName(activeTutorial.name);
            setStepName("New tutorial step");
            const newStep: Tutorial = {
              _id: activeTutorial.name. replace(/\s/g, "-").concat("-", countTutorials.toString()),
              name: activeTutorial.name,
              icon: {
                _type: "simpleImage",
                asset:
                  "image-5dd9b5a5f02940ee7f8e21d25b9b51516ae09ec8-800x399-png",
              },
              author: "Hoa",

              stepTitle: "New tutorial step",
              content: "New tutorial content before what was there before",

              hasHint: false,
              language: "en",
              slug: { _type: "slug", current: activeTutorial.name. replace(/\s/g, "-").concat("-", countTutorials.toString()) },

              nextSection: activeTutorial.slug,
              hasNextSection: true,

              prevSection: activeTutorial.prevSection,
              hasPrevSection: activeTutorial.hasPrevSection,

              compatibility: ["microbitV1", "microbitV2"],
            };
            setTutorials([...tutorials, newStep]);
            if (typeof activeTutorial.prevSection !== 'undefined') {
              const prevTutorial = tutorials.find(tutorial => tutorial.slug.current == activeTutorial.prevSection!.current);
              if (typeof prevTutorial !== 'undefined') {
                prevTutorial!.nextSection = newStep.slug;
                prevTutorial!.hasNextSection = true;
              }
            }
            activeTutorial.prevSection = newStep.slug;
            activeTutorial.hasPrevSection = true;
            onNavigate(newStep.slug.current);

          }} hidden={!editMode}>Add before</Button>

          <Button onClick={() => { //add after
            setCountTutorials(countTutorials+1);
            setTutorialName(activeTutorial.name);
            setStepName("New tutorial step");

            const newStep: Tutorial = {
              _id: activeTutorial.name. replace(/\s/g, "-").concat("-", countTutorials.toString()),
              name: activeTutorial.name,
              icon: {
                _type: "simpleImage",
                asset:
                  "image-5dd9b5a5f02940ee7f8e21d25b9b51516ae09ec8-800x399-png",
              },
              author: "Hoa",

              stepTitle: "New tutorial step",
              content: "New tutorial content after what was there before",

              hasHint: false,
              language: "en",
              slug: { _type: "slug", current: activeTutorial.name. replace(/\s/g, "-").concat("-", countTutorials.toString()) },

              nextSection: activeTutorial.nextSection,
              hasNextSection: activeTutorial.hasNextSection,

              prevSection: activeTutorial.slug,
              hasPrevSection: true,

              compatibility: ["microbitV1", "microbitV2"],
            };
            setTutorials([...tutorials, newStep]);
            if (typeof activeTutorial.nextSection !== 'undefined') {
              const nextTutorial = tutorials.find(tutorial => tutorial.slug.current == activeTutorial.nextSection!.current);
              if (typeof nextTutorial !== 'undefined') {
                nextTutorial.prevSection = newStep.slug;
                nextTutorial.hasPrevSection = true;
            }}
            activeTutorial.nextSection = newStep.slug;
            activeTutorial.hasNextSection = true;
            onNavigate(newStep.slug.current);

          }} hidden={!editMode}>Add after</Button>
          
          <Button onClick={() => { //delete
            setTutorials(tutorials.filter(t => t !== activeTutorial));
            if (typeof activeTutorial.prevSection !== 'undefined') { //prev section exists
              if (typeof activeTutorial.nextSection !== 'undefined') { //next section exists
                const prevTutorial = tutorials.find(tutorial => tutorial.slug.current == activeTutorial.prevSection!.current);
                if (typeof prevTutorial !== 'undefined') {
                  prevTutorial.nextSection = activeTutorial.nextSection;
                  const nextTutorial = tutorials.find(tutorial => tutorial.slug.current == activeTutorial.nextSection!.current);
                  if (typeof nextTutorial !== 'undefined') {
                    nextTutorial.prevSection = activeTutorial.prevSection;
                    onNavigate(activeTutorial.nextSection!.current);
                  }
                }
              }
              else { //next section does not exist
                const prevTutorial = tutorials.find(tutorial => tutorial.slug.current == activeTutorial.prevSection!.current);
                if (typeof prevTutorial !== 'undefined') {
                  prevTutorial.nextSection = undefined;
                  prevTutorial.hasNextSection = false;
                  onNavigate(activeTutorial.prevSection!.current);
                }
              }
            }
            else { //prev section does not exist
              if (typeof activeTutorial.nextSection !== 'undefined') { //next section exists
                const nextTutorial = tutorials.find(tutorial => tutorial.slug.current === activeTutorial.nextSection!.current);
                if (typeof nextTutorial !== 'undefined') {
                  nextTutorial.prevSection = undefined;
                  nextTutorial.hasPrevSection = false;
                  onNavigate(activeTutorial.nextSection!.current);
                }
              }
              else { //next section does not exist
                onNavigate('/tutorials');
              }
            }
          }
          } hidden={!editMode}>Delete</Button>
          <Button onClick={() => { // Download
            const allTutorialSteps : Tutorial[] = tutorials.filter(t => t.name == activeTutorial.name);
            var outputStr : string = "TutorialProperties [\n    TutorialName: " + activeTutorial.name + ";\n    Icon: " + activeTutorial.icon.asset + ";\n    Author: " + activeTutorial.author + ";\n]\n";
            
            // We need to find the start of the linked list by tracing back through it
            var startTutorialObject : Tutorial = activeTutorial;
            while(startTutorialObject.hasPrevSection){
              // @ts-ignore
              startTutorialObject = tutorials.find(t => t.slug.current = startTutorialObject.prevSection!.current);
            }

            var currentStepNum : integer = 1;
            var currentTutorial = startTutorialObject;
            var endReached = false;
            while(!endReached){
              outputStr = outputStr + currentStepNum + " {\n    StepTitle: " + currentTutorial.stepTitle + ";\n    Contents: " + currentTutorial.content + ";\n}\n";
              if(typeof currentTutorial.nextSection == 'undefined'){
                endReached = true;
              } else {
                // @ts-ignore
                currentTutorial = tutorials.find(t => t.slug.current == currentTutorial.nextSection!.current);
              }
              currentStepNum += 1;
            }

            var linkElement = document.createElement("a");
            linkElement.href = "data:text/plain;charset=utf-8," + encodeURIComponent(outputStr);
            linkElement.download = activeTutorial.name + ".nim";
            linkElement.click();
          }
          } hidden={!editMode}>Download as NIM</Button>
        </SimpleGrid>
        {editMode && <>
          <Heading size="md">Change title</Heading>
          <Input value={tutorialName} onChange={(e) => setTutorialName(e.target.value)}  />
          <Heading size="md">Change step title</Heading>
          <Input value={stepName} onChange={(e) => setStepName(e.target.value)}  />
          <Heading size="md">Change content</Heading>
          <Editor />
        </>} 
      </HeadedScrollablePanel>
    );
  }

  // Helper function for the teacher mode checkbox
  const handleTeacherCheckboxChange = () => {
    setTeacherMode(!teacherMode);
  }

  //We do the following 'return' if no tutorial is open right now, i.e. we are on the 'tutorials' menu
  return (
    <HeadedScrollablePanel
      direction={direction}
      heading={
        <AreaHeading
          name={headingString}
          description={intl.formatMessage({ id: "tutorials-tab-description" })}
        />
      }
    >
      <SimpleGrid columns={numCols} spacing={5} p={5} ref={ref}>
        {/* We genrerate starterTutorials by filtering tutorials and removing all which are not the start of a linked list of Tutorial instances */}
        {tutorials
          .filter((tutorial) => !tutorial.hasPrevSection)
          .map((tutorial) => (
            <TutorialCard
              key={tutorial.name}
              name={tutorial.name}
              isV2Only={isV2Only(tutorial)}
              image={tutorial.icon}
              onClick={() => {
                onNavigate(tutorial.slug.current);
              }}
            />
          ))}
      </SimpleGrid>
      <SimpleGrid columns={1} p={2} spacing={2}>
        <Input hidden={!teacherMode} value={name} onChange={(e) => setName(e.target.value)} placeholder='Enter new tutorial name' />
        <Button hidden={!teacherMode} leftIcon={<RiFileAddLine />}
          onClick={() => {
            if (name.trim(). replace(/\s{1,}/g, "-") !== '' && typeof tutorials.find(tutorial => tutorial._id.trim(). replace(/\s{1,}/g, "-") === name.trim().replace(/\s{1,}/g, "-") + "-1") == 'undefined' && typeof tutorials.find(tutorial => tutorial.name.trim(). replace(/\s{1,}/g, "-") == name.trim(). replace(/\s{1,}/g, "-")) === "undefined") {
              const newTutorial: Tutorial = {
                _id: name.trim().replace(/\s{1,}/g, "-"),
                name: name.trim().replace(/\s{1,}/g, " "),
                icon: {
                  _type: "simpleImage",
                  asset:
                    "image-5dd9b5a5f02940ee7f8e21d25b9b51516ae09ec8-800x399-png",
                },
                author: "Hoa",

                stepTitle: "New tutorial step",
                content: "New tutorial content",

                hasHint: false,
                language: "en",
                slug: { _type: "slug", current: name.trim().replace(/\s{1,}/g, "-")},

                hasNextSection: false,
                hasPrevSection: false,

                compatibility: ["microbitV1", "microbitV2"],
              };
              setTutorials([...tutorials, newTutorial]);
              setName('');
          }
          else alert("Pick unique title")
        }}
        >
          Add new tutorial
        </Button>
        <Button leftIcon={<RiFolderOpenLine />}
          onClick={() => {
            var inputObj : HTMLInputElement = document.createElement("input");

            inputObj.type = "file";
            inputObj.accept = ".nim";
            inputObj.click();

            function onInputAdded(){
              if(inputObj.files != null){
                if(inputObj.files.length > 0){
                  var tutorialReader : FileReader = new FileReader();
                  tutorialReader.readAsText(inputObj.files[0]);
                  
                  tutorialReader.onload = function(){var tutorialParser = new Parser();
                    var tutorialArray : Tutorial[];
                    try {
                      // @ts-ignore
                      tutorialArray = tutorialParser.parse(tutorialReader.result);

                      setTutorials([...tutorials, ...tutorialArray]);
                      setName('');
                    } catch (err) {
                      alert("The tutorial file contained invalid syntax. (" + err + ")")
                      return
                    }
                  }
                }
              }
            }

            inputObj.addEventListener("change", onInputAdded);
        }}
        >
          Upload tutorial file
        </Button>
      </SimpleGrid>
      
      <Checkbox px={5} color="brand.500" verticalAlign="true" type="checkbox" defaultChecked={teacherMode} onChange={handleTeacherCheckboxChange}>
        <label>Teacher mode</label>
      </Checkbox>
      <Text pb={8} px={5}>
        <FormattedMessage
          id="about-tutorials"
          values={{
            link: (chunks: ReactNode) => (
              <Link
                color="brand.500"
                href="https://youtu.be/dQw4w9WgXcQ"
                target="_blank"
                rel="noopener"
              >
                {chunks}
              </Link>
            ),
          }}
        />
      </Text>
    </HeadedScrollablePanel>
  );
};

export default TutorialsDocumentation;
