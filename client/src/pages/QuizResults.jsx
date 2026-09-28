import React from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { ResultCard } from '../components/QuizUI';
import { ErrorState } from '../components/CommonUI';

export function QuizResults() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const results = location.state?.results;

  if (!results) {
    return (
      <div className="p-8 max-w-lg mx-auto">
        <ErrorState
          title="No Recent Results"
          message="No active quiz attempt results found in session."
          onRetry={() => {
            if (id && id !== 'undefined') navigate(`/quiz/${id}`);
            else navigate('/modules');
          }}
        />
      </div>
    );
  }

  return (
    <div className="animate-fade-in py-4">
      <ResultCard
        results={results}
        onRetry={() => {
          if (id && id !== 'undefined') navigate(`/quiz/${id}`);
          else navigate('/modules');
        }}
        onBackToModules={() => navigate('/modules')}
      />
    </div>
  );
}
