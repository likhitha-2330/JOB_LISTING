import React from "react";
import { Link } from "react-router-dom";
import { formatLocation } from "../utils/formatLocation";

export default function ApplicationCard({ application }) {
  const { job = {}, status, createdAt } = application;
  const statusColor = {
    applied: "bg-gray-100 text-gray-700",
    interview: "bg-yellow-100 text-yellow-800",
    offered: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800"
  }[status] || "bg-gray-100 text-gray-700";

  return (
    <article className="bg-white rounded-2xl shadow-lg p-4 hover:shadow-2xl transition-all flex justify-between items-center">
      <div>
        <Link to={`/jobs/${job._id}`} className="text-lg font-semibold text-indigo-600">
          {job.title}
        </Link>
        <div className="text-sm text-gray-500">{job.company?.name} • {formatLocation(job.location)}</div>
      </div>

      <div className="text-right">
        <div className={`inline-block px-3 py-1 rounded-full text-sm ${statusColor}`}>{status}</div>
        <div className="text-xs text-gray-400 mt-1">{new Date(createdAt).toLocaleDateString()}</div>
      </div>
    </article>
  );
}