import ProtectedRoute from "./ProtectedRoute";

const Page = () => {
  return (
    <ProtectedRoute>
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold">Protected Page</h1>
        <p>Only authorized users can access this page.</p>
      </div>
    </ProtectedRoute>
  );
};

export default Page;
