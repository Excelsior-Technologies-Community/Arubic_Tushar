export default function Services() {
  return (
    <>
      <button className="btn-add">
        Add Service
      </button>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Service</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>1</td>
            <td>Web Development</td>
            <td>Active</td>
            <td>Edit Delete</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}