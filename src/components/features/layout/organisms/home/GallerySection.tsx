import Image from "next/image";
import { GalleryItemData } from "@/services/admin/contentService";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CustomMotionWrapper } from "@/components/ui/MotionWrappers";

export const GallerySection = ({ items }: { items: GalleryItemData[] }) => {
  const activeGallery = items.filter((g) => g.isActive).sort((a, b) => a.position - b.position);

  if (activeGallery.length === 0) return null;

  return (
    <section className="py-24 bg-[#FAFAF7]">
      <div className="container mx-auto px-6">
        <SectionHeading
          title="Galeri Inspirasi"
          subtitle="Potret keindahan hasil kreasi florist profesional kami."
        />
        <CustomMotionWrapper
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-[repeat(3,_200px)] gap-4 max-w-6xl mx-auto w-full"
        >
          {activeGallery.map((item, index) => (
            <div
              key={item.id || `gallery-${index}`}
              className={`relative overflow-hidden group rounded-sm shadow-sm bg-gray-200 aspect-[4/3] md:aspect-auto ${item.gridClass}`}
            >
              <Image
                src={item.imageUrl}
                alt={item.altText}
                fill
                quality={80}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
          ))}
        </CustomMotionWrapper>
      </div>
    </section>
  );
};
