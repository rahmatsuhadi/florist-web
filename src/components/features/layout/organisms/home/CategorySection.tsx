import { FadeInUpWrapper, StaggerWrapper } from "@/components/ui/MotionWrappers";
import { CATEGORIES } from "@/constants/mockData";
import CategoryCard from "@/components/features/product/molecules/CategoryCard";

import { SectionHeading } from "@/components/ui/SectionHeading";

export const CategorySection = () => {
  return (
    <section className="py-24 bg-[#FAFAF7]">
      <div className="container mx-auto px-6">
        <SectionHeading
          title="Koleksi Kami"
          subtitle="Temukan keindahan yang dirangkai khusus untuk setiap momen spesial."
        />
        <StaggerWrapper className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </StaggerWrapper>
      </div>
    </section>
  );
};
