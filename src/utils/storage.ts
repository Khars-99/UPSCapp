import localforage from 'localforage';
import { Document, MCQQuestion, EssayTopic, TestSession, CurrentAffairsItem } from '../types';

// Configure localforage
localforage.config({
  driver: localforage.INDEXEDDB,
  name: 'UPSC_Mentor',
  version: 1.0,
  storeName: 'upsc_data'
});

export const storage = {
  // Documents
  async saveDocument(doc: Document): Promise<void> {
    const docs = await this.getDocuments();
    docs.push(doc);
    await localforage.setItem('documents', docs);
  },

  async getDocuments(): Promise<Document[]> {
    return (await localforage.getItem('documents')) || [];
  },

  async deleteDocument(id: string): Promise<void> {
    const docs = await this.getDocuments();
    const filtered = docs.filter(doc => doc.id !== id);
    await localforage.setItem('documents', filtered);
  },

  // MCQ Questions
  async saveMCQQuestion(question: MCQQuestion): Promise<void> {
    const questions = await this.getMCQQuestions();
    questions.push(question);
    await localforage.setItem('mcq_questions', questions);
  },

  async getMCQQuestions(): Promise<MCQQuestion[]> {
    return (await localforage.getItem('mcq_questions')) || [];
  },

  // Essay Topics
  async saveEssayTopic(topic: EssayTopic): Promise<void> {
    const topics = await this.getEssayTopics();
    topics.push(topic);
    await localforage.setItem('essay_topics', topics);
  },

  async getEssayTopics(): Promise<EssayTopic[]> {
    return (await localforage.getItem('essay_topics')) || [];
  },

  // Test Sessions
  async saveTestSession(session: TestSession): Promise<void> {
    const sessions = await this.getTestSessions();
    sessions.push(session);
    await localforage.setItem('test_sessions', sessions);
  },

  async getTestSessions(): Promise<TestSession[]> {
    return (await localforage.getItem('test_sessions')) || [];
  },

  // Current Affairs
  async saveCurrentAffairsItem(item: CurrentAffairsItem): Promise<void> {
    const items = await this.getCurrentAffairsItems();
    items.push(item);
    await localforage.setItem('current_affairs', items);
  },

  async getCurrentAffairsItems(): Promise<CurrentAffairsItem[]> {
    return (await localforage.getItem('current_affairs')) || [];
  },

  // Settings
  async saveSetting<T>(key: string, value: T): Promise<void> {
    await localforage.setItem(`setting_${key}`, value);
  },

  async getSetting<T>(key: string): Promise<T | null> {
    return await localforage.getItem<T>(`setting_${key}`);
  }
};