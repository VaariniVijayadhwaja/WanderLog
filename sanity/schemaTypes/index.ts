import { type SchemaTypeDefinition } from "sanity";

import { author } from "@/sanity/schemaTypes/author";
import { travelblogs } from "@/sanity/schemaTypes/travelblogs";
// import { playlist } from "@/sanity/schemaTypes/playlist";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [author,travelblogs],
};