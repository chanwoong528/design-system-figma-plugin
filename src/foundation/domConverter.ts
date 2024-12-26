interface DomConverterProps {
  markupType: string;
  children: DomConverterProps[];
}

export const domConverter = (
  comp: ComponentNode,
  tagType: string,
): DomConverterProps | undefined => {
  if (!comp) return;

  const tag = utilTagConverter(tagType.toLowerCase());
  if (comp.children && comp.children.length > 0) {
    return {
      markupType: tag,
      children: comp.children
        .map((child) =>
          domConverter(child as ComponentNode, child.type.toLowerCase()),
        )
        .filter((child): child is DomConverterProps => child !== undefined),
    };
  }

  return {
    markupType: tag,
    children: [],
  };
};

const utilTagConverter = (key: string): string => {
  const tags: { [key: string]: string } = {
    button: "button",
    btns: "button",
    instance: "img",
    text: "span",
  };

  if (!tags[key]) {
    const targetSimilar = Object.keys(tags).find(
      (tag) => tag.includes(key) || key.includes(tag),
    );
    return targetSimilar ? tags[targetSimilar] : "div";
  }

  return tags[key];
};
