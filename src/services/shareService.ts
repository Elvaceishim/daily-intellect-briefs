// src/services/shareService.ts
import { v4 as uuidv4 } from 'uuid';
// Import or define the Brief type
// Define Brief type here if the module does not exist
export type Brief = {
  // Add the properties of Brief as needed, for example:
  id: string;
  title: string;
  content: string;
};
// import type { Brief } from '../types/brief'; // Adjust the path as needed

export function createShareableBrief(brief: Brief) {
  const token = uuidv4();
  // Save { token, brief } to your DB
  return `${process.env.VITE_SITE_URL}/share/${token}`;
}