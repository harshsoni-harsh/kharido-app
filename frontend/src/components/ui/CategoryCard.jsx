import Link from "next/link";

const CategoryCard = ({ imageUrl, category, link }) => {
  return (
    <div className="w-48 h-56 flex flex-col items-center rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform mt-10">
      <Link href={link} passHref className="w-full h-48">
        <img
          src={imageUrl}
          alt={category}
          className="w-full h-full object-cover"
        />
      </Link>
      {/* Category name below the image */}
      <p className="text-center mt-2 font-semibold">{category}</p>
    </div>
  );
};

export default CategoryCard;
