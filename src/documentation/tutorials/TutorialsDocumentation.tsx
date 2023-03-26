/**
 * (c) 2021-2022, Micro:bit Educational Foundation and contributors
 *
 * SPDX-License-Identifier: MIT
 * 
 * Note this is based off ideas/IdeasDOcumentation.tsx
 */
import { Link, Stack, Text } from "@chakra-ui/layout";
import { Image, SimpleGrid } from "@chakra-ui/react";
import { ReactNode, useCallback, useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import AreaHeading from "../../common/AreaHeading";
import { docStyles } from "../../common/documentation-styles";
import HeadedScrollablePanel from "../../common/HeadedScrollablePanel";
import { getAspectRatio, imageUrlBuilder } from "../../common/imageUrlBuilder";
import { useResizeObserverContentRect } from "../../common/use-resize-observer";
import { Anchor, useRouterTabSlug } from "../../router-hooks";
import { useAnimationDirection } from "../common/documentation-animation-hooks";
import DocumentationBreadcrumbHeading from "../common/DocumentationBreadcrumbHeading";
import DocumentationContent, {
  DocumentationContextProvider,
} from "../common/DocumentationContent";
import { isV2Only } from "../common/model";
import TutorialCard from "./TutorialCard";
import { Tutorial } from "./model";
import DocumentationHeading from "../common/DocumentationHeading";

interface TutorialsDocumentationProps {
    tutorials: Tutorial[];
}

const TutorialsDocumentation = ({ tutorials }: TutorialsDocumentationProps) => {
  

  const [anchor, setAnchor] = useRouterTabSlug("tutorials");
  const direction = useAnimationDirection(anchor);
  const tutorialId = anchor?.id; //1 ??
  const handleNavigate = useCallback(
    (tutorialId: string | undefined) => {
      setAnchor(tutorialId ? { id: tutorialId } : undefined, "documentation-user");
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
      direction={direction}
    />
  );
};

interface ActiveLevelProps extends TutorialsDocumentationProps {
  anchor: Anchor | undefined;
  tutorialId: string | undefined;
  onNavigate: (tutorialId: string | undefined) => void;
  direction: "forward" | "back" | "none";
}

const ActiveLevel = ({
  tutorialId,
  onNavigate,
  tutorials,
  direction,
}: ActiveLevelProps) => {
  //We genrerate starterTutorials by filtering tutorials and removing all which are not the start of a linked list of Tutorial instances
  const starterTutorials = tutorials.filter(tutorial => ! tutorial.hasPrevSection)
    //We only show starterTutorials in the menu

  const activeTutorial = tutorials.find((tutorial) => tutorial.slug.current === tutorialId); //finds a tutorial whose slug matches our tutorialID variable
  const intl = useIntl();
  const headingString = intl.formatMessage({ id: "tutorials-tab" });
  const ref = useRef<HTMLDivElement>(null);
  const contentRect = useResizeObserverContentRect(ref);
  const contentWidth = contentRect?.width ?? 0;
  const numCols =
    !contentWidth || contentWidth > 1100 ? 3 : contentWidth > 550 ? 2 : 1;

  if (activeTutorial) { //this runs if there is currently a tutorial that is open right now
    var back = "Back";
    var next = "Next";


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
        <SimpleGrid columns={2} spacing={5} p={5} ref={ref} >
          <DocumentationHeading
            textAlign="center"
            px={2.5}
            pb={2}
            name={back}
            isV2Only={false}
            onClick={() => {if (activeTutorial.hasPrevSection) onNavigate(activeTutorial.prevSection!.current)}}
            hidden = {! activeTutorial.hasPrevSection}

            cursor="pointer"
            background="brand.500"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"

          />

          <DocumentationHeading
            textAlign="center"
            px={2.5}
            pb={2}
            name={next}
            isV2Only={false}
            onClick={() => {if (activeTutorial.hasNextSection) onNavigate(activeTutorial.nextSection!.current)}}
            hidden = {! activeTutorial.hasNextSection}

            cursor="pointer"
            background="brand.500"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
          />
        </SimpleGrid>
      </HeadedScrollablePanel>
    );
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
        {starterTutorials.map((tutorial) => (
          <TutorialCard
            key={tutorial.name}
            name={tutorial.name}
            isV2Only={isV2Only(tutorial)}
            image={tutorial.icon}
            onClick={() => onNavigate(tutorial.slug.current)}
          />
        ))}
      </SimpleGrid>
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
