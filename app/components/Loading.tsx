import { useAppContext } from "../AppContext";

export function LoadSpin() {
  return <img className="loading" src="/vault.png" alt="Loading" />;
}

export function LoadingBox() {
  const { isLoading } = useAppContext();
  if (!isLoading) {
    return null;
  }
  return (
    <div className="loading-box">
      <LoadSpin />
    </div>
  );
}
