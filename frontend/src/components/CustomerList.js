import './styles.css';

export default function CustomerList({ customers, onDelete, loading }) {
  if (loading) return <div className="loading">Loading customers...</div>;

  if (customers.length === 0) {
    return <div className="empty-state">No customers found. Create one to get started!</div>;
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.full_name}</td>
              <td>{customer.email}</td>
              <td>{customer.phone_number}</td>
              <td>
                <button onClick={() => onDelete(customer.id)} className="btn btn-sm btn-danger">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
