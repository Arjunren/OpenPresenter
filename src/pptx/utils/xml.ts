export function parseXml(xmlString: string): Document {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'application/xml');
  const errorNode = doc.querySelector('parsererror');
  if (errorNode) {
    throw new Error('XML parsing error: ' + errorNode.textContent);
  }
  return doc;
}

export function getXmlAttribute(node: Element, attrName: string): string | null {
  return node.getAttribute(attrName);
}
