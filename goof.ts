const extractReplacePreCode = (potentialHtml: string = '') => {
  const begTagIndex = potentialHtml.search(/<pre>.*<code>/);
  const endTagIndex = potentialHtml.search('</pre>.*</code>');
  if (begTagIndex == -1 || endTagIndex == -1) {
    return potentialHtml;
  }

  return (
    potentialHtml.substring(0, begTagIndex) +
    potentialHtml.substring(begTagIndex + '<pre><code>'.length, endTagIndex) +
    potentialHtml.substring(endTagIndex + '</pre></code>'.length)
  );
};
[
  '<pre><code></pre></code>',
  '<pre><code>it is something</pre></code>',
  'text before <pre><code>it is something</pre></code> text after',
  '<pre><code>space between end tags</pre> </code>',
  '<pre><code>Missing end pre </code>',
  '<pre><code>Missing beg code </code>',
].forEach((str) => {
  console.log({
    str,
    extractReplacePreCode: extractReplacePreCode(str),
  });
});

console.log('Hello World');
