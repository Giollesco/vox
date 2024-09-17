export interface Lesson {
  title: string;
  description: string;
  imageUrl: string;
  textStyle: 'light' | 'dark';
  progress: number;
}

const lessons: Lesson = {
  title: 'Hidden chest in my bedroom',
  progress: 0.3,
  description: 'Trenutna lekcija (12) - 3. poglavlje',
  textStyle: 'light',
  imageUrl:
    'https://thumbs.dreamstime.com/b/children-scandinavia-go-to-school-ai-generated-illustration-294880285.jpg',
};

export { lessons };
