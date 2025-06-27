import { cn } from "src/shared/utils";

function OriginalTable(props: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="my-8 overflow-x-auto w-full max-w-full rounded-xl border border-neutral-200 shadow-md dark:border-neutral-700">
      <table {...props} className={cn("min-w-full", props.className)} />
    </div>
  );
}

const StyledThead = (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead
    {...props}
    className={cn(props.className, "bg-neutral-50 dark:bg-neutral-800")}
  />
);

const StyledTbody = (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody
    {...props}
    className={cn(
      props.className,
      "divide-y divide-neutral-200 bg-white dark:divide-neutral-700 dark:bg-neutral-900"
    )}
  />
);

const StyledTr = (props: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr
    {...props}
    className={cn(
      props.className,
      "border-b border-neutral-200 hover:bg-neutral-50 transition-colors duration-150 dark:border-neutral-700 dark:hover:bg-neutral-800/50"
    )}
  />
);

const StyledTh = (props: React.HTMLAttributes<HTMLTableCellElement>) => (
  <th
    {...props}
    className={cn(
      props.className,
      "border-b border-neutral-300 px-6 py-3 text-left font-semibold text-neutral-700 dark:border-neutral-600 dark:text-neutral-200 sm:px-4 sm:py-2"
    )}
  />
);

const StyledTd = (props: React.HTMLAttributes<HTMLTableCellElement>) => (
  <td
    {...props}
    className={cn(
      props.className,
      "px-6 whitespace-pre-wrap py-3 text-neutral-700 dark:text-neutral-300 sm:px-4 sm:py-2"
    )}
  />
);

export const Table = Object.assign(OriginalTable, {
  Thead: StyledThead,
  Tbody: StyledTbody,
  Tr: StyledTr,
  Th: StyledTh,
  Td: StyledTd,
});
