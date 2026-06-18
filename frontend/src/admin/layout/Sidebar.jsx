import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const menu = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Services", path: "/admin/services" },
    { name: "Products", path: "/admin/products" },
    { name: "Team", path: "/admin/team" },
    { name: "Blogs", path: "/admin/blogs" },
    { name: "Messages", path: "/admin/messages" },
    { name: "Settings", path: "/admin/settings" },
  ];

  return (
    <aside className="sidebar">
      <div className="logo">
        <h2 className="admin-logo"><span className="arb-logo__a">A</span>RUBIC</h2>
        <div className="arb-logo__sub">Online store template</div>
      </div>

      {menu.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className="menu-link"
        >
          {item.name}
        </NavLink>
      ))}
    </aside>
  );
}
