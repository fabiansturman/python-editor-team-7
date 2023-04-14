/**
 * (c) 2021-2022, Micro:bit Educational Foundation and contributors
 *
 * SPDX-License-Identifier: MIT
 *
 * Note this is based off ideas/content.ts, but for now only returns two hardcoded tutorials for testing
 */
import { Tutorial } from "./model";
import "./styles.css";

export const generateTestTutorials = (languageId: string): Tutorial[] => {
  const tute1a: Tutorial = {
    _id: "1a",
    name: "Tutorial 1",
    icon: {
      _type: "simpleImage",
      asset: "image-5dd9b5a5f02940ee7f8e21d25b9b51516ae09ec8-800x399-png",
    },
    author: "Fabian",

    stepTitle: "starting off: 1/3",
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,

    hasHint: false,
    language: "en",
    slug: { _type: "slug", current: "tutorial-1a" },

    hasNextSection: true,
    nextSection: { _type: "slug", current: "tutorial-1b" },
    hasPrevSection: false,

    compatibility: ["microbitV1", "microbitV2"],
  };

  const tute1b: Tutorial = {
    _id: "1b",
    name: "Tutorial 1",
    icon: {
      _type: "simpleImage",
      asset: "image-5dd9b5a5f02940ee7f8e21d25b9b51516ae09ec8-800x399-png",
    },
    author: "Fabian",

    stepTitle: "in the middle: 2/3",
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    hasHint: true,
    hint: "of course you are, cheeky",

    language: "en",
    slug: { _type: "slug", current: "tutorial-1b" },

    hasNextSection: true,
    nextSection: { _type: "slug", current: "tutorial-1c" },
    hasPrevSection: true,
    prevSection: { _type: "slug", current: "tutorial-1a" },

    compatibility: ["microbitV1", "microbitV2"],
  };

  const tute1c: Tutorial = {
    _id: "1c",
    name: "Tutorial 1",
    icon: {
      _type: "simpleImage",
      asset: "image-5dd9b5a5f02940ee7f8e21d25b9b51516ae09ec8-800x399-png",
    },
    author: "Fabian",

    stepTitle: "last step! : 3/3",
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    hasHint: false,

    language: "en",
    slug: { _type: "slug", current: "tutorial-1c" },

    hasNextSection: false,
    hasPrevSection: true,
    prevSection: { _type: "slug", current: "tutorial-1b" },

    compatibility: ["microbitV1", "microbitV2"],
  };

  const tute2a: Tutorial = {
    _id: "2a",
    name: "Tutorial 2",
    icon: {
      _type: "simpleImage",
      asset: "image-09a0de4a9ed72dc1c1cee28e4981672e24bafdff-800x400-png",
    },
    author: "Fabian",

    stepTitle: "starting off: 1/1",
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    hasHint: false,

    language: "en",
    slug: { _type: "slug", current: "tutorial-2a" },

    hasNextSection: false,
    nextSection: { _type: "slug", current: "tutorial-2b" },
    hasPrevSection: false,

    compatibility: ["microbitV1", "microbitV2"],
  };

  return [tute1a, tute1b, tute1c, tute2a]; //add tute 2 to this array once I have one tute showing
};
