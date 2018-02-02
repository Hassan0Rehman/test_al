function getIndicesOf(searchStr: string, str: string) {
  const searchStrLen = searchStr.length;
  if (searchStrLen == 0) {
    return [];
  }
  let startIndex = 0, index;
  const indices = [];
  while ((index = str.indexOf(searchStr, startIndex)) > -1) {
    indices.push(index);
    startIndex = index + searchStrLen;
  }
  return indices;
}

function getNormalizedString(srcString: string) {
  const prvString = srcString.replace(/\n/g, " ");
  const aTagIndices = getIndicesOf("{{link ", srcString);

  if (aTagIndices.length > 0) {
    for (let i = 0; i < aTagIndices.length; i++) {
      const aTagEndIndex = srcString.indexOf("}}", aTagIndices[i]) + 2;
      console.log(aTagEndIndex);
      const aToken = srcString.substring(aTagIndices[i], aTagEndIndex);
      const token = aToken.substring(6, aToken.length - 2);
      const args = token.split("++");
      //   const aElem = "<a href='"+args[0].trim()+"' target='_blank'>"+args[1].trim()+"</a>";
      //   prvString = prvString.replace(aToken, aElem);
    }
  }
  return prvString;
}

function resolve_Iframe_Blockqoute(srcString: string) {
  let finalString = srcString;
  if (srcString.includes("<blockquote")) {
    const Blockqoute_start_TagIndices = getIndicesOf("<blockquote", srcString);
    const Blockqoute_end_TagIndices = getIndicesOf("/blockquote>", srcString);
    if (Blockqoute_start_TagIndices.length > 0) {
      for (let i = 0; i < Blockqoute_start_TagIndices.length; i++) {
        const a = Blockqoute_start_TagIndices[i];
        const startIndex = srcString.substring(a, Blockqoute_end_TagIndices[i] + 11);
        const tempStr = "{{blockQoute " + startIndex + " }}";
        finalString = finalString.replace(startIndex, tempStr);
      }
    }
  }
  else if (srcString.includes("<iframe")) {
    const Blockqoute_start_TagIndices = getIndicesOf("<iframe", srcString);
    const Blockqoute_end_TagIndices = getIndicesOf("/iframe>", srcString);
    if (Blockqoute_start_TagIndices.length > 0) {
      for (let i = 0; i < Blockqoute_start_TagIndices.length; i++) {
        const a = Blockqoute_start_TagIndices[i];
        const startIndex = srcString.substring(a, Blockqoute_end_TagIndices[i] + 9);
        const tempStr = "{{iFrame " + startIndex + " }}";
        finalString = finalString.replace(startIndex, tempStr);
      }
    }
  }
  return finalString;
}

export default <any>{
  getIndicesOf: getIndicesOf,
  getNormalizedString: getNormalizedString,
  resolve_Iframe_Blockqoute: resolve_Iframe_Blockqoute
};
