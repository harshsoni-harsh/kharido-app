import CategoryClient from "./CategoryClient";

export default async function CategoryPage({ params }) {
  const { categoryId } = await params;

  return <CategoryClient {...{categoryId}} />;
}
