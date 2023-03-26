/**
 * (c) 2021-2022, Micro:bit Educational Foundation and contributors
 *
 * SPDX-License-Identifier: MIT
 * 
 * Note this is based off ideas/content.ts, but for now only returns two hardcoded tutorials for testing
 */
import { fetchContent } from "../../common/sanity";
import { Tutorial } from "./model";

export const generateTestTutorials = (languageId: string): Tutorial[] =>
  {
    const tute1a: Tutorial = {
      _id: "1a",
      name: "Tutorial 1",
      icon: { _type: "simpleImage", asset: "image-5dd9b5a5f02940ee7f8e21d25b9b51516ae09ec8-800x399-png" },
      author: "Fabian",

      stepTitle: "starting off: 1/3",
      content:"hiya",
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
      icon: { _type: "simpleImage", asset: "image-5dd9b5a5f02940ee7f8e21d25b9b51516ae09ec8-800x399-png" },
      author: "Fabian",

      stepTitle: "in the middle: 2/3",
      content:"hope ur having fun",
      hasHint: true,
      hint: "of course you are, cheeky",
      
      language: "en",
      slug: { _type: "slug", current: "tutorial-1b" },
      
      hasNextSection: true,
      nextSection: { _type: "slug", current: "tutorial-1c" },
      hasPrevSection: true,
      prevSection: { _type: "slug", current: "tutorial-1a"},
      
      compatibility: ["microbitV1", "microbitV2"],
    };

    const tute1c: Tutorial = {
      _id: "1c",
      name: "Tutorial 1",
      icon: { _type: "simpleImage", asset: "image-5dd9b5a5f02940ee7f8e21d25b9b51516ae09ec8-800x399-png" },
      author: "Fabian",

      stepTitle: "last step! : 3/3",
      content:"woohoo we're almost done",
      hasHint: false,
      
      language: "en",
      slug: { _type: "slug", current: "tutorial-1c" },
      
      hasNextSection: false,
      hasPrevSection: true,
      prevSection: { _type: "slug", current: "tutorial-1b"},
      
      compatibility: ["microbitV1", "microbitV2"],
    };

    const tute2a: Tutorial = {
      _id: "2a",
      name: "Tutorial 2",
      icon: { _type: "simpleImage", asset: "image-09a0de4a9ed72dc1c1cee28e4981672e24bafdff-800x400-png" },
      author: "Fabian",

      stepTitle: "starting off: 1/2",
      content:"hiya",
      hasHint: false,
      
      language: "en",
      slug: { _type: "slug", current: "tutorial-2a" },
      
      hasNextSection: true,
      nextSection: { _type: "slug", current: "tutorial-2b" },
      hasPrevSection: false,
      
      compatibility: ["microbitV1", "microbitV2"],
    };

    const tute2b: Tutorial = {
      _id: "2b",
      name: "Tutorial 2",
      icon: { _type: "simpleImage", asset: "image-09a0de4a9ed72dc1c1cee28e4981672e24bafdff-800x400-png" },
      author: "Fabian",

      stepTitle: "done already! yay!: 2/2",
      content:"hope ur having fun",
      hasHint: true,
      hint: "of course you are, cheeky",
      
      language: "en",
      slug: { _type: "slug", current: "tutorial-2b" },
      
      hasNextSection: false,
      hasPrevSection: true,
      prevSection: { _type: "slug", current: "tutorial-2a"},
      
      compatibility: ["microbitV1", "microbitV2"],
    };


    return [tute1a, tute1b, tute1c, tute2a, tute2b]; //add tute 2 to this array once I have one tute showing
  }
