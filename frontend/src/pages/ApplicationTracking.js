import React, { useEffect, useState } from "react";
import applicationApi from "../api/applicationApi";
import ApplicationCard from "../components/ApplicationCard";

export default function ApplicationTracking() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await applicationApi.list();
        setApplications(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">My Applications</h2>
      {loading ? (
        <div>Loading...</div>
      ) : applications.length === 0 ? (
        <div className="text-gray-500">No applications yet.</div>
      ) : (
        <div className="grid gap-4">
          {applications.map(app => (
            <ApplicationCard key={app._id} application={app} />
          ))}
        </div>
      )}
    </main>
  );
}