import { put, del } from "@vercel/blob";

export async function uploadMarkdown(
  path: string,
  content: string
): Promise<string> {
  const blob = await put(path, content, {
    access: "public",
    contentType: "text/markdown",
  });
  return blob.url;
}

export async function deleteBlob(url: string): Promise<void> {
  await del(url);
}
