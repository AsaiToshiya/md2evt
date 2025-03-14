const matter = require("gray-matter");
const { parseReferences } = require("nostr-tools/references");

const addressToTag = ({ identifier, pubkey, kind, relays }) => [
  "a",
  `${kind}:${pubkey}:${identifier}`,
  ...(relays?.[0] ? [relays?.[0]] : []),
];

const eventToTag = ({ id, relays, author }) => [
  "e",
  id,
  ...(relays?.[0]
    ? author
      ? [relays?.[0], author]
      : [relays?.[0]]
    : author
    ? ["", author]
    : []),
];

const markdownToEvent = (markdown, identifier) => {
  const { data, content } = matter(markdown);

  const tags = [
    ["d", identifier],
    ...Object.keys(data).map((key) => [key, data[key].toString()]),
    ...parseReferences({ content })
      .filter(({ event, address }) => event || address)
      .map(({ event, address }) =>
        event ? eventToTag(event) : addressToTag(address)
      ),
  ];

  return { kind: 30023, tags, content };
};

module.exports = { markdownToEvent };
