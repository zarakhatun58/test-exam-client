import React, { useState, useEffect } from 'react';
import { Question, AssessmentLevel } from '@/types';
import { Button } from '@/components/ui/button';
import { Table, TableRow, TableCell } from '@/components/ui/table'; // your UI table components
import QuestionForm from '@/components/assessment/QuestionForm';
import { useGetQuestionsByLevelQuery } from '@/store/api/assessmentApi';
import { useDeleteQuestionMutation } from '@/store/api/adminApi';
 // you'll create this form component

interface AdminQuestionsProps {
  level: AssessmentLevel; // filter by level or all
}

const AdminQuestions: React.FC<AdminQuestionsProps> = ({ level }) => {
  const { data, isLoading, error } = useGetQuestionsByLevelQuery({ level, limit: 100 });
  const [deleteQuestion] = useDeleteQuestionMutation();
  const [showForm, setShowForm] = useState(false);
  const [editQuestion, setEditQuestion] = useState<Question | null>(null);

  const onDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      await deleteQuestion(id);
    }
  };

  const onEdit = (question: Question) => {
    setEditQuestion(question);
    setShowForm(true);
  };

  const onAdd = () => {
    setEditQuestion(null);
    setShowForm(true);
  };

  if (isLoading) return <p>Loading questions...</p>;
  if (error) return <p>Error loading questions.</p>;

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Questions for Level {level}</h2>
        <Button onClick={onAdd}>Add New Question</Button>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Question Text</th>
            <th>Competency</th>
            <th>Level</th>
            <th>Options</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.data.map((q) => (
            <tr key={q.id}>
              <td>{q.text}</td>
              <td>{q.competency || '-'}</td>
              <td>{q.level}</td>
              <td>{q.options.join(', ')}</td>
              <td>
                <Button size="sm" variant="outline" onClick={() => onEdit(q)}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => onDelete(q.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {showForm && (
        <QuestionForm
          initialData={editQuestion}
          onClose={() => setShowForm(false)}
          onSuccess={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default AdminQuestions;
