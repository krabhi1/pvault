export default function NetworkStatus({
  isOnline = false,
}: {
  isOnline?: boolean;
}) {
  if (isOnline) {
    return (
      <span className="rounded-full bg-green-100 py-0.5 px-2 border border-transparent text-xs text-slate-600 transition-all shadow-s">
        online
      </span>
    );
  }
  return (
    <span className="rounded-full bg-red-100 py-0.5 px-2 border border-transparent text-xs text-slate-600 transition-all shadow-s">
      offline
    </span>
  );
}
