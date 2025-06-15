export const calculateFine = (dueDate: Date): number => {
  const now = new Date();
  if (now <= dueDate) return 0;

  const daysOverdue = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
  return daysOverdue * 1; // $1 per day overdue
};