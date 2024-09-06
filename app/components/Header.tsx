import "@/app/styles/header.css";

export default function Header({
  onSave,
  onLogout,
  updateCount,
}: {
  onSave: () => void;
  onLogout: () => void;
  updateCount: number;
}) {
  return (
    <div className="header">
      <h3>PVault</h3>
      <div>
        <button onClick={onLogout} className="outline">
          Logout
        </button>
        <button onClick={onSave} className="primary">
          Update ({updateCount})
        </button>
      </div>
    </div>
  );
}

/*
<div className="header">
          <span className="edit">
            <label>edit</label>
            <input
              type="checkbox"
              onChange={(e) => setCanEdit(e.target.checked)}
            />
          </span>
          <span className="space"></span>
          <button
            className="med"
            onClick={() => {
              update((d) => {
                d.page = "login";
                d.username = "";
                d.password = "";
              });
            }}
          >
            logout
          </button>
          {canEdit && (
            <button className="med" onClick={handleUpdate}>
              Update
            </button>
          )}
        </div>
*/
