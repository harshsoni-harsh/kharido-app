import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grow flex flex-col justify-center items-center">
      <h2>Page Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/" className="text-blue-800 hover:underline">
        Return Home
      </Link>
    </div>
  );
}
