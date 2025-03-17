#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { markdownToEvent } = require("./md2evt");

const filePath = process.argv[2];
const markdown = fs.readFileSync(filePath, "utf8");
const identifier = path
  .parse(filePath)
  .name.toLowerCase()
  .replace(/[^a-z0-9-]+/g, "-")
  .replace(/-+/g, "-")
  .replace(/^-+|-+$/g, "");

try {
  const event = markdownToEvent(markdown, identifier);
  const json = JSON.stringify(event, null, 2);
  console.log(json);
} catch (error) {
  console.error("error:", error.message);
}
