import { cx } from "class-variance-authority";
import { run } from "~/lib/utils";
import { useSyncTasks } from "../_hooks/useTasks";

export const SubscriptionStatus = (props: {
  subscription: ReturnType<typeof useSyncTasks>["subscription"];
}) => {
  const { subscription } = props;
  return (
    <div
      className={cx(
        "rounded-full p-2 text-sm transition-colors",
        run(() => {
          switch (subscription.status) {
            case "idle":
            case "connecting":
              return "bg-white text-gray-500 dark:bg-gray-900 dark:text-gray-400";
            case "error":
              return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
            case "pending":
              return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200";
          }
        }),
      )}
    >
      {run(() => {
        switch (subscription.status) {
          case "idle":
          case "connecting":
            // treat idle and connecting the same

            return (
              <div>
                Connecting...
                {subscription.error && " (There are connection problems)"}
              </div>
            );
          case "error":
            // something went wrong
            return (
              <div>
                Error - <em>{subscription.error.message}</em>
                <a
                  href="#"
                  onClick={() => {
                    subscription.reset();
                  }}
                  className="hover underline"
                >
                  Try Again
                </a>
              </div>
            );
          case "pending":
            // we are polling for new messages
            return <div>Connected - awaiting messages</div>;
        }
      })}
    </div>
  );
};
