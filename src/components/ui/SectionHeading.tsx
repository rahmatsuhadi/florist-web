import { FadeInUpWrapper } from "@/components/ui/MotionWrappers";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  level?: "h1" | "h2";
}

export const SectionHeading = ({ title, subtitle, level = "h2" }: SectionHeadingProps) => {
  const HeadingTag = level;
  return (
    <FadeInUpWrapper className="text-center mb-12">
      <HeadingTag className="font-playfair text-4xl md:text-5xl text-[#2C302E] mb-4">
        {title}
      </HeadingTag>
      {subtitle && (
        <p className="font-sans text-[#5A635E] max-w-2xl mx-auto">{subtitle}</p>
      )}
    </FadeInUpWrapper>
  );
};
