import Link from "next/link";

const CategoryCard = ({ imageUrl, category, link }) => {
  return (
    <div className="h-56 xl:h-64 flex flex-col items-center rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform mt-10 p-4">
      <Link href={link} passHref className="size-full">
        <img
          src={imageUrl}
          alt={category}
          className="size-full object-contain"
        />
      </Link>
      {/* Category name below the image */}
      {/* <p className="text-center mt-2 font-semibold">{category}</p> */}
    </div>
  );
};

export default CategoryCard;
