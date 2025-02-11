import { StatusEnum } from "@/lib/constants";

export interface StatusButtonProps {
  status_id: number;
  status: string;
}

export default function StatusButton(props: StatusButtonProps) {
  const { status_id, status } = props;
  return (
    <>
      {StatusEnum.active === status_id ? (
        <h1 className="truncate text-center rtl:text-md-rtl ltr:px-2 ltr:text-md-ltr bg-green-500 rtl:px-1 py-[2px] shadow-md text-primary-foreground font-bold rounded-sm">
          {status}
        </h1>
      ) : StatusEnum.blocked === status_id ? (
        <h1 className="truncate text-center rtl:text-md-rtl ltr:px-2 ltr:text-md-ltr bg-red-500 rtl:px-1 py-[2px] shadow-md text-primary-foreground font-bold rounded-sm">
          {status}
        </h1>
      ) : StatusEnum.not_logged_in === status_id ? (
        <h1 className="truncate text-center rtl:text-md-rtl ltr:px-2 ltr:text-md-ltr bg-slate-400 rtl:px-1 py-[2px] shadow-md text-primary-foreground font-bold rounded-sm">
          {status}
        </h1>
      ) : (
        <h1 className="truncate text-center rtl:text-md-rtl ltr:px-2 ltr:text-md-ltr bg-orange-500 rtl:px-1 py-[2px] shadow-md text-primary-foreground font-bold rounded-sm">
          {status}
        </h1>
      )}
    </>
  );
}
