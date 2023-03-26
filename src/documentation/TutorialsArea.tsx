/**
 * (c) 2021-2022, Micro:bit Educational Foundation and contributors
 *
 * SPDX-License-Identifier: MIT
 * 
 * Note this is based off IdeasArea.tsx
 */
import { Text } from "@chakra-ui/layout";
import { FormattedMessage } from "react-intl";
import TutorialsDocumentation from "./tutorials/TutorialsDocumentation";
import Spinner from "../common/Spinner";
import { useDocumentation } from "./documentation-hooks";
import { generateTestTutorials } from "./tutorials/content";

const TutorialsArea = () => {
  const tutorials = generateTestTutorials("en");
  return <TutorialsDocumentation tutorials = {tutorials}/>
};

export default TutorialsArea;
