import { covertJsonToCss } from "./cssConverter";
import { domConverter } from "./domConverter";

type CssProps = Record<string, string>;

interface StateCssProps {
  [colorOrType: string]: {
    [state: string]: {
      cssProps: CssProps;
    };
  };
}

function parseComponentSet(sectionNode: SectionNode): ComponentSetNode[] {
  const btnComponetSetList = sectionNode.children.filter(
    (item) => item.type === "COMPONENT_SET",
  ) as ComponentSetNode[];

  return btnComponetSetList;
}

async function parseComponent(
  compSetNode: ComponentSetNode,
): Promise<StateCssProps> {
  // const cssPropsByState = await formatCssBasedVariants(
  //   compSetNode.children as ComponentNode[],
  // );

  const cssPropsByState = await covertJsonToCss(
    compSetNode.children as ComponentNode[],
  );

  return cssPropsByState;
}

export const getnBtnJson = async () => {
  const frameName = "Buttons";

  const buttonFrame = figma.currentPage.findOne(
    (node) => node.type === "SECTION" && node.name.includes(frameName),
  ) as SectionNode;

  if (buttonFrame) {
    const btnComponetSetList = parseComponentSet(buttonFrame);

    const temp = await parseComponent(btnComponetSetList[0]);

    const dom = domConverter(
      btnComponetSetList[0].children[0] as ComponentNode,
      frameName,
    );

    return {
      dom: dom,
      style: temp,
    };
  }
};
