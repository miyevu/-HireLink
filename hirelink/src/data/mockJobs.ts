export const JOBS = [
  { id: '1', title: 'Frontend Engineer', company: 'TechCorp', date: 2, location: 'Remote', salary: '$120k - $150k', type: 'Full-time' },
  { id: '2', title: 'Backend Developer', company: 'DataSystems', date: 3, location: 'Accra', salary: '$130k - $160k', type: 'Full-time' },
  { id: '3', title: 'Product Manager', company: 'Innovate Inc', date: 5, location: 'Spintex', salary: '$140k - $180k', type: 'Contract' },
];

export const getJobTitle = (id: string) => {
  const job = JOBS.find(j => j.id === id);
  return job ? job.title : 'Unknown Role';
};