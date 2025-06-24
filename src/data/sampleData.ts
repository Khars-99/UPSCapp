import { MCQQuestion, EssayTopic } from '../types';

export const sampleMCQQuestions: MCQQuestion[] = [
  {
    id: '1',
    question: 'Which of the following best describes the Indus Valley Civilization?',
    options: [
      'A primarily agricultural civilization with no urban planning',
      'A highly urbanized civilization with advanced drainage systems',
      'A nomadic civilization with temporary settlements',
      'A civilization focused mainly on trade with no agricultural base'
    ],
    correctAnswer: 1,
    explanation: 'The Indus Valley Civilization was known for its highly planned cities with sophisticated drainage and water management systems.',
    category: 'GS1',
    difficulty: 'Medium'
  },
  {
    id: '2',
    question: 'The Right to Information Act was enacted in which year?',
    options: ['2003', '2005', '2007', '2009'],
    correctAnswer: 1,
    explanation: 'The Right to Information Act was enacted in 2005 to promote transparency and accountability in governance.',
    category: 'GS2',
    difficulty: 'Easy'
  },
  {
    id: '3',
    question: 'Which of the following is the primary greenhouse gas responsible for global warming?',
    options: ['Methane', 'Carbon Dioxide', 'Nitrous Oxide', 'Fluorinated gases'],
    correctAnswer: 1,
    explanation: 'Carbon dioxide is the most abundant greenhouse gas in the atmosphere and the primary driver of climate change.',
    category: 'GS3',
    difficulty: 'Easy'
  },
  {
    id: '4',
    question: 'The concept of "Satyagraha" was developed by:',
    options: ['Bal Gangadhar Tilak', 'Mahatma Gandhi', 'Jawaharlal Nehru', 'Subhas Chandra Bose'],
    correctAnswer: 1,
    explanation: 'Satyagraha, meaning "holding onto truth," was developed by Mahatma Gandhi as a method of non-violent resistance.',
    category: 'GS4',
    difficulty: 'Easy'
  },
  {
    id: '5',
    question: 'The Mauryan Empire was founded by:',
    options: ['Chandragupta Maurya', 'Ashoka', 'Bindusara', 'Chanakya'],
    correctAnswer: 0,
    explanation: 'Chandragupta Maurya founded the Mauryan Empire around 321 BCE with the help of Chanakya.',
    category: 'GS1',
    difficulty: 'Easy'
  }
];

export const sampleEssayTopics: EssayTopic[] = [
  {
    id: '1',
    topic: 'Digital India: Opportunities and Challenges in the 21st Century',
    category: 'GS3',
    wordLimit: 1000,
    timeLimit: 60
  },
  {
    id: '2',
    topic: 'Role of Women in Nation Building: Past, Present and Future',
    category: 'GS1',
    wordLimit: 1000,
    timeLimit: 60
  },
  {
    id: '3',
    topic: 'Climate Change and Sustainable Development: India\'s Path Forward',
    category: 'GS3',
    wordLimit: 1000,
    timeLimit: 60
  },
  {
    id: '4',
    topic: 'Ethics in Public Administration: Challenges and Solutions',
    category: 'GS4',
    wordLimit: 1000,
    timeLimit: 60
  },
  {
    id: '5',
    topic: 'Federalism in India: Balancing Centre-State Relations',
    category: 'GS2',
    wordLimit: 1000,
    timeLimit: 60
  }
];

export const syllabusStructure = {
  GS1: [
    'Indian History and Culture',
    'Geography of India and World',
    'Society and Social Issues'
  ],
  GS2: [
    'Governance and Constitution',
    'Government Policies and Interventions',
    'International Relations'
  ],
  GS3: [
    'Economic Development',
    'Science and Technology',
    'Environment and Disaster Management',
    'Internal Security'
  ],
  GS4: [
    'Ethics and Human Interface',
    'Attitude and Aptitude',
    'Emotional Intelligence',
    'Public Service Values'
  ]
};