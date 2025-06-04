import { cn } from "src/shared/utils";

function OriginalTable(props: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="my-6 overflow-x-auto w-fit rounded-lg border border-gray-200 shadow-sm dark:border-neutral-700">
      <table {...props} className={cn(props.className)} />
    </div>
  );
}

const StyledThead = (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead
    {...props}
    className={cn(props.className, "bg-gray-50 dark:bg-neutral-800")}
  />
);

const StyledTbody = (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody
    {...props}
    className={cn(
      props.className,
      "divide-y divide-gray-200 bg-white dark:divide-neutral-700 dark:bg-neutral-900"
    )}
  />
);

const StyledTr = (props: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr
    {...props}
    className={cn(
      props.className,
      "border-b border-gray-200 hover:bg-gray-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
    )}
  />
);

const StyledTh = (props: React.HTMLAttributes<HTMLTableCellElement>) => (
  <th
    {...props}
    className={cn(
      props.className,
      "border-b border-gray-300 px-4 py-2 text-left font-semibold text-gray-700 dark:border-neutral-600 dark:text-neutral-200"
    )}
  />
);

const StyledTd = (props: React.HTMLAttributes<HTMLTableCellElement>) => (
  <td
    {...props}
    className={cn(
      props.className,
      "px-4 whitespace-pre-wrap py-2 text-gray-700 dark:text-neutral-300"
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
