export const salesData = [
  { name: 'Jan', revenue: 4000, leads: 24 },
  { name: 'Feb', revenue: 3000, leads: 13 },
  { name: 'Mar', revenue: 5000, leads: 48 },
  { name: 'Apr', revenue: 4780, leads: 39 },
  { name: 'May', revenue: 5890, leads: 48 },
  { name: 'Jun', revenue: 4390, leads: 38 },
  { name: 'Jul', revenue: 6490, leads: 43 },
];

export const marketingData = [
  { name: 'Week 1', engagement: 2.5, reach: 5000 },
  { name: 'Week 2', engagement: 3.1, reach: 6200 },
  { name: 'Week 3', engagement: 2.8, reach: 5800 },
  { name: 'Week 4', engagement: 4.2, reach: 7500 },
];

export const financeData = {
  income: [
    { name: 'Jan', amount: 7200 }, { name: 'Feb', amount: 6500 }, { name: 'Mar', amount: 8100 },
    { name: 'Apr', amount: 7800 }, { name: 'May', amount: 9200 }, { name: 'Jun', amount: 8500 }
  ],
  expenses: [
    { name: 'Jan', amount: 4200 }, { name: 'Feb', amount: 3800 }, { name: 'Mar', amount: 5100 },
    { name: 'Apr', amount: 4500 }, { name: 'May', amount: 5500 }, { name: 'Jun', amount: 4900 }
  ]
};

export const tasks = [
  { id: 1, text: 'Draft Q3 newsletter', completed: false, priority: 'High', dueDate: 'Tomorrow' },
  { id: 2, text: 'Follow up with Acme Corp', completed: false, priority: 'Medium', dueDate: 'In 3 days' },
  { id: 3, text: 'Schedule social media posts for next week', completed: true, priority: 'High', dueDate: 'Yesterday' },
  { id: 4, text: 'Update financial projections', completed: false, priority: 'Low', dueDate: 'Next week' },
  { id: 5, text: 'Onboard new freelance writer', completed: true, priority: 'Medium', dueDate: 'Last week' },
];

export const salesPipeline = {
  'New Leads': [{id: 1, name: 'Innovate LLC', value: 5000}, {id: 2, name: 'Quantum Solutions', value: 12000}],
  'Contacted': [{id: 3, name: 'Synergy Co.', value: 7500}],
  'Proposal Sent': [{id: 4, name: 'Apex Industries', value: 25000}],
  'Negotiation': [{id: 5, name: 'Starlight Tech', value: 18000}],
  'Closed Won': [{id: 6, name: 'Momentum Group', value: 15000}]
};
