/**
 * (c) 2021, Micro:bit Educational Foundation and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import {
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
  } from "@chakra-ui/form-control";
  import { Input } from "@chakra-ui/input";
  import { Text } from "@chakra-ui/react";
  import { ReactNode, useEffect, useRef } from "react";
  import { FormattedMessage } from "react-intl";
  import { InputDialogBody } from "../../common/InputDialog";
  
  interface NewTutorialQuestionProps extends InputDialogBody<string> {}
  
  const NewTutorialQuestion = ({
    validationResult,
    value,
    setValidationResult,
    setValue,
    validate,
  }: NewTutorialQuestionProps) => {
    const ref = useRef<HTMLInputElement>(null);
    useEffect(() => {
      if (ref.current) {
        ref.current.focus();
      }
    }, []);
    return (
      <FormControl id="tutorialName" isRequired isInvalid={!validationResult.ok}>
        <FormLabel>
          <FormattedMessage id="name-text" />
        </FormLabel>
        <Input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => {
            const value = e.target.value;
            setValue(value);
            setValidationResult(validate(value));
          }}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        ></Input>
        {validationResult.message && !validationResult.ok && (
          <FormErrorMessage>{validationResult.message}</FormErrorMessage>
        )}
        {validationResult.message && validationResult.ok && (
          // FormErrorMessage does not display when the field is valid so we need
          // an equivalent for warning feedback.
          <Text
            id="fileName-feedback"
            aria-live="polite"
            fontSize="sm"
            color="red.500"
            lineHeight="normal"
            mt={2}
          >
            {validationResult.message}
          </Text>
        )}
      </FormControl>
    );
  };
  
  export default NewTutorialQuestion;
  