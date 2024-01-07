import * as prettier from "prettier";
import getAllSubpages from "./getAllSubpages.js";
import insertHtmlSnippet from "./insertHtmlSnippet.ts";

const baseUrl: string = "https://turbulence.berlin";
const subpageUrls: string[] = await getAllSubpages(baseUrl);

const saveSubpage = async (url: string, html: string) => {
  const subdirectory = "output";
  const prettierHtml = await prettier.format(html, { parser: "html" }); 
  const fileName: string = url === baseUrl ? "index.html" : url.replace(baseUrl, ".").concat(".html");
  await Bun.write(subdirectory + "/" + fileName, prettierHtml);
}

const insertBadgeHideScript = async (html: string) => {
  const badgeHideScriptPath = "html-snippets/remove-badge.html";
  const htmlWithBadgeHideScript = await insertHtmlSnippet(html, "endOfBody", badgeHideScriptPath );
  return htmlWithBadgeHideScript;
}

const insertCustomHtmlSnippet = async (html: string) => {
  const customHtmlSnippetPath = "html-snippets/test-custom-code.html";
  const htmlWithCustomHtmlSnippet = await insertHtmlSnippet(
    html,
    "replacingAnotherElement",
    customHtmlSnippetPath,
    "test-custom-code"
  );
  return htmlWithCustomHtmlSnippet;
}

for (const url of subpageUrls) {
  const response = await fetch(url);
  let html: string = await response.text();
  html = await insertBadgeHideScript(html);
  html = await insertCustomHtmlSnippet(html);
  saveSubpage(url, html);
}

