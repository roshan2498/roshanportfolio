/* KageLandingPage, as registered in ThreeUI's LandingPages.tsx
   (SHA-256 4d379461ad00…). `sourceUrl` defaults to the byte-exact packaged
   document; the portfolio passes its own derived copy of that document. */
import { splitTypographyProps, usePageTypography, type PageTypographyProps } from "./pageTypography";
import { LandingPageFrame, type LandingPageProps } from "./LandingPageFrame";
import { KAGE_TYPOGRAPHY } from "./pageRecipes";
export { LandingPageFrame } from "./LandingPageFrame";

type KageLandingPageProps = LandingPageProps & PageTypographyProps & {
  sourceUrl?: string;
  title?: string;
};

export function KageLandingPage({
  sourceUrl = "/landing-pages/kage.html",
  title = "Kage — Where stillness reveals the unseen",
  ...props
}: KageLandingPageProps) {
  const [type, frame] = splitTypographyProps(props);
  const customization = usePageTypography(KAGE_TYPOGRAPHY, type);
  return <LandingPageFrame {...frame} customization={customization} title={title} sourceUrl={sourceUrl} />;
}
