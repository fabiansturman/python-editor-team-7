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
import { Editable, EditableInput, EditableTextarea, EditablePreview, Container, Box } from '@chakra-ui/react';
import { useDocumentation } from "./documentation-hooks";
import { Tutorial } from "./tutorials/model";
import { generateTutorials } from "./tutorials/TutorialsDocumentation";
import { generateTestTutorials } from "./tutorials/content";
import { useState } from 'react';


const TutorialsArea = () => {
  const tutorials = generateTestTutorials("en").concat(generateTutorials);
  return <TutorialsDocumentation tutorials = {tutorials}/>
};

export default TutorialsArea;
