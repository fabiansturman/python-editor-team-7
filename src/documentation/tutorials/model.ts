/**
 * (c) 2021-2022, Micro:bit Educational Foundation and contributors
 *
 * SPDX-License-Identifier: MIT
 * 
 * Note this is based off ideas/model.ts
 */

import { PortableText, SimpleImage, Slug } from "../../common/sanity";
import { HasCompatibility } from "../common/model";


//Each step of a tutorial is an instance of Tutorial, and an entire tutorial a linked list of 'Tutorial's
//(may be a good idea to rename the concept of a sequence of tutorial steps into a lesson, to remove confusion?)

export interface Tutorial extends HasCompatibility {
  _id: string;
  name: string; //this is the name of the whole tutorial; shared across all parts of the tutorial
  icon: SimpleImage;
  author: string;

  stepTitle: string;//this is the name of the specific tutorial step we are currently on
  content: string;//the core content of this tutorial step
  hasHint: boolean;//inv: 'hint' is undefined iff !hasHint
  hint? : string;//optional hint for this step of the tutorial

  language: string;
  slug: Slug;

  hasNextSection: boolean; //inv: 'nextSection' undefined iff !hasNextSection
  nextSection ?: Slug;
  hasPrevSection: boolean; //inv: 'nextSection' undefined iff !hasNextSection
  prevSection ?: Slug;
}
