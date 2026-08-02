import { Link } from 'react-router-dom';

export default function RegisterPage() {
  return (
    <div className="page-shell auth-card">
      <h1>Create account</h1>
      <form className="auth-form">
        <label>
          Name
          <input placeholder="Jane Buyer" />
        </label>
        <label>
          Email
          <input placeholder="jane@example.com" />
        </label>
        <button type="button" className="btn btn-primary">Register</button>
        <Link to="/login">Already registered? Login</Link>
      </form>
    </div>
  );
}
