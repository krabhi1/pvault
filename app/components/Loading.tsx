export function LoadSpin() {
  return <img className="loading" src="/vault.png" alt="Loading" />;
}

export function LoadingBox({ isLoading }: { isLoading?: boolean }) {
  if (!isLoading) return null;
  return (
    <div className="loading-box">
      <LoadSpin />
    </div>
  );
}
