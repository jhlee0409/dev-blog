function ArrowIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="mt-20 mb-16 py-8 border-t border-neutral-200 dark:border-neutral-800">
      <ul className="font-sm flex flex-col space-x-0 space-y-3 text-neutral-600 md:flex-row md:space-x-6 md:space-y-0 dark:text-neutral-300">
        <li>
          <a
            className="flex items-center transition-all duration-200 hover:text-neutral-800 dark:hover:text-neutral-100 group"
            rel="noopener noreferrer"
            target="_blank"
            href="/rss"
          >
            <span className="transform transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowIcon />
            </span>
            <p className="ml-2 h-7 font-medium">RSS</p>
          </a>
        </li>
      </ul>
      <p className="mt-8 text-sm text-neutral-500 dark:text-neutral-400">
        © {new Date().getFullYear()} MIT Licensed
      </p>
    </footer>
  );
}
