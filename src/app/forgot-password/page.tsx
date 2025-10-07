// File: src/app/reset-password/page.tsx

import { updateUserPassword } from './actions';

export default function ResetPassword({
  searchParams,
}: {
  searchParams: { message: string; code: string };
}) {
  return (
    <div>
      <h2>Reset Your Password</h2>
      <p>Please enter your new password below.</p>

      <form>
        <label htmlFor="password">New Password:</label>
        <input type="password" id="password" name="password" required />
        <br />
        <label htmlFor="confirmPassword">Confirm New Password:</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          required
        />
        <br />
        <button formAction={updateUserPassword}>Update Password</button>
      </form>

      {searchParams.message && (
       <p className="form-error">
          {searchParams.message}
        </p>
      )}
    </div>
  );
}