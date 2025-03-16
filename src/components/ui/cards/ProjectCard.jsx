import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProjectCard = ({ project, userInfo }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/project/${project._id}`);
  };

  const isCreator = project.owner?._id === userInfo?._id;
  const creatorLabel = isCreator ? 'Created by You' : `Created by ${project.owner?.name || 'Unknown'}`;
  const bgColor = isCreator ? 'bg-green-500' : 'bg-blue-500';
  useEffect(()=>{
    
  },[])
  return (
    <div
      className="relative min-w-sm max-w-2xl bg-white p-4 rounded shadow-md hover:shadow-lg transition cursor-pointer"
      onClick={handleClick}
    >
      <div className={`absolute top-2 right-2 px-2 py-1 text-white text-xs font-semibold rounded ${bgColor}`}>
        {creatorLabel}
      </div>
      <h3 className="text-xl font-semibold text-gray-800">{project.name}</h3>
      <p className="text-gray-600">Estimated Budget: ₹{project.estimatedBudget}</p>
      <p className="text-gray-400 text-sm">
        End Date: {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}
      </p>
      {project.collaborators?.length > 0 && (
        <p className="text-gray-500">Collaborators: {project.collaborators.length}</p>
      )}
    </div>
  );
};

export default ProjectCard;
