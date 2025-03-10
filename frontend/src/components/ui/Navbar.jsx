import React from "react";
import Link from "next/link";

function Navbar() {
  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 shadow-md h-16 bg-white px-4 md:px-6">
        <div className=" text-black   flex flex-row  gap-4 md:gap-8 mt-3 justify-between">
          <div className="flex flex-row  gap-6 md:gap-10">
            <div className="px-4  text-3xl font-semibold">
              <span className="text-green-500">{`Khareedo`}</span>
            </div>
            <div>
              <div className="hidden lg:flex  items-center">
                <ul className="flex flex-row gap-6 mt-2 ">
                  <li>
                    <Link href={"/"}>Home</Link>
                  </li>
                  <li>
                    <Link href={"/"}>Shope</Link>
                  </li>
                  <li>
                    <Link href={"/"}>About us</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-4 md:gap-6">
            <input
              type="text"
              placeholder="Search"
              className="h-10 w-[24rem] md:w-[30rem] px-4 border border-gray-300 hover:border-gray-400 rounded-xl focus:outline-none 
              focus:ring-2 focus:ring-gray-300 bg-white shadow-sm"
            />

            <div className="cursor-pointer">
              <img
                src = "/profile.svg"
                alt = "Profile"
                className="w-9 h-9 rounded-full mt-0.5"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;

{
  /* <div className="navbar fixed top-0 left-0 w-full z-50 shadow-sm dark:bg-black px-4 md:px-8 ">
  <div className="flex w-full justify-between items-center">
    <div className="flex items-center gap-4">
      <div className="dropdown">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost lg:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h8m-8 6h16"
            />
          </svg>
        </div>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
        >
          <li>
            <a>Home</a>
          </li>
          <li>
            <a>Parent</a>
            <ul className="p-2">
              <li>
                <a>Fruits and Vegetables</a>
              </li>
              <li>
                <a>Drinks</a>
              </li>
              <li>
                <a>Atta, Dal, and Rice</a>
              </li>
              <li>
                <a>Breakfast and Sauces</a>
              </li>
              <li>
                <a>Packaged food</a>
              </li>
            </ul>
          </li>
          <li>
            <a>Deals</a>
          </li>
        </ul>
      </div>
      <a className="btn btn-ghost text-3xl"><span className="text-green-600">{`Khareedo`}</span></a>
    </div>

    <div className="flex flex-row items-center lg:gap-16">
      <div className="hidden lg:flex  items-center">
        <ul className="menu menu-horizontal px-1 text-base">
          <li>
            <a>Home</a>
          </li>
          <li>
            <details>
              <summary>Categories</summary>
              <ul className="p-2">
                <li>
                  <a>Fruits and Vegetables</a>
                </li>
                <li>
                  <a>Drinks</a>
                </li>
                <li>
                  <a>Atta, Dal, and Rice</a>
                </li>
                <li>
                  <a>Breakfast and Sauces</a>
                </li>
                <li>
                  <a>Packaged food</a>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <a>Deals</a>
          </li>
        </ul>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <input
          type="text"
          placeholder="Search"
          className="input input-bordered w-24 md:w-[32rem]"
        />
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle"
          >
            <div className="indicator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="badge badge-sm indicator-item">8</span>
            </div>
          </div>
          <div
            tabIndex={0}
            className="card card-compact dropdown-content bg-base-100 z-10 mt-3 w-52 shadow"
          >
            <div className="card-body">
              <span className="text-lg font-bold">8 Items</span>
              <span className="text-info">Subtotal: $999</span>
              <div className="card-actions">
                <button className="btn btn-primary btn-block">
                  View cart
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="User Profile"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="justify-between">
                Profile <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div> */
}
