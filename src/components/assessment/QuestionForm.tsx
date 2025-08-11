import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select'; // your dropdown UI
import { Question, AssessmentLevel } from '@/types';
import { useCreateQuestionMutation, useUpdateQuestionMutation } from '@/store/api/adminApi';

interface QuestionFormProps {
  initialData?: Question | null;
  onClose: () => void;
  onSuccess: () => void;
}

const levels: AssessmentLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const QuestionForm: React.FC<QuestionFormProps> = ({ initialData, onClose, onSuccess }) => {
  const [text, setText] = useState(initialData?.text || '');
  const [competency, setCompetency] = useState(initialData?.competency || '');
  const [level, setLevel] = useState<AssessmentLevel>(initialData?.level || 'A1');
  const [options, setOptions] = useState(initialData?.options || ['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(initialData?.correctAnswer || 0);

  // const [addQuestion] = useAddQuestionMutation();
  const [createQuestion] = useCreateQuestionMutation();
  const [updateQuestion] = useUpdateQuestionMutation();

  const onOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

const onSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const questionData = { text, competency, level, options, correctAnswer };

  if (initialData) {
    await updateQuestion({ id: initialData.id, data: questionData });
  } else {
    await createQuestion(questionData);
  }
  onSuccess();
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <form onSubmit={onSubmit} className="bg-white p-6 rounded shadow-lg w-96">
        <h3 className="text-xl mb-4">{initialData ? 'Edit Question' : 'Add New Question'}</h3>
        
        <label>Question Text</label>
        <Input value={text} onChange={(e) => setText(e.target.value)} required />

        <label>Competency</label>
        <Input value={competency} onChange={(e) => setCompetency(e.target.value)} />

        <label>Level</label>
        <Select value={level} onValueChange={(value) => setLevel(value as AssessmentLevel)}>
          {levels.map((lvl) => <option key={lvl} value={lvl}>{lvl}</option>)}
        </Select>

        <label>Options</label>
        {options.map((opt, idx) => (
          <Input
            key={idx}
            value={opt}
            onChange={(e) => onOptionChange(idx, e.target.value)}
            required
            placeholder={`Option ${String.fromCharCode(65 + idx)}`}
          />
        ))}

        <label>Correct Answer</label>
        <Select value={correctAnswer.toString()} onValueChange={(value) => setCorrectAnswer(parseInt(value))}>
          {options.map((_, idx) => (
            <option key={idx} value={idx}>{String.fromCharCode(65 + idx)}</option>
          ))}
        </Select>

        <div className="mt-4 flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">{initialData ? 'Update' : 'Add'}</Button>
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;
