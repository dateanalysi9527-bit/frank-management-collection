import type { Metadata } from "next";
import CollectionPage from "./CollectionPage";

export const metadata: Metadata = {
  title: "Frank分享经管知识合集",
  description: "36 篇关于经营分析、管理认知与 AI 转型的精选公众号文章。",
};

export default function Home() {
  return <CollectionPage />;
}
