import { NewsItem } from "@/services/emailService";

// src/utils/tldr.ts
export function generateTLDR(newsItems: NewsItem[]): string {
  return newsItems.map(item => item.title).join(' | ').slice(0, 280);
}